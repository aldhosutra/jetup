import * as figlet from 'figlet';
import { ConfigModule, LoggerModule, ModuleRegistry } from './framework';
import { DefaultPresets } from './presets';

export class TsSetupApp {
	protected _moduleRegistry = new ModuleRegistry();
	protected _configModule = new ConfigModule();
	protected _logger = new LoggerModule();

	protected _presets = [new DefaultPresets()];

	public async run() {
		this._configModule.setRegistry(this._moduleRegistry);
		this._logger.setRegistry(this._moduleRegistry);

		console.log(figlet.textSync('jetup'));
		console.log();

		this._logger.start('starting jetup...');

		// TODO: in the future version, presets can be specified on cli args
		const selectedPresetName = 'default';

		const presetsIndex = this._presets.findIndex(presets => presets.name === selectedPresetName);
		if (presetsIndex === -1) throw new Error(`preset "${selectedPresetName}" not found`);
		const selectedPreset = this._presets[presetsIndex];

		this._logger.end(
			`running setup using preset "${selectedPresetName}" with following modules: [${selectedPreset.modules.map(t => t.name).join(',')}]`,
		);

		for (const module of selectedPreset.modules) {
			this._logger.start(`setting up "${module.name}" module...`);
			module.setRegistry(this._moduleRegistry);

			if (!(await module.isInstalled())) {
				await module.installDeps();
				await module.setup();
				this._logger.end(`setup "${module.name}" module completed!`);
			} else {
				this._logger.end(`module "${module.name}" already installed...`);
			}
		}

		this._logger.info('');
		this._logger.info(`jetup completed!`);
		this._logger.info(`please give this project a star!`);
		this._logger.info(`https://github.com/aldhosutra/jetup`);
	}
}
