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
} from '../modules';
import { BasePresets } from './base';

export class DefaultPresets extends BasePresets {
	public modules = [
		new ProjectModule(),
		new PackageModule(),
		new EsLintModule(),
		new HuskyModule(),
		new JestModule(),
		new LintStagedModule(),
		new PrettierModule(),
		new TypescriptModule(),
		new SrcModule(),
	];
}
