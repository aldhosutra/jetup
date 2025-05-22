import * as winston from 'winston';
import { ModuleRegistry } from '../base/registry';
import { BaseNamedModule } from '../base/named';
import { ConfigModule } from '../config';

export class LoggerModule extends BaseNamedModule {
	protected _logger: winston.Logger;

	constructor(registry: ModuleRegistry) {
		super();
		registry.register(LoggerModule, this);

		const configModule = registry.get(ConfigModule);
		const config = configModule.get(this.name);

		this._logger = winston.createLogger({
			level: config.level,
			format: winston.format.combine(
				winston.format.colorize({ message: true }),
				winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
				winston.format.printf(({ level, message, timestamp }) => {
					return `${timestamp} [${level.slice(0, 4).toUpperCase()}]: ${message}`;
				}),
			),
			transports: [new winston.transports.Console()],
		});
	}

	public info(...messages: unknown[]) {
		this._logger.info(messages.map(String).join(' '));
	}

	public warn(...messages: unknown[]) {
		this._logger.warn(messages.map(String).join(' '));
	}

	public error(...messages: unknown[]) {
		this._logger.error(messages.map(String).join(' '));
	}

	public debug(...messages: unknown[]) {
		this._logger.debug(messages.map(String).join(' '));
	}
}
