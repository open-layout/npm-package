#!/usr/bin/env node

import kleur from 'kleur';
import * as os from 'os';
import readline from 'readline';

import * as std from './console/cli'
import { Menu } from './console/menus'
import * as cmd from './console/commands'
import * as globals from './globals/globals'
import config from './globals/config';
import { sleep } from './globals/utilities';

let args: string[] = process.argv.slice(2); // Set it to const, i just change it to test commandline args
const platform = os.platform();

std.pcout('DEBUG', `Package version ${process.env.npm_package_version}.`);
std.pcout('DEBUG', `Running on ${platform} platform.`);
std.pcout('DEBUG', `Applcation running in ${process.env.NODE_ENV}`);

if (args.length > 0)
	std.pcout('DEBUG', `Ran with args: ${args.join(',')}`);

if (!(require('color-support').level > 0)) {
	std.pcout('WARN', `The console doesnt have color support!`);
	kleur.enabled = false;
}

/**
* @brief Initialize Commands
*/
cmd.load_commands();

// args = ['get'];

process.on('SIGINT', () => { 
	std.pcout('DEBUG', 'Received SIGINT, exiting...');
	process.exit(0);
});

process.on('SIGTERM', () => {
	std.pcout('DEBUG', 'Received SIGTERM, exiting...');
	process.exit(0);
});

process.on('uncaughtException', (err) => {
	std.pcout('DEBUG', `Uncaught Exception: ${err}`);
	process.exit(1);
});

if (args.length !== 0) 
	cmd.parse(args).then((code) => process.exit(code));
else
	Menu.render();