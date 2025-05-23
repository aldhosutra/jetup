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

/**
 * Extracts the package name from a full npm package string that may include a version.
 *
 * Correctly handles:
 * - Unscoped packages with or without versions (e.g. "eslint", "eslint@8.0.0")
 * - Scoped packages with or without versions (e.g. "@types/node", "@types/node@20.1.0")
 *
 * @param pkg - The full npm package string, possibly including a version.
 * @returns The package name without the version.
 *
 * @example
 * getPackageName("eslint@8.0.0");       // "eslint"
 * getPackageName("@types/node@20.1.0"); // "@types/node"
 * getPackageName("eslint");             // "eslint"
 * getPackageName("@types/node");        // "@types/node"
 */
export function getPackageName(pkg: string): string {
	if (pkg.startsWith('@')) {
		// Scoped: e.g., "@types/node" or "@types/node@20.1.0"
		const match = pkg.match(/^(@[^/]+\/[^@]+)(?:@.+)?$/);
		return match ? match[1] : pkg;
	} else {
		// Unscoped: e.g., "eslint@8.0.0" or "eslint"
		return pkg.split('@')[0];
	}
}
