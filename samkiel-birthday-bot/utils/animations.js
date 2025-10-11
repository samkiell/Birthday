import ora from 'ora';
import chalk from 'chalk';

export function randomDelay(min = 500, max = 2000) {
  return new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));
}

export async function showLoading(message, duration = 2000) {
  const spinner = ora({
    text: chalk.cyan(message),
    spinner: 'dots'
  }).start();
  await new Promise(resolve => setTimeout(resolve, duration));
  spinner.succeed(chalk.green('✔ Complete'));
}

export async function simulateBootSequence() {
  const steps = [
    'Loading core modules...',
    'Verifying digital identity...',
    'Establishing birthday protocol...',
    'Initializing AI subsystems...'
  ];

  for (const step of steps) {
    await showLoading(step, 1500);
  }
}
