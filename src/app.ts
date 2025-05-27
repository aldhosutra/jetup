import * as figlet from 'figlet';
import { Argument, Command, Option, OptionValues } from 'commander';
import { ConfigModule, LoggerModule, ModuleRegistry } from './framework';
import { TsPresets } from './presets';
import * as packageJson from '../package.json';
import { BasePresets } from './presets/base';

export class JetupApp {
	protected _moduleRegistry = new ModuleRegistry();
	protected _configModule = new ConfigModule();
	protected _logger = new LoggerModule();
	protected _program = new Command();
	protected _options!: OptionValues;

	protected _presets = [new TsPresets()];
	protected _selectedPreset!: BasePresets;

	public async init() {
		this._program
			.name(packageJson.name.charAt(0).toUpperCase() + packageJson.name.substring(1))
			.description(packageJson.description)
			.version(packageJson.version);

		this._program
			.addArgument(
				new Argument('[location]', 'Project location (default: current directory)').default('.'),
			)
			.addArgument(new Argument('[preset]', 'Jetup preset to use (default: "ts")').default('ts'))
			.addOption(new Option('--preset <presetName>', 'Override preset to use'))
			.addOption(new Option('-c, --config <path>', 'Path to config file').env('JETUP_CONFIG'))
			.action(this._parseArgument.bind(this));

		this._program.addHelpText(
			'after',
			`
Example call:
   $ npx jetup`,
		);

		this._program.addHelpText(
			'afterAll',
			`
Please give Jetup a Star!:
   ${packageJson.homepage}`,
		);

		try {
			this._program.parse(process.argv);
			this._options = this._program.opts();
		} catch (err) {
			this._logger.start('');
			this._logger.error(`Failed to parse CLI input: ${(err as Error).message}`);
			process.exitCode = 1;
			process.exit();
		}

		this._configModule.setRegistry(this._moduleRegistry);
		this._logger.setRegistry(this._moduleRegistry);
	}

	public async run() {
		console.log(figlet.textSync('jetup'));
		console.log();

		try {
			await this._runHandler();
		} catch (err) {
			this._logger.error(`An error occurred: ${(err as Error).message}`);
			process.exitCode = 1;
			process.exit();
		} finally {
			this._printFooter();
		}
	}

	private _parseArgument(_location: string, selectedPresetName: string, options: OptionValues) {
		if (options.config) this._configModule.setConfigFile(options.config);

		if (selectedPresetName && options.preset && selectedPresetName !== options.preset) {
			this._logger.warn(
				`Both positional preset "${selectedPresetName}" and --preset "${options.preset}" provided. Using --preset.`,
			);
		}

		const presetName = options.preset || selectedPresetName || 'ts';
		// const projectLocation = location || '.';

		const preset = this._presets.find(p => p.name === presetName);
		if (!preset) throw new Error(`Preset "${presetName}" not found`);

		this._selectedPreset = preset;
	}

	private async _runHandler() {
		this._logger.start(`starting ${packageJson.name}`);
		this._logger.end(
			`Jetting-Up "${this._selectedPreset.name}" preset with following modules: [${this._selectedPreset.modules.map(t => t.name).join(',')}]`,
		);

		for (const module of this._selectedPreset.modules) {
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

		this._logger.start(``);
		this._logger.end(`Jetting-Up "${this._selectedPreset.name}" preset completed!`);
	}

	private _printFooter() {
		console.log('\nPlease give Jetup a star, and visit our website!:');
		console.log(`   ${packageJson.repository.url.replace('.git', '').replace('git+', '')}`);
		console.log(`   ${packageJson.homepage}`);
		console.log('');
	}
}
