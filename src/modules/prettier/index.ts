import { BaseModule, ModuleRegistry } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists, readFile } from '../../utils';

export class PrettierModule extends BaseModule {
	protected autoInstallDeps = true;

	constructor(registry: ModuleRegistry) {
		super(registry);
		registry.register(PrettierModule, this);
	}

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('.prettierignore'))) {
			this.logger.info(`creating .prettierignore file...`);
			await createOrReplaceFile(cwd('.prettierignore'), readFile(__dirname, './.prettierignore'));
		} else {
			this.logger.info(`.prettierignore already exists`);
		}

		if (!isFileExists(cwd('.prettierrc'))) {
			this.logger.info(`creating .prettierrc file...`);
			await createOrReplaceFile(cwd('.prettierrc'), readFile(__dirname, './.prettierrc'));
		} else {
			this.logger.info(`.prettierrc already exists`);
		}
	}
}
