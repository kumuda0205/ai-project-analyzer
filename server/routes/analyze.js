import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { LIMITS } from '../config/constants.js';
import { createTempWorkspace, extractAndValidateZip } from '../services/zipService.js';
import { scanProject } from '../services/projectScanner.js';
import { analyzeProjectWithClaude } from '../services/claudeService.js';
import { safeCleanupDir } from '../utils/cleanup.js';

const router = express.Router();

// Multer in-memory upload storage with size limits
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: LIMITS.MAX_UPLOAD_SIZE_BYTES,
  },
  fileFilter: (req, file, cb) => {
    const isZipExtension = /\.zip$/i.test(file.originalname);
    const isZipMime =
      file.mimetype === 'application/zip' ||
      file.mimetype === 'application/x-zip-compressed' ||
      file.mimetype === 'application/octet-stream';

    if (isZipExtension || isZipMime) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload a valid .zip project archive.'));
    }
  },
});

router.post('/projects/analyze', upload.single('file'), async (req, res) => {
  let tempWorkspace = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded. Please select a valid ZIP archive of your software project.',
      });
    }

    // 1. Create temporary workspace directory
    tempWorkspace = await createTempWorkspace();
    const zipPath = path.join(tempWorkspace, 'upload.zip');
    const extractPath = path.join(tempWorkspace, 'extracted');

    // Save uploaded buffer to zip path
    await fs.writeFile(zipPath, req.file.buffer);

    // 2. Safe Extraction with Zip Slip & Size Limit Protections
    await extractAndValidateZip(zipPath, extractPath);

    // 3. Scan extracted project directory
    const scanResults = await scanProject(extractPath);

    if (scanResults.totalScannedFiles === 0) {
      return res.status(400).json({
        error: 'No readable source code files were found in the uploaded archive.',
      });
    }

    // 4. Perform Multi-Stage Claude AI Analysis
    const analysisReport = await analyzeProjectWithClaude({
      projectTree: scanResults.projectTree,
      selectedFiles: scanResults.selectedFiles,
      allFilePathList: scanResults.allFilePathList,
    });

    return res.json({
      success: true,
      data: analysisReport,
    });
  } catch (err) {
    console.error('[Analyze Endpoint Error]', err);
    return res.status(500).json({
      error: err.message || 'An unexpected error occurred during project analysis.',
    });
  } finally {
    // 5. Always clean up temporary workspace
    if (tempWorkspace) {
      safeCleanupDir(tempWorkspace).catch((err) => {
        console.warn('[Cleanup Error]', err);
      });
    }
  }
});

export default router;
