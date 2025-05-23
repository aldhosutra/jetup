import { BaseModule } from '../../framework';
import { createOrReplaceFile, cwd, isFileExists, readFile } from '../../utils';

export class TypescriptModule extends BaseModule {
	protected registry = TypescriptModule;

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('tsconfig.json'))) {
			this.logger.info(`creating tsconfig.json file...`);
			await createOrReplaceFile(cwd('tsconfig.json'), readFile(__dirname, './tsconfig.json'));
		} else {
			this.logger.info(`tsconfig.json already exists`);
		}
	}
}
