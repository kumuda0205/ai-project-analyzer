import { redactSecrets } from '../utils/secretRedactor.js';
import { robustJsonParse, normalizeAnalysisReport } from '../utils/jsonParser.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getApiKey() {
  const apiKey = process.env.EXPLABS_API_KEY;
  if (!apiKey || apiKey === 'your_experiential_labs_api_key_here' || apiKey.trim() === '') {
    throw new Error(
      'EXPLABS_API_KEY environment variable is not configured. Please set your Experiential Labs API Key in server/.env file.'
    );
  }
  return apiKey;
}

function getModelName() {
  return process.env.EXPLABS_MODEL || 'openrouter-free';
}

function getBaseUrl() {
  const rawBase = process.env.EXPLABS_BASE_URL || 'https://api.experientiallabs.ai/v1';
  return rawBase.replace(/\/+$/, '');
}

async function callExperientialLabsAi({ system, prompt, maxTokens = 3500, retries = 3 }) {
  const apiKey = getApiKey();
  const model = getModelName();
  const baseUrl = getBaseUrl();
  const endpoint = `${baseUrl}/chat/completions`;

  const messages = [];
  if (system) {
    messages.push({ role: 'system', content: system });
  }
  messages.push({ role: 'user', content: prompt });

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: model,
          max_tokens: maxTokens,
          messages: messages,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`[Experiential Labs API Error] Status ${res.status}:`, errorText.slice(0, 250));

        if (res.status === 401 || errorText.includes('401') || errorText.includes('invalid') || errorText.includes('authentication')) {
          throw new Error(
            'Authentication Error (Experiential Labs API): Invalid API Key. Please verify EXPLABS_API_KEY in server/.env.'
          );
        }

        if (res.status === 429 || errorText.includes('429') || errorText.includes('rate_limit') || errorText.includes('throttled')) {
          if (attempt <= retries) {
            // Extract suggested retry delay if present (e.g. "retry in 26s")
            let waitMs = attempt * 5000;
            const matchSeconds = errorText.match(/retry in (\d+)s/i);
            if (matchSeconds && matchSeconds[1]) {
              waitMs = (parseInt(matchSeconds[1], 10) + 2) * 1000;
            }

            console.log(`[Rate Limit Guard] Throttled on attempt ${attempt}. Waiting ${(waitMs / 1000).toFixed(1)}s before retry...`);
            await sleep(waitMs);
            continue;
          }
          throw new Error(
            'Experiential Labs API Rate Limit: Gateway request was throttled. Please wait a moment and try again.'
          );
        }

        throw new Error(`Experiential Labs API returned error (${res.status}): ${errorText.slice(0, 200)}`);
      }

      const data = await res.json();
      const choice = data.choices && data.choices[0];
      const responseText = choice?.message?.content || choice?.text || '';

      if (!responseText) {
        throw new Error('Experiential Labs API returned an empty response.');
      }

      return responseText;
    } catch (err) {
      if (attempt <= retries && (err.message?.includes('Rate Limit') || err.message?.includes('throttled') || err.message?.includes('fetch failed'))) {
        const waitMs = attempt * 5000;
        console.log(`[Retry Guard] Error on attempt ${attempt}. Waiting ${(waitMs / 1000).toFixed(1)}s...`);
        await sleep(waitMs);
        continue;
      }
      throw err;
    }
  }
}

/**
 * Attempts to parse raw AI text into JSON.
 * If initial parsing fails, executes one controlled AI repair request to format into valid JSON.
 */
async function safeParseOrRepairJson(rawText, schemaHint = '') {
  console.log('[AI Synthesis Log] Response received (Length:', rawText.length, 'chars). Attempting JSON parse...');

  // 1. Try robust local parsing & sanitization
  let parsedObj = robustJsonParse(rawText);

  if (parsedObj) {
    console.log('[AI Synthesis Log] Direct JSON parsing & sanitization succeeded!');
    return parsedObj;
  }

  // 2. Controlled AI Repair Attempt
  console.warn('[AI Synthesis Log] Initial JSON parse failed. Attempting controlled AI repair attempt...');
  await sleep(3000); // Inter-stage rate limit spacing

  const repairPrompt = `
You are a JSON repair engine.
Convert the malformed or truncated AI output below into strictly valid, un-truncated, raw JSON matching this schema:
${schemaHint}

CRITICAL RULES FOR REPAIR:
1. Do NOT wrap output in markdown code fences (\`\`\`json).
2. Escape all unescaped newlines as \\n inside strings.
3. Escape all unescaped double quotes inside strings.
4. Ensure all brackets, braces, and strings are cleanly closed.
5. Return ONLY raw JSON text.

MALFORMED TEXT snippet to repair:
${rawText.slice(0, 6000)}
`;

  try {
    const repairedText = await callExperientialLabsAi({
      system: 'You are a JSON repair tool. Return ONLY raw, valid, un-truncated JSON.',
      prompt: repairPrompt,
      maxTokens: 3500,
    });

    console.log('[AI Synthesis Log] Repair response received (Length:', repairedText.length, 'chars). Parsing...');
    parsedObj = robustJsonParse(repairedText);

    if (parsedObj) {
      console.log('[AI Synthesis Log] Repair attempt succeeded!');
      return parsedObj;
    } else {
      console.warn('[AI Synthesis Log] Repair attempt parsed to null. Using schema fallback normalizer.');
    }
  } catch (repairErr) {
    console.warn('[AI Synthesis Log] Repair attempt failed with error:', repairErr.message);
  }

  return null;
}

export async function analyzeProjectWithClaude({ projectTree, selectedFiles, allFilePathList, onProgress }) {
  // STAGE 1: Project Discovery
  if (onProgress) onProgress('Detecting technologies & project structure...');

  const configFilesContent = selectedFiles
    .filter((f) => f.score >= 90 || f.name.includes('package') || f.name.includes('config') || f.name.includes('pyproject'))
    .map((f) => `--- FILE: ${f.path} ---\n${f.content.slice(0, 2500)}`)
    .join('\n\n');

  const discoveryPrompt = `
You are an expert software architect analyzing a codebase.
Project file paths list (${allFilePathList.length} files total):
${allFilePathList.slice(0, 250).join('\n')}

Configuration / Metadata Files:
${configFilesContent || 'No config files detected.'}

Return a valid JSON object ONLY with the following structure:
{
  "projectName": "Name of project derived from metadata or folder",
  "projectType": "e.g. Full-Stack Web App / REST API / Frontend App / CLI Tool / Library",
  "summary": "Concise overview of what this project does (2-3 sentences)",
  "mainPurpose": "Core problem solved by this application",
  "majorFeatures": ["Feature 1", "Feature 2", "Feature 3"],
  "languages": ["JavaScript", "Python", etc.],
  "frameworks": ["React", "Express", etc.],
  "backend": "Backend technology or None",
  "frontend": "Frontend technology or None",
  "database": "Database technology or None",
  "buildTools": ["Vite", "Webpack", etc.]
}
DO NOT wrap output in conversational text. Return raw JSON.
`;

  let stage1Result = {};
  try {
    const discoveryText = await callExperientialLabsAi({
      system: 'You are a code analysis system. Respond ONLY with valid raw JSON.',
      prompt: discoveryPrompt,
      maxTokens: 1500,
    });
    stage1Result = (await safeParseOrRepairJson(discoveryText)) || {};
  } catch (err) {
    if (err.message?.includes('EXPLABS_API_KEY') || err.message?.includes('Authentication Error')) {
      throw err;
    }
    console.warn('[Stage 1 Warning] Proceeding with fallback discovery data:', err.message);
    stage1Result = {
      projectName: 'Uploaded Project',
      projectType: 'Software Application',
      summary: 'Project source code uploaded for automated analysis.',
      mainPurpose: 'Software application implementation.',
      majorFeatures: ['Source code structure'],
      languages: [],
      frameworks: [],
    };
  }

  // Inter-stage rate limit spacing
  await sleep(3500);

  // STAGE 2: Module & Code Analysis
  if (onProgress) onProgress('Analyzing key source files & modules...');

  const codeSnippets = selectedFiles
    .slice(0, 8)
    .map((f) => `=== FILE: ${f.path} (${f.size} bytes) ===\n${f.content.slice(0, 2000)}`)
    .join('\n\n');

  const modulePrompt = `
Analyze these key project source files:

${codeSnippets}

Return a JSON array ONLY where each element represents an analyzed file/module with this exact schema:
[
  {
    "filePath": "relative/path/to/file",
    "purpose": "What this file does (1 sentence)",
    "keyExports": ["main export / key functions / components"],
    "dependencies": ["imported libraries/modules"],
    "qualityObservations": "Code quality assessment",
    "maintainabilityScore": "Good" | "Fair" | "Needs Improvement",
    "potentialIssues": ["Any potential bugs or design flaws observed"]
  }
]
Return ONLY valid raw JSON.
`;

  let stage2Result = [];
  try {
    const moduleText = await callExperientialLabsAi({
      system: 'You are a deep code analysis system. Respond ONLY with valid raw JSON array.',
      prompt: modulePrompt,
      maxTokens: 2200,
    });
    stage2Result = (await safeParseOrRepairJson(moduleText)) || [];
  } catch (err) {
    if (err.message?.includes('EXPLABS_API_KEY') || err.message?.includes('Authentication Error')) {
      throw err;
    }
    console.warn('[Stage 2 Warning] Proceeding with empty module analysis:', err.message);
    stage2Result = [];
  }

  // Inter-stage rate limit spacing
  await sleep(3500);

  // STAGE 3: Final Synthesis
  if (onProgress) onProgress('Synthesizing architecture, issues, README & viva questions...');

  const synthesisSchemaHint = `
{
  "overview": { "projectName": "", "projectType": "", "summary": "", "mainPurpose": "", "majorFeatures": [], "languages": [], "frameworks": [], "backend": "", "frontend": "", "database": [], "buildTools": [] },
  "techStack": [ { "category": "", "name": "", "detectionSource": "" } ],
  "architecture": { "summary": "", "components": [], "dataFlow": "", "apiFlow": "", "frontendBackendComm": "", "storageInteraction": "", "mermaidDiagram": "graph TD\\n  A --> B" },
  "modules": [],
  "issues": [ { "title": "", "severity": "Critical|Warning|Improvement", "affectedFile": "", "explanation": "", "impact": "", "suggestedFix": "" } ],
  "recommendations": [ { "category": "", "title": "", "description": "", "evidence": "" } ],
  "documentation": { "readmeMarkdown": "# Title\\n\\nSummary..." },
  "vivaQuestions": [ { "id": 1, "category": "", "question": "", "suggestedAnswer": "", "relatedFile": "" } ]
}
`;

  const synthesisPrompt = `
You are an expert principal software engineer and technical interviewer.
Synthesize the final analysis report for "${stage1Result.projectName || 'Uploaded Project'}".

Discovery Data:
${JSON.stringify(stage1Result, null, 2)}

Module Analysis Highlights:
${JSON.stringify(stage2Result.slice(0, 6), null, 2)}

CRITICAL FORMATTING INSTRUCTIONS:
1. Respond ONLY with raw, strictly valid JSON. Do NOT wrap in markdown code fences (\`\`\`json).
2. ALL newline characters inside text fields MUST be escaped as \\n.
3. Keep text concise and compact so the payload fits within 3500 tokens.
4. Provide 10-15 concise viva questions under "vivaQuestions".
5. Provide a clear Mermaid diagram string in "architecture.mermaidDiagram" (e.g. "graph TD\\n  Client --> Server").

JSON SCHEMA TO RETURN:
${synthesisSchemaHint}
`;

  let rawSynthesisObj = null;
  try {
    const synthesisText = await callExperientialLabsAi({
      system: 'You are an advanced software analysis pipeline. Respond ONLY with strictly valid raw JSON.',
      prompt: synthesisPrompt,
      maxTokens: 3800,
    });

    rawSynthesisObj = await safeParseOrRepairJson(synthesisText, synthesisSchemaHint);
  } catch (err) {
    if (err.message?.includes('EXPLABS_API_KEY') || err.message?.includes('Authentication Error')) {
      throw err;
    }
    console.warn('[Stage 3 Warning] Synthesis AI request failed:', err.message);
  }

  // Always normalize output against required schema to ensure zero crashes on missing fields
  const finalAnalysis = normalizeAnalysisReport(rawSynthesisObj, projectTree);

  // Attach stage2 modules if synthesis returned empty modules list
  if ((!finalAnalysis.modules || finalAnalysis.modules.length === 0) && Array.isArray(stage2Result) && stage2Result.length > 0) {
    finalAnalysis.modules = stage2Result;
  }

  return finalAnalysis;
}
