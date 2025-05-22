import { BaseModule, ModuleRegistry } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists, readFile } from '../../utils';

export class LintStagedModule extends BaseModule {
	protected autoInstallDeps = true;

	constructor(registry: ModuleRegistry) {
		super(registry);
		registry.register(LintStagedModule, this);
	}

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('.lintstagedrc.json'))) {
			this.logger.info(`creating .lintstagedrc.json file...`);
			await createOrReplaceFile(cwd('.lintstagedrc.json'), readFile('./.lintstagedrc.json'));
		} else {
			this.logger.info(`.lintstagedrc.json already exists`);
		}
	}
}
