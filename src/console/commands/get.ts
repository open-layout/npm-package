import * as fs from 'fs';
import * as path from 'path';
import kleur from 'kleur';
// @ts-ignore, needed bc enquirer doesnt export them
import { Select, prompt } from 'enquirer';

import * as cli from '../cli';
import { commands } from '../commands';
import { Menu } from '../menus';
import { get_layout } from '../../ol/layouts';
import { quick_install } from '../../layouts';
import { createSpinner } from 'nanospinner';
import { open, sleep } from '../../globals/utilities';
import { find_folder, open_folder } from '../../layouts/filesystem';

const Command = {
    name: "Get",
    executors: ["get", "download"],
    usage: "get <layout>",
    description: "Clones & Downloads the target layout",
    run: async function(args: string[]) {
        if (args.length != 1) {
            cli.cout(kleur.red('Invalid number of arguments!'))
            cli.cout(kleur.gray('Usage: ') + kleur.bold('get <layout>'))
            return;
        }

        const input_layout = args[0];

        const layout = await get_layout(input_layout);
        const status = Object.keys(layout).length !== 0;

        if (!status) 
            return cli.cout(kleur.bold().red('X') + kleur.italic(' Could not find ') + kleur.gray().strikethrough(input_layout));

        const folder = await find_folder(layout.name, true);

        if (folder) 
            return cli.cout(kleur.bold().red('X') + kleur.italic(' Layout ') + kleur.gray().italic(layout.name) + kleur.italic(' already exists!'));

        const spinner = createSpinner(kleur.bold(' • Cloning layout (' + layout.name + ') ...')).start();

        const iresult = await quick_install(layout.name, layout.repository);

        if (iresult) spinner.success(); else spinner.error();

        if (layout.project_ide) {
            switch (layout.project_ide) {
                case 'vsc':
                    open('code ' + layout.name)
                    break;
                case 'vs':
                    open('devenv ' + layout.name)
                    break;
                case 'intellij':
                    open('idea ' + layout.name)
                    break;
                default:
                    open_folder(layout.name, true);
                    break;
            }
        } else 
            open_folder(layout.name, true);

        cli.cout(kleur.bold().green('✓') + ' ' + kleur.underline().italic(layout.name) + kleur.italic().gray(' cloned and opened!'));
    }
}

export default Command;