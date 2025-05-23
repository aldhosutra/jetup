import { BaseModule } from '../../framework';
import { cwd, readFile, updateJson } from '../../utils';

export class PackageModule extends BaseModule {
	protected autoInstallDeps = true;
	protected registry = PackageModule;

	public async setup(): Promise<void> {
		const newJson = JSON.parse(readFile(__dirname, './package.json'));
		this.logger.info(`adding [${Object.keys(newJson).join(',')}] properties to package.json`);
		await updateJson(cwd('package.json'), newJson);
	}
}
