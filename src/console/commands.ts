import * as fs from 'fs';
import * as path from 'path';
import * as std from './cli'

interface Command {
	name: string;
	executors: string[];
	usage: string;
	description: string;
	run: (args: string[]) => void;
}

const commands: Command[] = [];

const parse = (args: string[]): number => {
	std.pcout('DEBUG', `Parsing ${args.length} command line parameters: ${args.join(', ')}`)
	const command_name = args[0].replace('--', '');
	const command = commands.find((cmd) => cmd.executors.includes(command_name));

	if (command) {
		const commandArgs = args.slice(1);
		command.run(commandArgs);
	} else 
		std.pcout('ERROR', `Command not found: ${command_name}`);

	return command ? 0 : 1;
}

const validate_command = (module: any) => {
	return (
		module &&
		typeof module.name === 'string' &&
		Array.isArray(module.executors) &&
		typeof module.description === 'string' &&
		typeof module.run === 'function'
	);
}

const load_commands = () => {
	const dir = path.join(__dirname, 'commands')
	const files = fs.readdirSync(dir);

	files.forEach((file) => {
		const filePath = path.join(dir, file);

		if (
			fs.statSync(filePath).isFile() &&
			path.extname(filePath) === '.ts' ||
			path.extname(filePath) === '.js'
		) {
			const commandModule: Command = require(filePath).default;

			if (validate_command(commandModule)) {
				commands.push(commandModule);
				std.pcout('DEBUG', `Parsing command file: ${file}`);
			} else {
				std.pcout('ERROR', `Invalid command module in file: ${file}`);
			}
		}
	});
	std.pcout('DEBUG', `Parsed a total of (${commands.length}) commands.`);
}

export { commands, parse, load_commands }