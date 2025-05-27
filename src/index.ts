#!/usr/bin/env node
import { JetupApp } from './app';

async function main() {
	const app = new JetupApp();
	await app.init();
	await app.run();
}

main();
