import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Runs a shell command asynchronously, streaming stdout/stderr
 * and resolving once the process exits.
 *
 * @param command - The exact shell command to execute.
 * @returns A promise that resolves when the command completes successfully,
 *          or rejects if the command exits with an error.
 *
 * @example
 * await runCommand('npm install --save-dev typescript');
 */
export async function runCommand(command: string): Promise<void> {
	try {
		const { stdout, stderr } = await execAsync(command);
		if (stdout) console.log(stdout);
		if (stderr) console.error(stderr);
	} catch (error) {
		console.error(`Error running command: ${command}`);
		throw error;
	}
}
