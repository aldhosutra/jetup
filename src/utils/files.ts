import { mkdir, writeFile, rm } from 'fs/promises';
import { existsSync, readFileSync, statSync, chmodSync, Mode } from 'fs';
import { sync as globSync } from 'glob';
import { join, dirname, resolve } from 'path';

/**
 * Deletes an existing directory (if any), recreates it,
 * and writes a set of files into it.
 *
 * @param dirPath - Path of the directory to (re)create.
 * @param files - An object mapping filenames (relative to dirPath) to file contents.
 * @throws If directory or file operations fail.
 *
 * @example
 * // Creates (or recreates) "test" folder with two files inside
 * await createFolderAndFiles('test', {
 *   'unit.spec.ts': '// some test',
 *   'integration.spec.ts': '// another test'
 * });
 */
export async function createFolderAndFiles(
	dirPath: string,
	files: Record<string, string>,
): Promise<void> {
	if (existsSync(dirPath)) {
		await rm(dirPath, { recursive: true, force: true });
	}
	await mkdir(dirPath, { recursive: true });

	for (const [fileName, content] of Object.entries(files)) {
		const fullPath = join(dirPath, fileName);
		await writeFile(fullPath, content);
	}
}

/**
 * Ensures the target directory exists, then creates or replaces
 * only the specified files—leaving any other files untouched.
 *
 * @param dirPath - Path of the directory to merge into.
 * @param files - An object mapping filenames (relative to dirPath) to file contents.
 * @throws If directory creation or file writing fails.
 *
 * @example
 * // Adds or updates two files inside "src/utils", without touching other files
 * await mergeFolderAndFiles('src/utils', {
 *   'helpers.ts': '// helper functions...',
 *   'types.d.ts': '// type definitions...'
 * });
 */
export async function mergeFolderAndFiles(
	dirPath: string,
	files: Record<string, string>,
): Promise<void> {
	// Ensure the base directory exists
	await mkdir(dirPath, { recursive: true });

	// For each file, ensure its sub-directory exists and then write
	for (const [relativeName, content] of Object.entries(files)) {
		const fullPath = join(dirPath, relativeName);
		const parentDir = dirname(fullPath);

		// Make sure any nested directories exist
		await mkdir(parentDir, { recursive: true });
		// Write or replace only this file
		await writeFile(fullPath, content);
	}
}

/**
 * Ensures the target directory exists, then creates or replaces
 * the specified file with the given content.
 *
 * @param filePath - Path (including filename) where the file should be written.
 * @param content - The full text content to write into the file.
 * @throws If directory creation or file writing fails.
 *
 * @example
 * // Writes or overwrites "jest.config.js" in project root
 * await createOrReplaceFile('jest.config.js', 'module.exports = { ... }');
 */
export async function createOrReplaceFile(filePath: string, content: string): Promise<void> {
	const dir = dirname(filePath);
	if (!existsSync(dir)) {
		await mkdir(dir, { recursive: true });
	}
	await writeFile(filePath, content);
}

/**
 * Synchronously checks whether a file or directory exists at the given path.
 * Supports plain paths *and* glob patterns (using * and **).
 *
 * @param pattern - The path or glob pattern to check.
 * @returns `true` if at least one match exists, `false` otherwise.
 *
 * @example
 * // Plain path
 * isFileExists('package.json'); // true or false
 *
 * // Glob patterns
 * isFileExists('src/** /*.ts');  // true if any .ts under src/
 * isFileExists('*.config.js');  // true if any *.config.js in cwd
 */
export function isFileExists(pattern: string): boolean {
	// Remove all whitespace from the pattern
	const cleanPattern = pattern.replace(/\s+/g, '');

	if (cleanPattern.includes('*')) {
		// Use glob to find matches (ignore directories)
		const matches = globSync(cleanPattern, { nodir: true });
		return matches.length > 0;
	} else {
		// Simple existence check
		return existsSync(cleanPattern);
	}
}

/**
 * Synchronously checks whether a directory exists at the given path.
 * Supports plain paths *and* glob patterns (using `*` and `**`). Any
 * whitespace in the pattern will be removed before matching.
 *
 * @param pattern - The directory path or glob pattern to check
 *                  (whitespace-insensitive).
 * @returns `true` if at least one matching directory exists, `false` otherwise.
 *
 * @example
 * // Plain path
 * isFolderExists('dist');           // true if ./dist is a directory
 *
 * // Glob patterns
 * isFolderExists('src/** /utils');   // true if any "utils" folder under src/
 * isFolderExists('build/ *');       // also works (spaces removed)
 */
export function isFolderExists(pattern: string): boolean {
	// Strip all whitespace
	const cleanPattern = pattern.replace(/\s+/g, '');

	if (cleanPattern.includes('*')) {
		// Find all matches (files and folders)
		const matches = globSync(cleanPattern, { nodir: false });
		// Return true if any match is a directory
		return matches.some(p => {
			try {
				return statSync(p).isDirectory();
			} catch {
				return false;
			}
		});
	} else {
		// Simple synchronous check
		try {
			return existsSync(cleanPattern) && statSync(cleanPattern).isDirectory();
		} catch {
			return false;
		}
	}
}

/**
 * Reads and returns the content of a file synchronously.
 *
 * @param filePath - Path to the file to read.
 * @param encoding - Character encoding to use (default: 'utf-8').
 * @returns The file content as a string.
 *
 * @example
 * const template = readFile('templates/README.tpl.md');
 * await createOrReplaceFile('README.md', template);
 */
export function readFile(filePath: string, encoding: BufferEncoding = 'utf-8'): string {
	return readFileSync(filePath, { encoding });
}

/**
 * Change permission of a file synchronously.
 *
 * @param filePath - Path to the file to read.
 * @param permission - File Permission.
 * @returns void.
 *
 * @example
 * await changeFilePermission('.husky/pre-commit', 0o755);
 */
export function changeFilePermission(filePath: string, permission: Mode): void {
	return chmodSync(filePath, permission);
}

/**
 * Resolves a sequence of path segments relative to the user's current working directory.
 *
 * When your CLI runs via `npx ts-setup`, __dirname points into the package's folder.
 * Use this helper to build paths against the project root where the user invoked the command.
 *
 * @param segments - One or more path segments under the user's working directory.
 * @returns The absolute path to the target file or folder.
 *
 * @example
 * const pkgPath = cwd('package.json');
 * const configDir = cwd('src', 'config');
 */
export function cwd(...segments: string[]): string {
	return resolve(process.cwd(), ...segments);
}
