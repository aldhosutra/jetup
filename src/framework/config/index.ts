import { isFileExists, readFile } from '../../utils';
import { BaseNamedModule } from '../base/named';
import { getDefaultConfig, parseConfig } from './config';

export class ConfigModule extends BaseNamedModule {
	protected registry = ConfigModule;
	protected _appConfig: Record<string, unknown>;

	constructor() {
		super();
		this._appConfig = getDefaultConfig();
	}

	public get<T>(moduleName: string) {
		if (!Object.keys(this._appConfig).includes(moduleName)) {
			throw new Error(`config for module ${moduleName} is not defined`);
		}
		return this._appConfig[moduleName] as T;
	}

	public setConfigFile(path: string) {
		if (!path) return;
		if (!isFileExists(path)) throw new Error(`provided config path "${path}" doesn't exists`);

		const config = JSON.parse(readFile(path));
		this._appConfig = parseConfig(config);
	}
}
