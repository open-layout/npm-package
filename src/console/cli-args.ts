import * as fs from 'fs';
import * as path from 'path';
import * as std from './menus'


interface Command {
	name: string;
	executors: string[];
	description: string;
	run: (args: string[]) => void;
}

const commands: Command[] = [];

export function parse(args: string[]): void {
	console.log(args);
	if (
		args.includes('--help') 
		|| args.includes('-h')
		) {
		std.helpMenu();
	} else if (args.includes('--credits') || args.includes('cred')) {
		// printCredits();
	} else {
		// printDefault();
	}
}

export function loadCommands(): void {
	const folder = './commands'
	const files = fs.readdirSync(folder);
  
	files.forEach((file) => {
	  const filePath = path.join(folder, file);
  
	  if (fs.statSync(filePath).isFile() && path.extname(filePath) === '.ts') {
		const commandModule: Command = require(filePath).default;
  
		if (validateCommandModule(commandModule)) {
			commands.push(commandModule);
		} else {
			std.pcout('ERROR', `Invalid command module in file: ${file}`);
		}
	  }
	});
  }
  
  function validateCommandModule(module: any): module is Command {
	return (
	  module &&
	  typeof module.name === 'string' &&
	  Array.isArray(module.executors) &&
	  typeof module.description === 'string' &&
	  typeof module.run === 'function'
	);
  }