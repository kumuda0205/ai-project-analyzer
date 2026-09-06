import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const apiKey = process.env.EXPLABS_API_KEY;
const model = process.env.EXPLABS_MODEL || 'claude-fable-5.1';
const rawBaseUrl = process.env.EXPLABS_BASE_URL || 'https://api.experientiallabs.ai/v1';
const baseURL = rawBaseUrl.replace(/\/v1\/?$/, '');

console.log('=======================================================');
console.log('🧪 Experiential Labs API Gateway Integration Test');
console.log('   Provider: Experiential Labs');
console.log(`   Base URL: ${rawBaseUrl}`);
console.log(`   Model:    ${model}`);
console.log(`   Key Set:  ${Boolean(apiKey && apiKey !== 'your_experiential_labs_api_key_here')}`);
console.log('=======================================================');

if (!apiKey || apiKey === 'your_experiential_labs_api_key_here') {
  console.error('❌ Error: EXPLABS_API_KEY is not configured in server/.env');
  process.exit(1);
}

async function runTest() {
  try {
    const client = new Anthropic({
      apiKey: apiKey,
      baseURL: baseURL,
    });

    console.log('\nSending test prompt to Claude Fable 5.1...');

    const response = await client.messages.create({
      model: model,
      max_tokens: 150,
      system: 'You are a helpful software architecture test assistant. Respond in raw JSON format.',
      messages: [
        {
          role: 'user',
          content: 'Perform a quick connection test. Respond ONLY with JSON: {"status": "success", "message": "Claude Fable 5.1 connected via Experiential Labs"}',
        },
      ],
    });

    console.log('\n✅ Integration Test Successful!');
    console.log('   HTTP Response Received from Gateway.');
    console.log('   Response ID:', response.id);
    console.log('   Response Model:', response.model);
    console.log('   Response Content:', response.content[0]?.text);
  } catch (err) {
    console.error('\n❌ Integration Test Error:');
    console.error('   Status:', err.status || err.statusCode || 'N/A');
    console.error('   Message:', err.message);

    if (err.status === 429 || err.message?.includes('card on file') || err.message?.includes('quota')) {
      console.log('\nℹ️ Gateway Note: Experiential Labs returned 429 quota warning.');
      console.log('  To unlock unlimited queries, add a card or top up at https://platform.experientiallabs.ai/');
    }
  }
}

runTest();
