/*
 * Copyright (c) 2025. Alberto Marchetti - https://www.linkedin.com/in/albertomarchetti/
 */

import 'zx/globals';

// Enable full output
$.verbose = true;

echo`Starting script...`;

// Ask for user input
const name = await question(chalk.redBright('What is your name? '));
echo`Hello, ${name}!`;

// Capture and use command output
const files = await $`ls -1`;
echo`Files in directory: ${files}`;

// Sleep for a delay
await sleep(1);

// Get system date
const date = await $`date +"%Y-%m-%d %H:%M:%S"`;
echo`Current time: ${date}`;

// Create a directory and file
await $`mkdir -p test_dir && echo 'hey!' > test_dir/sample.txt`;
// Or
await fs.mkdirp('test_dir');
await fs.writeFile('test_dir/sample.txt', 'Hello!');

// Read a file (using cat)
const fileContent = await $`cat test_dir/sample.txt`;
echo`File content: ${fileContent}`;
// Or
echo`File content: ${await fs.readFile('test_dir/sample.txt', 'utf-8')}`;

// Append text to a file
await $`echo "Hello from zx!" >> test_dir/sample.txt`;
// Or
await fs.appendFile('test_dir/sample.txt', 'Hello from zx!');

// Check if a command exists
if (await which('git')) {
  echo`Git is installed.`;
} else {
  echo`Git is not installed.`;
}

// Execute a command with arguments
const args = ['-l', '-h', 'test_dir'];
await $`ls ${args}`;

// Use chalk for colored output
echo(chalk.green('This is a green message!'));

// Parallel execution
await Promise.all([
  $`echo "Task 1" && sleep 1`,
  $`echo "Task 2" && sleep 1`,
  $`echo "Task 3" && sleep 1`
]);

// Chain multiple commands
await $`mkdir -p test_dir && cd test_dir && touch file1.txt file2.txt`;

{
  // Run a background process
  const process = $`sleep 5 && echo "Done sleeping"`.nothrow();
  echo`Background process started: ${process.fullCmd}`;

  // Kill process after 2 seconds
  setTimeout(() => process.kill('SIGINT'), 2000);
}

// Run a command with sudo (commented out for safety)
// await $`sudo apt update`;

// Download a file (example using curl)
await $`curl -o test_dir/example.html https://example.com`.nothrow();

// Delete a directory recursively (even if it contains files)
await fs.remove('test_dir');

// Capture errors
try {
  await $`ls non_existent_directory`;
} catch (error) {
  echo(chalk.red('Error:'), error);
}
