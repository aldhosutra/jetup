import { config } from 'dotenv';
import merge from 'lodash.merge';
import * as appConfig from '../../../config/config.json';

config();

export default merge({}, appConfig, {});
