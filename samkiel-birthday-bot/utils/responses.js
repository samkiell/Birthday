import OpenAI from 'openai';
import dotenv from 'dotenv';
import gradient from 'gradient-string';
import { systemConfig } from '../config/system.js';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAIResponse(userInput) {
  try {
    const systemMessage = `You are ${systemConfig.name}, created by ${systemConfig.creator}. ${systemConfig.purpose} Your tone is ${systemConfig.tone}. Style: ${systemConfig.style}. Rules: ${systemConfig.rules.join(' ')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userInput },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content.trim();
    return gradient.rainbow(response);
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    return gradient.rainbow('[SYSTEM ERROR] Unable to process request. Neural circuits misaligned.');
  }
}
