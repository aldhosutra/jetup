import { BaseModule, ModuleRegistry } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists } from '../../utils';

export class SrcModule extends BaseModule {
	protected autoInstallDeps = true;

	constructor(registry: ModuleRegistry) {
		super(registry);
		registry.register(SrcModule, this);
	}

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('src/index.ts'))) {
			this.logger.info(`creating src/index.ts file...`);
			await createOrReplaceFile(cwd('src/index.ts'), '');
		} else {
			this.logger.info(`src/index.ts already exists`);
		}
	}
}
