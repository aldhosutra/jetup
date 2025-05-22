import { BaseModule, ModuleRegistry } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists, readFile } from '../../utils';

export class JestModule extends BaseModule {
	protected autoInstallDeps = true;

	constructor(registry: ModuleRegistry) {
		super(registry);
		registry.register(JestModule, this);
	}

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('test/_setup.js'))) {
			this.logger.info(`creating test/_setup.js file...`);
			await createOrReplaceFile(cwd('test/_setup.js'), readFile('./_setup.js'));
		} else {
			this.logger.info(`test/_setup.js already exists`);
		}

		if (!isFileExists(cwd('jest.config.js'))) {
			this.logger.info(`creating jest.config.js file...`);
			await createOrReplaceFile(cwd('jest.config.js'), readFile('./jest.config.js'));
		} else {
			this.logger.info(`jest.config.js already exists`);
		}

		if (!isFileExists(cwd('test/unit/index.spec.ts'))) {
			this.logger.info(`creating test/unit/index.spec.ts file...`);
			await createOrReplaceFile(cwd('test/unit/index.spec.ts'), '');
		} else {
			this.logger.info(`test/unit/index.spec.ts already exists`);
		}
	}
}
