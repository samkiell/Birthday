import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';
import readlineSync from 'readline-sync';
import ora from 'ora';
import dotenv from 'dotenv';
import { simulateBootSequence, randomDelay } from './utils/animations.js';
import { handleChatInput } from './utils/responses.js';

dotenv.config();

async function displayLogo() {
  console.clear();
  const logo = figlet.textSync('SAMKIEL BIRTHDAY BOT v1.1', {
    font: 'Small',
    horizontalLayout: 'default'
  });
  console.log(gradient.rainbow(logo));
  console.log(chalk.dim.gray('='.repeat(50)));
}

async function displayStartupMessages() {
  console.log(chalk.yellow('🎉 Initializing SAMKIEL BIRTHDAY BOT protocol...'));
  await randomDelay(1000, 2000);
  console.log(chalk.blue('🤖 Happy Birthday, Developer Samkiel (Samuel Ezekiel)!'));
  await randomDelay(1000, 2000);
  console.log(chalk.green('You’ve leveled up to v19.0 — new features unlocked!'));
  await randomDelay(1000, 2000);
  console.log(chalk.magenta('Mission: Continue innovating, creating, and leading the future of technology.'));
  console.log(chalk.dim.gray('='.repeat(50)));
  console.log(chalk.cyan('Chat system activated. Type your message or "exit" to quit.'));
  console.log(chalk.cyan.bold("Bot [SAMKIEL V1.1]: ") + chalk.whiteBright("Created by Developer Samkiel — a full-stack engineer and cyber security enthusiast from Osun, Nigeria, building futuristic systems under SAMKIEL."));
  console.log();
}

async function startChat() {
  while (true) {
    const query = readlineSync.question("You: ");
    if (query.toLowerCase() === "exit") {
      console.log(chalk.cyan.bold("Bot [SAMKIEL V1.1]: ") + chalk.whiteBright("Session terminated. Goodbye, Developer Samkiel."));
      break;
    }

    const spinner = ora("Processing request...").start();

    try {
      const response = await handleChatInput(query);
      spinner.succeed("✅ Response received");
      console.log(chalk.cyan.bold("Bot [SAMKIEL V1.1]: ") + chalk.whiteBright(response));
    } catch (err) {
      spinner.fail("⚠️ System error — please retry.");
      console.log(chalk.cyan.bold("Bot [SAMKIEL V1.1]: ") + chalk.red.bold("⚠️ System error — please retry."));
    }
  }
}

async function main() {
  if (process.env.OPENAI_URL && process.env.GEMINI_APIS) {
    console.log('✅ .env variables loaded successfully');
  } else {
    console.error('✖ .env variables not loaded');
  }
  await displayLogo();
  await simulateBootSequence();
  await displayStartupMessages();
  await startChat();
}

main().catch(console.error);
