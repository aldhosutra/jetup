interface Module {
	name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Constructor = new (...args: any) => Module;

interface ModuleMap {
	readonly size: number;

	clear(): void;
	delete(key: Constructor): boolean;
	get<K extends Constructor>(key: K): InstanceType<K> | undefined;
	has(key: Constructor): boolean;
	set<K extends Constructor>(key: K, value: InstanceType<K>): this;
	values(): IterableIterator<Module>;
}

export class ModuleRegistry {
	private readonly _registry: ModuleMap = new Map();

	public register<K extends Constructor>(key: K, value: InstanceType<K>): void {
		this._registry.set(key, value);
	}

	public get<K extends Constructor>(key: K): InstanceType<K> {
		const named = this._registry.get(key);
		if (!named) {
			throw new Error(`Class ${key.name} is not registered.`);
		}
		return named;
	}

	public keys(): string[] {
		const result: string[] = [];
		for (const klass of this._registry.values()) {
			result.push(klass.name);
		}
		return result;
	}

	public values(): Module[] {
		const result: Module[] = [];
		for (const klass of this._registry.values()) {
			result.push({
				name: klass.name,
			});
		}
		return result;
	}
}
