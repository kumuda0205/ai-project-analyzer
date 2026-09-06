import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import AdmZip from 'adm-zip';
import { LIMITS } from '../config/constants.js';

export async function createTempWorkspace() {
  const baseTmp = path.join(os.tmpdir(), 'ai-proj-analyzer');
  await fs.mkdir(baseTmp, { recursive: true });
  return await fs.mkdtemp(path.join(baseTmp, 'proj-'));
}

export async function extractAndValidateZip(zipFilePath, targetDir) {
  const zip = new AdmZip(zipFilePath);
  const zipEntries = zip.getEntries();

  if (!zipEntries || zipEntries.length === 0) {
    throw new Error('The uploaded ZIP archive is empty or invalid.');
  }

  if (zipEntries.length > LIMITS.MAX_FILE_COUNT) {
    throw new Error(`Project contains too many files (${zipEntries.length} entries). Maximum allowed is ${LIMITS.MAX_FILE_COUNT}.`);
  }

  let totalExtractedSize = 0;
  const canonicalTargetDir = path.resolve(targetDir);

  for (const entry of zipEntries) {
    // 1. Zip Slip / Path Traversal Defense
    const entryPath = entry.entryName;
    const resolvedPath = path.resolve(canonicalTargetDir, entryPath);

    if (!resolvedPath.startsWith(canonicalTargetDir + path.sep) && resolvedPath !== canonicalTargetDir) {
      throw new Error(`Security Violation: Zip entry "${entryPath}" attempts path traversal outside target directory.`);
    }

    // 2. Extracted Size Limit Check
    if (!entry.isDirectory) {
      totalExtractedSize += entry.header.size;
      if (totalExtractedSize > LIMITS.MAX_EXTRACTED_SIZE_BYTES) {
        throw new Error(
          `Extracted project size exceeds limit of ${Math.round(LIMITS.MAX_EXTRACTED_SIZE_BYTES / (1024 * 1024))}MB.`
        );
      }
    }
  }

  // Perform extraction safely entry-by-entry
  for (const entry of zipEntries) {
    const entryPath = entry.entryName;
    const targetPath = path.resolve(canonicalTargetDir, entryPath);

    if (entry.isDirectory) {
      await fs.mkdir(targetPath, { recursive: true });
    } else {
      await fs.mkdir(path.dirname(targetPath), { recursive: true });
      const buffer = entry.getData();
      await fs.writeFile(targetPath, buffer);
    }
  }

  return {
    totalEntries: zipEntries.length,
    totalSizeBytes: totalExtractedSize,
  };
}
