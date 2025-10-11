import figlet from 'figlet';
import chalk from 'chalk';
import gradient from 'gradient-string';
import readline from 'readline';
import ora from 'ora';
import { simulateBootSequence, randomDelay } from './utils/animations.js';
import { getAIResponse } from './utils/responses.js';

async function displayLogo() {
  console.clear();
  const logo = figlet.textSync('SAMKIEL BIRTHDAY BOT v1.0', {
    font: 'Small',
    horizontalLayout: 'default'
  });
  console.log(gradient.rainbow(logo));
  console.log(chalk.gray('='.repeat(50)));
}

async function displayStartupMessages() {
  console.log(chalk.yellow('🎉 Initializing SAMKIEL BIRTHDAY BOT protocol...'));
  await randomDelay(1000, 2000);
  console.log(chalk.blue('🤖 Happy Birthday, Developer Samkiel (Samuel Ezekiel)!'));
  await randomDelay(1000, 2000);
  console.log(chalk.green('System uptime: 19 years — stable, evolving, and digitalizing the world.'));
  await randomDelay(1000, 2000);
  console.log(chalk.magenta('Mission: Continue innovating, creating, and leading the future of technology.'));
  console.log(chalk.gray('='.repeat(50)));
  console.log(chalk.cyan('Chat system activated. Type your message or "exit" to quit.'));
  console.log();
}

async function startChat() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question(chalk.bold.blue('You: '), async (input) => {
      if (input.toLowerCase() === 'exit') {
        console.log(gradient.rainbow('Shutting down SAMKIEL BIRTHDAY BOT... Farewell, Developer!'));
        rl.close();
        return;
      }

      const spinner = ora(chalk.cyan('Processing request...')).start();
      try {
        const response = await getAIResponse(input);
        spinner.succeed(chalk.green('Response generated'));
        console.log(chalk.bold.green('Bot: ') + response);
      } catch (error) {
        spinner.fail(chalk.red('Error processing request'));
        console.log(chalk.bold.red('Bot: ') + gradient.rainbow('[SYSTEM ERROR] Neural circuits misaligned.'));
      }
      console.log();
      askQuestion();
    });
  };

  askQuestion();
}

async function main() {
  await displayLogo();
  await simulateBootSequence();
  await displayStartupMessages();
  await startChat();
}

main().catch(console.error);
