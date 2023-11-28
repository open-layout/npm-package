import * as os from 'os';
import * as std from './console/menus'
import * as cli from './console/cli-args'
import globals from './globals/globals'

const args = process.argv.slice(2);
const platform = os.platform();

std.pcout('INFO', `Running on ${platform} platform.`);

if (args.length === 0) {
	std.showMainMenu();
} else { 
	cli.parse(args);
}