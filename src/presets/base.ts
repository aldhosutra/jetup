import { BaseModule } from '../framework';

export abstract class BasePresets {
	public modules: BaseModule[] = [];

	public get name(): string {
		const name = this.constructor.name.replace('Presets', '');
		return name.charAt(0).toLowerCase() + name.substring(1);
	}
}
