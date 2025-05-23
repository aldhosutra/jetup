import { BaseModule } from '../../framework';
import { cwd, isFileExists, runCommandInAlternateScreen } from '../../utils';

export class ProjectModule extends BaseModule {
	protected registry = ProjectModule;

	public async setup(): Promise<void> {
		if (!isFileExists(cwd('package.json'))) {
			this.logger.info(`initializing npm project...`);
			this.logger.stop();
			await runCommandInAlternateScreen('npm init');
		} else {
			this.logger.info(`project already initialized!`);
		}
	}
}
