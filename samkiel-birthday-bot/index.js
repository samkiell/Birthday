import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';
import readline from 'readline';
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
  console.log();
}

async function startChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question(chalk.bold.yellow('You: '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log(gradient.rainbow('Shutting down SAMKIEL BIRTHDAY BOT... Farewell, Developer!'));
        rl.close();
        return;
      }

      const spinner = ora(chalk.cyan('Processing request...')).start();
      try {
        const result = await handleChatInput(input);
        spinner.succeed(chalk.green('Response received'));
        console.log(chalk.cyan('Bot (SAMKIEL v1.1): ') + gradient.pastel(result.response));
      } catch (error) {
        spinner.fail(chalk.red('Error processing request'));
        console.log(chalk.cyan('Bot (SAMKIEL v1.1): ') + gradient.pastel('Unable to process your request right now.'));
      }
      console.log();
      askQuestion();
    });
  };

  askQuestion();
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
