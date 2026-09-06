import fs from 'fs/promises';
import path from 'path';

/**
 * Safely removes a directory recursively.
 * Implements retries for Windows file lock stability.
 */
export async function safeCleanupDir(dirPath, maxRetries = 3, delayMs = 200) {
  if (!dirPath) return;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fs.rm(dirPath, { recursive: true, force: true });
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        console.warn(`[Cleanup Warning] Could not remove directory ${dirPath}: ${err.message}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
}
