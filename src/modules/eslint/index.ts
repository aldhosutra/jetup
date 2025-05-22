import { BaseModule, ModuleRegistry } from '../../framework';
import { runCommand } from '../../utils';

export class EsLintModule extends BaseModule {
	constructor(registry: ModuleRegistry) {
		super(registry);
		registry.register(EsLintModule, this);
	}

	public async setup(): Promise<void> {
		this.logger.info(`executing: npm init @eslint/config@latest`);
		await runCommand('npm init @eslint/config@latest');
	}
}
