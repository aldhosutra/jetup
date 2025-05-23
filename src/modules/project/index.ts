import { BaseModule } from '../../framework';
import { cwd, isFileExists, runCommand } from '../../utils';

export class ProjectModule extends BaseModule {
	protected registry = ProjectModule;

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('package.json'))) {
			this.logger.info(`initializing npm project...`);
			await runCommand('npm init');
		} else {
			this.logger.info(`project already initialized!`);
		}
	}
}
