export class BaseNamedModule {
	public get name(): string {
		const name = this.constructor.name.replace('Module', '');
		return name.charAt(0).toLowerCase() + name.substring(1);
	}
}
