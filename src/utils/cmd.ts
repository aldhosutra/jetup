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
		enterAlternateScreen({ header: `executing:\n${command}` });
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

export function enterAlternateScreen(params: { title?: string; header?: string }) {
	process.stdout.write('\x1b[?1049h');
	if (params.title) setTerminalTitle(params.title);
	if (params.header) drawBoxedTitle(params.header);
}

export function exitAlternateScreen() {
	process.stdout.write('\x1b[?1049l');
}

export function setTerminalTitle(title: string) {
	process.stdout.write(`\x1b]0;${title}\x07`);
}

function drawBoxedTitle(title: string, padding: { horizontal?: number; vertical?: number } = {}) {
	const hPadding = padding.horizontal ?? 5;
	const vPadding = padding.vertical ?? 1;

	const rawLines = title.split('\n');
	const contentWidth = Math.max(...rawLines.map(line => line.length)) + hPadding * 2;
	const border = '─'.repeat(contentWidth);
	const emptyLine = ' '.repeat(contentWidth);

	const paddedLines = rawLines.map(line => {
		const padded = ' '.repeat(hPadding) + line + ' '.repeat(hPadding);
		return padded.padEnd(contentWidth);
	});

	const allLines = [
		...Array(vPadding).fill(emptyLine),
		...paddedLines,
		...Array(vPadding).fill(emptyLine),
	];

	const boxed = [`╭${border}╮`, ...allLines.map(line => `│${line}│`), `╰${border}╯`];

	console.log(boxed.join('\n'));
	console.log();
}
