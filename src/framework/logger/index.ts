import * as winston from 'winston';
import { createSpinner, Spinner } from 'nanospinner';
import { ModuleRegistry } from '../base/registry';
import { BaseNamedModule } from '../base/named';
import { ConfigModule } from '../config';

interface Logger {
	info: (message: string) => void;
	warn: (message: string) => void;
	debug: (message: string) => void;
	error: (message: string) => void;
}

export class LoggerModule extends BaseNamedModule {
	protected _logger!: Logger;
	protected _spinner!: Spinner & { debug?: (message: string) => void };
	protected registry = LoggerModule;
	protected verbose = false;

	setRegistry(registry: ModuleRegistry) {
		super.setRegistry(registry);

		const configModule = registry.get(ConfigModule);
		const config = configModule.get(this.name);
		this.verbose = config.verbose;

		if (this.verbose) {
			this._logger = winston.createLogger({
				level: 'debug',
				format: winston.format.combine(
					winston.format.colorize({ message: true }),
					winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
					winston.format.printf(({ level, message, timestamp }) => {
						return `${timestamp} [${level.slice(0, 4).toUpperCase()}]: ${message}`;
					}),
				),
				transports: [new winston.transports.Console()],
			});
		} else {
			this._logger = console;
		}
	}

	public info(...messages: unknown[]) {
		this._getLogger().info(messages.map(String).join(' '));
	}

	public warn(...messages: unknown[]) {
		this._getLogger().warn(messages.map(String).join(' '));
	}

	public error(...messages: unknown[]) {
		this._getLogger().error(messages.map(String).join(' '));
	}

	public debug(...messages: unknown[]) {
		this._getLogger().debug(messages.map(String).join(' '));
	}

	public start(text?: string) {
		if (!this.verbose) {
			this._spinner = createSpinner(text);
			this._spinner.info = this._spinner.update;
			this._spinner.warn = this._spinner.update;
			this._spinner.debug = this._spinner.update;
			this._spinner.start();
		} else {
			this.info(text);
		}
	}

	public stop() {
		if (!this.verbose && this._spinner) {
			this._spinner.stop();
		}
	}

	public end(text?: string) {
		if (!this.verbose) {
			this._spinner.success({ text });
		} else {
			this.info(text);
		}
	}

	private _getLogger(): Logger {
		if (!this.verbose && this._spinner) {
			return this._spinner as Logger;
		} else {
			return this._logger;
		}
	}
}
