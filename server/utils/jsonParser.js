/**
 * Robust JSON Parser, Sanitizer, and Schema Normalizer
 */

export function robustJsonParse(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  let cleaned = rawText.trim();

  // 1. Remove markdown code fences if present
  cleaned = cleaned.replace(/^```(json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  // 2. Find first '{' and last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  } else if (firstBrace !== -1) {
    cleaned = cleaned.substring(firstBrace);
  }

  // Attempt 1: Direct JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch (err1) {
    // Attempt 2: Sanitize unescaped newlines and tabs inside quotes
    try {
      const sanitized = fixUnescapedStringLiterals(cleaned);
      return JSON.parse(sanitized);
    } catch (err2) {
      // Attempt 3: Fix trailing commas
      try {
        const noTrailingCommas = cleaned
          .replace(/,\s*([}\]])/g, '$1')
          .replace(/[\r\n]+/g, ' ');
        const sanitized = fixUnescapedStringLiterals(noTrailingCommas);
        return JSON.parse(sanitized);
      } catch (err3) {
        // Attempt 4: Auto-repair truncated JSON string endings
        try {
          const repairedTruncated = autoRepairTruncatedJson(cleaned);
          if (repairedTruncated) {
            return JSON.parse(repairedTruncated);
          }
        } catch (err4) {
          // Truncation repair failed
        }
      }
    }
  }

  return null;
}

/**
 * Escapes unescaped raw newlines and carriage returns within string literals in JSON text.
 */
function fixUnescapedStringLiterals(jsonStr) {
  let inString = false;
  let isEscaped = false;
  let result = '';

  for (let i = 0; i < jsonStr.length; i++) {
    const char = jsonStr[i];

    if (char === '"' && !isEscaped) {
      inString = !inString;
      result += char;
    } else if (inString) {
      if (char === '\n') {
        result += '\\n';
      } else if (char === '\r') {
        result += '\\r';
      } else if (char === '\t') {
        result += '\\t';
      } else {
        result += char;
      }
    } else {
      result += char;
    }

    if (char === '\\' && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }
  }

  return result;
}

/**
 * Attempts to repair truncated JSON strings by closing unclosed quotes, brackets, and braces.
 */
function autoRepairTruncatedJson(jsonStr) {
  let cleaned = jsonStr.trim();
  let inString = false;
  let isEscaped = false;
  const stack = [];

  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '"' && !isEscaped) {
      inString = !inString;
    } else if (!inString) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}' || char === ']') {
        stack.pop();
      }
    }

    if (char === '\\' && !isEscaped) {
      isEscaped = true;
    } else {
      isEscaped = false;
    }
  }

  // If inside an open string, close the string
  if (inString) {
    cleaned += '"';
  }

  // Remove any trailing dangling key/colon or comma
  cleaned = cleaned.replace(/,\s*$/, '').replace(/:\s*$/, ': ""');

  // Close remaining open brackets / braces in reverse order
  while (stack.length > 0) {
    const open = stack.pop();
    if (open === '{') cleaned += '}';
    if (open === '[') cleaned += ']';
  }

  return fixUnescapedStringLiterals(cleaned);
}

/**
 * Validates and normalizes the synthesized analysis object to guarantee all required
 * schema fields are populated with valid types and default fallbacks.
 */
export function normalizeAnalysisReport(data, projectTree = []) {
  const obj = data && typeof data === 'object' ? data : {};

  const overview = obj.overview && typeof obj.overview === 'object' ? obj.overview : {};
  const architecture = obj.architecture && typeof obj.architecture === 'object' ? obj.architecture : {};
  const documentation = obj.documentation && typeof obj.documentation === 'object' ? obj.documentation : {};

  return {
    overview: {
      projectName: overview.projectName || 'Uploaded Project',
      projectType: overview.projectType || 'Full-Stack Application',
      summary: overview.summary || 'Uploaded software project for automated code analysis.',
      mainPurpose: overview.mainPurpose || 'Software application implementation.',
      majorFeatures: Array.isArray(overview.majorFeatures) ? overview.majorFeatures : [],
      languages: Array.isArray(overview.languages) ? overview.languages : [],
      frameworks: Array.isArray(overview.frameworks) ? overview.frameworks : [],
      backend: overview.backend || 'None',
      frontend: overview.frontend || 'None',
      database: overview.database || 'None',
      buildTools: Array.isArray(overview.buildTools) ? overview.buildTools : [],
    },
    techStack: Array.isArray(obj.techStack) ? obj.techStack : [],
    architecture: {
      summary: architecture.summary || 'Monolithic / Modular multi-layer software architecture.',
      components: Array.isArray(architecture.components) ? architecture.components : [],
      dataFlow: architecture.dataFlow || 'Data flows between client layers, backend controllers, services, and storage.',
      apiFlow: architecture.apiFlow || 'HTTP REST endpoints facilitate client-server communication.',
      frontendBackendComm: architecture.frontendBackendComm || 'Asynchronous JSON REST API communications.',
      storageInteraction: architecture.storageInteraction || 'Database or in-memory persistence layer.',
      mermaidDiagram: architecture.mermaidDiagram || 'graph TD\n  User --> Client\n  Client --> Server\n  Server --> Database',
    },
    structure: Array.isArray(obj.structure) && obj.structure.length > 0 ? obj.structure : projectTree,
    modules: Array.isArray(obj.modules) ? obj.modules : [],
    issues: Array.isArray(obj.issues) ? obj.issues : [],
    recommendations: Array.isArray(obj.recommendations) ? obj.recommendations : [],
    documentation: {
      readmeMarkdown:
        typeof documentation.readmeMarkdown === 'string' && documentation.readmeMarkdown.trim() !== ''
          ? documentation.readmeMarkdown
          : `# ${overview.projectName || 'Project Documentation'}\n\n${overview.summary || 'Project documentation derived from source files.'}`,
    },
    vivaQuestions: Array.isArray(obj.vivaQuestions) ? obj.vivaQuestions : [],
  };
}
