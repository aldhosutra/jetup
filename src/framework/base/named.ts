import { Constructor, ModuleRegistry } from './registry';

export class BaseNamedModule {
	protected registry: Constructor | undefined;

	public setRegistry(registry: ModuleRegistry) {
		if (!this.registry) throw new Error(`${this.name}.registry is not configured`);
		registry.register(this.registry, this);
	}

	public get name(): string {
		const name = this.constructor.name.replace('Module', '');
		return name.charAt(0).toLowerCase() + name.substring(1);
	}
}
