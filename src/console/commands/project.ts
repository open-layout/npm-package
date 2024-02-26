import kleur from 'kleur';
import * as cp from 'child_process';
// @ts-ignore, needed bc enquirer doesnt export them
import { Confirm } from 'enquirer';

import * as cli from '../cli';
import { Globals } from '../../globals/globals'
import { open } from '../../globals/utilities';

const Command = {
    name: "Project",
    executors: ["project", "pr", "github"],
    usage: "project",
    description: "Open the github organization page, and description of this project",
    run: async function(args: string[]) {
        const pkg = Globals.package();
        const name = pkg.name || 'open-layout';
        const version = pkg.version || '0.0.0';
        const description = pkg.description || 'Failed to get description';
        const github_url = pkg.homepage || 'Failed to get homepage';
        const github_org = `https://github.com/${name}`;
        
        var start = (process.platform == 'darwin' ? 'open': process.platform == 'win32' ? 'start': 'xdg-open');

        cli.cout(kleur.white('\nProject Information:'))
        cli.cout(' • Name: ' + kleur.bold().gray(name));
        cli.cout(' • Version: ' + kleur.bold().gray(version));
        cli.cout(' • Description: ' + kleur.bold().gray(description));
        cli.cout();
        cli.cout(' • Github Organization: ' + kleur.bold().underline().gray(github_org));
        cli.cout(' • Github Repository: ' + kleur.bold().underline().gray(github_url));
        cli.cout();

        const prompt = new Confirm({
            type: 'confirm',
            name: 'question',
            initial: true,
            message: 'Would you like to open the github organization page?'
        });
          
        prompt.run()
            .then((answer: any) => { if (answer) open(github_org) });
    }
}

export default Command;