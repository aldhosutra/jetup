import { BaseNamedModule } from '../base/named';
import config from './config';

export class ConfigModule extends BaseNamedModule {
	protected registry = ConfigModule;

	public get(moduleName: string) {
		if (!Object.keys(config).includes(moduleName)) {
			throw new Error(`config for module ${moduleName} is not defined`);
		}
		return config[moduleName];
	}
}
