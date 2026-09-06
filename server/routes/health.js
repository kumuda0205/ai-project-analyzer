import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  const isApiKeyConfigured = Boolean(
    process.env.EXPLABS_API_KEY &&
      process.env.EXPLABS_API_KEY !== 'your_experiential_labs_api_key_here' &&
      process.env.EXPLABS_API_KEY.trim() !== ''
  );

  res.json({
    status: 'ok',
    service: 'AI Project Analyzer API',
    provider: 'Experiential Labs Gateway',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: isApiKeyConfigured,
    model: process.env.EXPLABS_MODEL || 'openrouter-free',
  });
});

export default router;
