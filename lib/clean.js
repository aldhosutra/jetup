/* eslint-disable @typescript-eslint/no-require-imports */

const shell = require('shelljs');

if (shell.test('-f', 'junit.xml')) shell.rm('junit.xml');
if (shell.test('-d', 'dist')) shell.rm('-r', 'dist');
if (shell.test('-d', 'typedoc')) shell.rm('-r', 'typedoc');
if (shell.test('-d', 'coverage')) shell.rm('-r', 'coverage');

shell.rm('-rf', 'node_modules');
shell.rm('-f', 'tsconfig.tsbuildinfo');
shell.rm('-f', 'npm-shrinkwrap.json');
