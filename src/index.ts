import { TsSetupApp } from './app';

async function main() {
	const app = new TsSetupApp();
	await app.run();
}

main();
