import { config } from 'dotenv';
import * as merge from 'lodash.merge';
import * as appConfig from '../../../config/config.json';
import * as defaultConfig from './default.json';

config();

export function getDefaultConfig() {
	return merge(defaultConfig, appConfig, parseConfigEnv());
}

export function parseConfig(config: Record<string, unknown>) {
	return merge(defaultConfig, config, parseConfigEnv());
}

function parseConfigEnv() {
	return {};
}
