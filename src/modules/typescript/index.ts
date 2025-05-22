import { BaseModule, ModuleRegistry } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists, readFile } from '../../utils';

export class TypescriptModule extends BaseModule {
	constructor(registry: ModuleRegistry) {
		super(registry);
		registry.register(TypescriptModule, this);
	}

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('tsconfig.json'))) {
			this.logger.info(`creating tsconfig.json file...`);
			await createOrReplaceFile(cwd('tsconfig.json'), readFile('./tsconfig.json'));
		} else {
			this.logger.info(`tsconfig.json already exists`);
		}
	}
}
