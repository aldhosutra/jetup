import { existsSync, readFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';

/**
 * Reads a JSON file, merges in the given updates, and writes it back.
 *
 * @typeParam T - The shape of the object stored in the JSON file.
 * @param filePath - Path to the JSON file to update.
 * @param updates - Partial object containing properties to merge into the JSON.
 * @throws If the file cannot be read, parsed, or written.
 *
 * @example
 * // Adds or updates the "scripts.build" entry in package.json
 * await updateJson<PackageJson>('package.json', {
 *   scripts: { build: 'tsc' }
 * });
 */
export async function updateJson<T extends object>(
	filePath: string,
	updates: Partial<T>,
): Promise<void> {
	try {
		const content = await readFile(filePath, 'utf-8');
		const json = JSON.parse(content) as T;
		const updated = { ...json, ...updates };
		await writeFile(filePath, JSON.stringify(updated, null, 2) + '\n');
	} catch (error) {
		console.error(`Failed to update JSON at ${filePath}:`, error);
		throw error;
	}
}

/**
 * Checks synchronously whether a nested property exists in a JSON file.
 *
 * @param filePath - Path to the JSON file to inspect.
 * @param propertyPath - Dot-notation path of the property to check, e.g. "devDependencies.prettier".
 * @returns `true` if the property exists (even if its value is `null` or `false`), `false` otherwise.
 *
 * @example
 * if (hasJsonProperty('package.json', 'devDependencies.prettier')) {
 *   console.log('Prettier is already listed in devDependencies.');
 * } else {
 *   console.log('Prettier is not found — safe to add it.');
 * }
 */
export function hasJsonProperty(filePath: string, propertyPath: string): boolean {
	if (!existsSync(filePath)) return false;

	const raw = readFileSync(filePath, { encoding: 'utf-8' });
	let obj: Record<string, unknown>;
	try {
		obj = JSON.parse(raw);
	} catch {
		return false;
	}

	const keys = propertyPath.split('.');
	let current: Record<string, unknown> = obj;

	for (const key of keys) {
		if (
			current === null ||
			current === undefined ||
			typeof current !== 'object' ||
			!(key in current)
		) {
			return false;
		}
		current = current[key] as Record<string, unknown>;
	}

	return true;
}
