import { BaseModule } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists, readFile } from '../../utils';

export class LintStagedModule extends BaseModule {
	protected autoInstallDeps = true;
	protected registry = LintStagedModule;

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('.lintstagedrc.json'))) {
			this.logger.info(`creating .lintstagedrc.json file...`);
			await createOrReplaceFile(
				cwd('.lintstagedrc.json'),
				readFile(__dirname, './.lintstagedrc.json'),
			);
		} else {
			this.logger.info(`.lintstagedrc.json already exists`);
		}
	}
}
