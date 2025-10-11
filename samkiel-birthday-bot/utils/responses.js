import axios from 'axios';
import dotenv from 'dotenv';
import { systemConfig } from '../config/system.js';

dotenv.config();

export async function getAIResponse(query) {
  const openaiUrl = process.env.OPENAI_URL;
  const geminiApisStr = process.env.GEMINI_APIS;

  if (!openaiUrl || !geminiApisStr) {
    return '⚠️ System error — please retry.';
  }

  const geminiApis = geminiApisStr.split(',');

  try {
    // --- PRIMARY: OpenAI ---
    const openaiRes = await axios.get(`${openaiUrl}?text=${encodeURIComponent(query)}`, { timeout: 15000 });
    if (openaiRes.data?.success && openaiRes.data.result?.prompt) {
      return openaiRes.data.result.prompt;
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
        return res.data.result || res.data.response;
      }
    } catch (err) {
      // Silent
    }
  }

  return '⚠️ System error — please retry.';
}

// --- MAIN HANDLER ---
export async function handleChatInput(query) {
  const systemMessage = `You are ${systemConfig.name}, created by ${systemConfig.creator}. ${systemConfig.purpose} Your tone is ${systemConfig.tone}. Style: ${systemConfig.style}. Rules: ${systemConfig.rules.join(' ')}`;
  const fullQuery = `${systemMessage}\n\nUser: ${query}`;

  try {
    const response = await getAIResponse(fullQuery);
    return response;
  } catch (error) {
    return '⚠️ System error — please retry.';
  }
}
