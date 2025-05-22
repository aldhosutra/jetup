import { runCommand } from './cmd';

/**
 * Install package as dev dependencies (using npm).
 *
 * @param packages - Package(s) name to be installed.
 * @returns A promise that resolves when the command completes successfully,
 *          or rejects if the command exits with an error.
 *
 * @example
 * await packageInstallDev('typescript');
 */
export async function packageInstallDev(packages: string): Promise<void> {
	await runCommand(`npm install --save-dev ${packages}`);
}
