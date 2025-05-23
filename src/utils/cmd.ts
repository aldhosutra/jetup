import { spawn } from 'child_process';

/**
 * Runs a shell command asynchronously with support for interactive input/output.
 *
 * @param command - The full command to execute (e.g., "npm init").
 * @returns A promise that resolves when the command completes successfully,
 *          or rejects if the command exits with an error.
 */
export async function runCommand(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const [cmd, ...args] = command.split(' ');

		const child = spawn(cmd, args, {
			stdio: 'inherit', // Connects stdin, stdout, stderr to parent process
			shell: true, // Runs the command through the shell
		});

		child.on('error', err => {
			console.error(`Failed to start command: ${command}`);
			reject(err);
		});

		child.on('close', code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command "${command}" exited with code ${code}`));
			}
		});
	});
}

/**
 * Runs a shell command asynchronously with silent output.
 *
 * @param command - The full command to execute (e.g., "npm init").
 * @returns A promise that resolves when the command completes successfully,
 *          or rejects if the command exits with an error.
 */
export async function runCommandInSilent(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const [cmd, ...args] = command.split(' ');

		const child = spawn(cmd, args, {
			stdio: 'ignore',
		});

		child.on('error', err => {
			console.error(`Failed to start command: ${command}`);
			reject(err);
		});

		child.on('close', code => {
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command "${command}" exited with code ${code}`));
			}
		});
	});
}

/**
 * Runs a shell command asynchronously with alternate screen.
 *
 * @param command - The full command to execute (e.g., "npm init").
 * @returns A promise that resolves when the command completes successfully,
 *          or rejects if the command exits with an error.
 */
export async function runCommandInAlternateScreen(command: string): Promise<void> {
	return new Promise((resolve, reject) => {
		enterAlternateScreen();
		const [cmd, ...args] = command.split(' ');

		const child = spawn(cmd, args, {
			stdio: 'inherit', // Connects stdin, stdout, stderr to parent process
			shell: true, // Runs the command through the shell
		});

		child.on('error', err => {
			exitAlternateScreen();
			console.error(`Failed to start command: ${command}`);
			reject(err);
		});

		child.on('close', code => {
			exitAlternateScreen();
			if (code === 0) {
				resolve();
			} else {
				reject(new Error(`Command "${command}" exited with code ${code}`));
			}
		});
	});
}

export function enterAlternateScreen() {
	process.stdout.write('\x1b[?1049h');
}

export function exitAlternateScreen() {
	process.stdout.write('\x1b[?1049l');
}
