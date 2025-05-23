import { BaseModule } from '../../framework';
import { runCommandInAlternateScreen } from '../../utils';

export class EsLintModule extends BaseModule {
	protected registry = EsLintModule;

	public async setup(): Promise<void> {
		this.logger.info(`executing: npm init @eslint/config@latest`);
		this.logger.stop();
		await runCommandInAlternateScreen('npm init @eslint/config@latest');
	}
}
