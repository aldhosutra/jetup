import { BaseNamedModule, ModuleRegistry } from '../base';
import config from './config';

export class ConfigModule extends BaseNamedModule {
	constructor(registry: ModuleRegistry) {
		super();
		registry.register(ConfigModule, this);
	}

	public get(moduleName: string) {
		if (!Object.keys(config).includes(moduleName)) {
			throw new Error(`config for module ${moduleName} is not defined`);
		}
		return config[moduleName];
	}
}
