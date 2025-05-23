import { ModuleConfig } from '../../types';
import {
	cwd,
	getPackageName,
	hasJsonProperty,
	isFileExists,
	isFolderExists,
	packageInstallDev,
} from '../../utils';
import { ConfigModule } from '../config';
import { LoggerModule } from '../logger';
import { ModuleRegistry } from './registry';

export class BaseModule {
	protected config!: ModuleConfig;
	protected logger!: LoggerModule;
	protected autoInstallDeps = false;

	public get name(): string {
		const name = this.constructor.name.replace('Module', '');
		return name.charAt(0).toLowerCase() + name.substring(1);
	}

	constructor(registry: ModuleRegistry) {
		const configModule = registry.get(ConfigModule);
		const config = configModule.get(this.name);

		this.config = config;

		const loggerModule = registry.get(LoggerModule);
		this.logger = loggerModule;
	}

	public async isInstalled(): Promise<boolean> {
		let depsExists = this.config.installedIfDepsExists.length === 0;
		let filesOrFoldersExists = this.config.installedIfFilesOrFoldersExists.length === 0;

		this.logger.info(`checking whether ${this.name} module is already installed...`);

		depsExists = this.config.installedIfDepsExists.every(deps => {
			const dep = getPackageName(deps);
			const exists = hasJsonProperty(cwd('package.json'), `devDependencies.${dep}`);
			this.logger.info(
				`Dependency "${dep}" ${exists ? 'found' : 'not found'} in package.json devDependencies`,
			);
			return exists;
		});

		filesOrFoldersExists = this.config.installedIfFilesOrFoldersExists.every(filesOrFolders => {
			const exists = isFolderExists(cwd(filesOrFolders)) || isFileExists(cwd(filesOrFolders));
			this.logger.info(`File/folder "${filesOrFolders}" ${exists ? 'found' : 'not found'}`);
			return exists;
		});

		if (depsExists && filesOrFoldersExists) {
			this.logger.info(`module "${this.name}" is already installed! Skipping setup...`);
			return true;
		}

		this.logger.info(`module "${this.name}" is not yet installed! Continuing setup...`);
		return false;
	}

	public async setup(): Promise<void> {
		throw new Error(`setup for class ${this.constructor.name} is not implemented`);
	}

	public async installDeps(): Promise<void> {
		if (this.autoInstallDeps && this.config.installedIfDepsExists.length > 0) {
			this.logger.info(`auto installing dev dependencies of "${this.name}" module...`);

			const depsExists = this.config.installedIfDepsExists.every(deps => {
				const dep = getPackageName(deps);
				const exists = hasJsonProperty(cwd('package.json'), `devDependencies.${dep}`);
				this.logger.info(
					`Dependency "${dep}" ${exists ? 'found' : 'not found'} in package.json devDependencies`,
				);
				return exists;
			});

			if (!depsExists) {
				this.logger.info(
					`installing [${this.config.installedIfDepsExists.join(', ')}] as devDependencies`,
				);
				await packageInstallDev(this.config.installedIfDepsExists.join(' '));
			}

			this.logger.info(`dependencies installation of "${this.name}" module completed!`);
		}
	}
}
