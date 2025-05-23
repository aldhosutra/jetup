import { BaseModule } from '../../framework';
import {
	changeFilePermission,
	createOrReplaceFile,
	cwd,
	isFolderExists,
	readFile,
	runCommand,
} from '../../utils';

export class HuskyModule extends BaseModule {
	protected autoInstallDeps = true;
	protected registry = HuskyModule;

	public async setup(): Promise<void> {
		if (!isFolderExists(cwd('.husky'))) {
			this.logger.info(`executing: npx husky init`);
			await runCommand('npx husky init');

			this.logger.info(`modifying pre-commit file contents`);
			await createOrReplaceFile(cwd('.husky/pre-commit'), readFile(__dirname, './pre-commit'));

			this.logger.info(`modifying pre-commit file permission`);
			await changeFilePermission(cwd('.husky/pre-commit'), 0o755);
		} else {
			this.logger.info(`.husky folder already exists`);
		}
	}
}
