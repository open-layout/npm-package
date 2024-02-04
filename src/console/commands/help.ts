import * as fs from 'fs';
import * as path from 'path';
import kleur from 'kleur';
// @ts-ignore, needed bc enquirer doesnt export them
import { Select, prompt } from 'enquirer';

import * as cli from '../cli';
import { commands } from '../cli-commands';
import * as menus from '../cli-menus';

const Command = {
    name: "Help",
    executors: ["help", "halp", "h"],
    usage: "help",
    description: "Shows description for all commands",
    run: async function(args: string[]) {
        if (args.length != 0) {
            const command = commands.find((cmd) => cmd.executors.includes(args[0]));

            if (command) {
                cli.cout(kleur.white(kleur.italic().bold(command.name) + ' command help!'))
                cli.cout(kleur.bold(' • Executors: '), kleur.gray(command.executors.join(', ')))
                cli.cout(kleur.bold(' • Usage: '), kleur.gray("> open-layout " + command.usage))
                cli.cout(kleur.bold(' • Description: '), kleur.gray(command.description))

                return;
            }
            
        }

        menus.logo();

        const prompt_select = new Select({
            name: 'command',
            message: 'Choose a command:',
            choices: commands.map(cmd => ({
                name: cmd.name,
                message: `${kleur.bold(cmd.name)}\n • Description: ${kleur.gray(cmd.description)}`,
            })),
        });
    
        const res = await prompt_select.run();
    
        /**
         * Select by command name
         */
        const selectedCommand = commands.find(cmd => cmd.name === res);
        if (selectedCommand) {
            const res: any = await prompt({
                type: 'input',
                name: 'args',
                message: 'Enter command arguments (space-separated):',
            });

            const args = res.args.split(' ')
    
            selectedCommand.run(args);
        } else {
            cli.cout('Invalid command selected.');
        }
    }
}

export default Command;