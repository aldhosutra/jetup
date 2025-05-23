import { BaseModule } from '../../framework';
import { runCommand } from '../../utils';

export class EsLintModule extends BaseModule {
	protected registry = EsLintModule;

	public async setup(): Promise<void> {
		this.logger.info(`executing: npm init @eslint/config@latest`);
		await runCommand('npm init @eslint/config@latest');
	}
}
