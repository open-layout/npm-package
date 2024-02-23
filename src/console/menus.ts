import kleur from 'kleur';
import figlet from 'figlet';
import * as cli from './cli';
import { createSpinner } from 'nanospinner';

// @ts-ignore
import { Select } from 'enquirer';
import { open } from '../globals/utilities';
import { Globals } from '../globals/globals'
import config from '../globals/config';

class Menu {
	private static render_header(): void {
		cli.clear();
	
		const terminalWidth = process.stdout.columns || 80;
	
		const pkg = Globals.package();
	
		const name = pkg.name || 'open-layout';
		const version = pkg.version || '0.0.0';
		const layouts = '3 Layouts'
		
		const availableSpace = terminalWidth - layouts.length - name.length - version.length - 6;
		
		if (availableSpace < 0)
			return;
	
		const padding = Math.floor(availableSpace / 2);
		
		const output = kleur.bgCyan(
			kleur.white().italic(
				`${layouts.padEnd(padding + layouts.length)}  ${kleur.bold(name)}  ${version.padStart(padding + version.length)}`
				)
		)
		process.stdout.write(output.padStart(4))
		process.stdout.write('\n')
	}

	public static logo(): void {
		const pkg = Globals.package();

		const width = process.stdout.columns
		const logo =  figlet.textSync(pkg.name, {
			font: (width > 120) ? "Univers" : (width > 80) ? "Kban" : "Small",
			horizontalLayout: "full",
			verticalLayout: "fitted",
			width: width,
			whitespaceBreak: true,
		})

		cli.cout(logo)
	}
	
	public static async render(): Promise<void> {
		const pkg = Globals.package();
		cli.clear();

		Menu.logo();
		cli.cout(kleur.bold().white(`Welcome to Open Layout (${pkg.version || '0.0.0'})!`));

		for (let i = 0; i < 3; i++)
			cli.cout();

		const prompt = new Select({
			name: 'option',
			message: 'Select an option:',
			margin: [0, 0, 0, 2],
			choices: [
				{ message: 'Explore layouts\n', name: 'explore' },
				// { message: 'a', name: 'a', value: 'a', disabled: true },
				{ message: 'Open website', name: 'open_site' },
				{ message: 'Open repository', name: 'open_repository' },
			  ]
		});
		
		const result = await prompt.run()
			.catch(console.error);

		switch (result) {
			case 'explore':
				cli.cout('Explore layouts');
				break;
			case 'open_site': {
				const msg = kleur.bold(' • Openning Website ') + kleur.cyan().underline(pkg.homepage);
				const spinner = createSpinner(msg).start();

				await open(config.website || '').then(() => spinner.success()).catch(() => spinner.error());
			}
			break;
			case 'open_repository': {
					const msg = kleur.bold(' • Openning Repository ') + kleur.cyan().underline(pkg.homepage)
					const spinner = createSpinner(msg).start()
	
					await open(pkg.homepage || '').then(() => spinner.success()).catch(() => spinner.error());
				}
				break;
			default:
				cli.cout(kleur.bold().red('No option selected!'));
				break;
		}

		// Menu.render();
	}
}
 
export { Menu };