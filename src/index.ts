import * as os from 'os';
import kleur from 'kleur';
import * as std from './console/cli'
import * as menu from './console/cli-menus'
import * as cli from './console/cli-commands'
import globals from './globals/globals'

let args = process.argv.slice(2); // Set it to const, i just change it to test commandline args
const platform = os.platform();

std.pcout('DEBUG', `Running on ${platform} platform.`);
std.pcout('DEBUG', `Applcation running in ${process.env.NODE_ENV}`);
std.pcout('DEBUG', `Ran with args: ${args.join(',')}`);
if (!(require('color-support').level > 0)) {
	std.pcout('WARN', `The console doesnt have color support!`);
	kleur.enabled = false;
}

/**
* @brief Initialize Commands
*/
cli.load_commands();

args = ["help"]

if (args.length === 0) {
	menu.logo();
} else { 
	cli.parse(args);
}