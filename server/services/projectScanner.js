import fs from 'fs/promises';
import path from 'path';
import {
  IGNORED_DIRECTORIES,
  SECRET_FILE_PATTERNS,
  BINARY_EXTENSIONS,
  HIGH_PRIORITY_CONFIG_FILES,
  LIMITS,
} from '../config/constants.js';
import { redactSecrets } from '../utils/secretRedactor.js';

function isSecretFile(filename) {
  return SECRET_FILE_PATTERNS.some((pattern) => pattern.test(filename));
}

function isBinaryFile(filename) {
  const ext = path.extname(filename).slice(1).toLowerCase();
  return BINARY_EXTENSIONS.has(ext);
}

function getFileScore(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  const basename = path.basename(normalized);
  const lowerName = basename.toLowerCase();

  // High Priority Configs & Documentation
  if (HIGH_PRIORITY_CONFIG_FILES.map((f) => f.toLowerCase()).includes(lowerName)) {
    return 100;
  }

  // Application Entry Points
  if (
    /^(index|main|server|app|index\.d)\.(js|ts|jsx|tsx|py|java|go|rs|php|rb|cs)$/i.test(
      basename
    )
  ) {
    return 90;
  }

  // Core Architectural Layers
  if (
    normalized.includes('/routes/') ||
    normalized.includes('/controllers/') ||
    normalized.includes('/services/') ||
    normalized.includes('/models/') ||
    normalized.includes('/components/') ||
    normalized.includes('/pages/') ||
    normalized.includes('/api/') ||
    normalized.includes('/views/') ||
    normalized.includes('/middleware/') ||
    normalized.includes('/db/') ||
    normalized.includes('/config/')
  ) {
    return 75;
  }

  // General source code files
  if (/\.(js|jsx|ts|tsx|py|java|c|cpp|h|hpp|cs|go|rs|php|rb|swift|kt|sql|html|css)$/i.test(basename)) {
    return 50;
  }

  return 10;
}

export async function scanProject(rootPath) {
  const filesList = [];
  const treeNodes = [];

  // Helper function to build tree and collect files
  async function traverse(currentPath, relPath = '') {
    const entries = await fs.readdir(currentPath, { withFileTypes: true });

    // Sort: directories first, then files alphabetically
    entries.sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });

    const children = [];

    for (const entry of entries) {
      const entryRelPath = relPath ? `${relPath}/${entry.name}` : entry.name;
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (IGNORED_DIRECTORIES.has(entry.name)) {
          continue;
        }

        const subChildren = await traverse(fullPath, entryRelPath);
        children.push({
          name: entry.name,
          path: entryRelPath,
          type: 'directory',
          children: subChildren,
        });
      } else if (entry.isFile()) {
        const basename = entry.name;

        // Skip secrets & binaries
        if (isSecretFile(basename) || isBinaryFile(basename)) {
          continue;
        }

        const stat = await fs.stat(fullPath);

        // Skip files that exceed single file size limit
        if (stat.size > LIMITS.MAX_SINGLE_FILE_SIZE_BYTES) {
          continue;
        }

        const score = getFileScore(entryRelPath);
        const fileObj = {
          name: basename,
          path: entryRelPath,
          fullPath,
          size: stat.size,
          score,
          type: 'file',
        };

        filesList.push(fileObj);
        children.push({
          name: basename,
          path: entryRelPath,
          type: 'file',
          size: stat.size,
        });
      }
    }

    return children;
  }

  const rootChildren = await traverse(rootPath);
  const rootFolderName = path.basename(rootPath);
  
  const projectTree = [
    {
      name: rootFolderName || 'project',
      path: '',
      type: 'directory',
      children: rootChildren,
    },
  ];

  // Read and redact priority source files within AI token budget
  filesList.sort((a, b) => b.score - a.score || a.size - b.size);

  let accumulatedBytes = 0;
  const selectedFiles = [];

  for (const file of filesList) {
    if (selectedFiles.length >= LIMITS.MAX_MODULE_FILES_FOR_STAGE2) {
      break;
    }

    if (accumulatedBytes + file.size > LIMITS.MAX_AI_PAYLOAD_BYTES) {
      // If we already have some files, don't exceed limit
      if (selectedFiles.length > 0) break;
    }

    try {
      const rawContent = await fs.readFile(file.fullPath, 'utf-8');
      const redactedContent = redactSecrets(rawContent);

      selectedFiles.push({
        name: file.name,
        path: file.path,
        score: file.score,
        size: file.size,
        content: redactedContent,
      });

      accumulatedBytes += file.size;
    } catch (err) {
      console.warn(`[Scanner Warning] Failed to read ${file.path}: ${err.message}`);
    }
  }

  return {
    totalScannedFiles: filesList.length,
    selectedFiles,
    projectTree,
    allFilePathList: filesList.map((f) => f.path),
  };
}
