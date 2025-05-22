/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs').promises;
const { existsSync } = require('fs');
const { join, dirname, extname, resolve } = require('path');

/**
 * Recursively copies everything from `srcDir` into `outDir`,
 * excluding files with extensions `.ts` or `.tsx`. Directories
 * are always created and traversed.
 *
 * @param {string} srcDir - Path to the source directory.
 * @param {string} outDir - Path to the destination directory.
 */
async function copyNonTsFiles(srcDir, outDir) {
	// ensure outDir exists
	await fs.mkdir(outDir, { recursive: true });

	const entries = await fs.readdir(srcDir, { withFileTypes: true });
	for (const dirent of entries) {
		const srcPath = join(srcDir, dirent.name);
		const destPath = join(outDir, dirent.name);

		if (dirent.isDirectory()) {
			// recurse into subdirectories
			await copyNonTsFiles(srcPath, destPath);
		} else {
			// skip .ts and .tsx files
			const ext = extname(dirent.name).toLowerCase();
			if (ext !== '.ts' && ext !== '.tsx') {
				// ensure the destination directory exists
				await fs.mkdir(dirname(destPath), { recursive: true });
				await fs.copyFile(srcPath, destPath);
			}
		}
	}
}

/**
 * Entry point: copies non-TS assets from ./src to ./dist
 */
(async () => {
	try {
		const projectRoot = process.cwd();
		const srcDir = resolve(projectRoot, 'src');
		const outDir = resolve(projectRoot, 'dist');

		// only run if src exists
		if (!existsSync(srcDir)) {
			console.error(`Source directory not found: ${srcDir}`);
			process.exit(1);
		}

		await copyNonTsFiles(srcDir, outDir);
	} catch (err) {
		console.error('❌ Error copying non-TS files:', err);
		process.exit(1);
	}
})();
