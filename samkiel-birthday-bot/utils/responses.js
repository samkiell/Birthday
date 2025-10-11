import axios from 'axios';
import dotenv from 'dotenv';
import { systemConfig } from '../config/system.js';

dotenv.config();

export async function getAIResponse(query) {
  const openaiUrl = process.env.OPENAI_URL;
  const geminiApisStr = process.env.GEMINI_APIS;

  if (!openaiUrl || !geminiApisStr) {
    console.error('✖ Missing .env variables: OPENAI_URL or GEMINI_APIS');
    return { response: '[SYSTEM ERROR] Neural circuits misaligned.', engine: 'Error', timeTaken: 0, urlUsed: '' };
  }

  const geminiApis = geminiApisStr.split(',');
  const startTime = Date.now();

  try {
    // --- PRIMARY: OpenAI ---
    const openaiRes = await axios.get(`${openaiUrl}?text=${encodeURIComponent(query)}`, { timeout: 15000 });
    if (openaiRes.data?.success && openaiRes.data.result?.prompt) {
      const timeTaken = Date.now() - startTime;
      console.log('✅ Response received successfully');
      return { response: openaiRes.data.result.prompt, engine: 'OpenAI', timeTaken, urlUsed: openaiUrl };
    }
    throw new Error('Invalid OpenAI response format');
  } catch (error) {
    // Silent fallback
  }

  // --- FALLBACK: Gemini APIs ---
  for (let i = 0; i < geminiApis.length; i++) {
    const api = geminiApis[i];
    try {
      const res = await axios.get(`${api}${encodeURIComponent(query)}`, { timeout: 15000 });
      if (res.data?.success && (res.data.result || res.data.response)) {
        const timeTaken = Date.now() - startTime;
        console.log('✅ Response received successfully');
        return { response: res.data.result || res.data.response, engine: `Gemini #${i + 1}`, timeTaken, urlUsed: api };
      }
    } catch (err) {
      // Silent
    }
  }

  const timeTaken = Date.now() - startTime;
  return { response: 'Unable to process your request right now.', engine: 'Error', timeTaken, urlUsed: '' };
}

// --- MAIN HANDLER ---
export async function handleChatInput(query) {
  const systemMessage = `You are ${systemConfig.name}, created by ${systemConfig.creator}. ${systemConfig.purpose} Your tone is ${systemConfig.tone}. Style: ${systemConfig.style}. Rules: ${systemConfig.rules.join(' ')}`;
  const fullQuery = `${systemMessage}\n\nUser: ${query}`;

  try {
    const response = await getAIResponse(fullQuery);
    return response;
  } catch (error) {
    console.error('✖ Error processing request:', error.message);
    return { response: 'Unable to process your request right now.', engine: 'Error', timeTaken: 0, urlUsed: '' };
  }
}
