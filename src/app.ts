import figlet from 'figlet';
import { ConfigModule, LoggerModule, ModuleRegistry } from './framework';
import {
	EsLintModule,
	HuskyModule,
	JestModule,
	LintStagedModule,
	PackageModule,
	PrettierModule,
	ProjectModule,
	SrcModule,
	TypescriptModule,
} from './modules';

export class TsSetupApp {
	protected _moduleRegistry = new ModuleRegistry();
	protected _configModule = new ConfigModule(this._moduleRegistry);
	protected _logger = new LoggerModule(this._moduleRegistry);

	protected _modules = [
		new ProjectModule(this._moduleRegistry),
		new PackageModule(this._moduleRegistry),
		new EsLintModule(this._moduleRegistry),
		new HuskyModule(this._moduleRegistry),
		new JestModule(this._moduleRegistry),
		new LintStagedModule(this._moduleRegistry),
		new PrettierModule(this._moduleRegistry),
		new TypescriptModule(this._moduleRegistry),
		new SrcModule(this._moduleRegistry),
	];

	public async run() {
		console.log(figlet.textSync('ts-setup'));

		this._logger.info('starting ts-setup...');
		this._logger.info(
			`running setup for following modules: [${this._modules.map(t => t.name).join(',')}]`,
		);

		for (const module of this._modules) {
			this._logger.info(`setting up "${module.name}" module...`);
			if (!(await module.isInstalled())) {
				await module.installDeps();
				await module.setup();
				this._logger.info(`setup "${module.name}" module completed!`);
			} else {
				this._logger.info(`module "${module.name}" already installed...`);
			}
		}

		this._logger.info(`ts-setup successfull!`);
		this._logger.info(`please give this project a star!`);
		this._logger.info(`https://github.com/aldhosutra/ts-setup`);
	}
}
