import kleur from 'kleur';
import figlet from 'figlet';
import * as cli from './cli';
import { createSpinner } from 'nanospinner';

// @ts-ignore
import { Select, AutoComplete, Input } from 'enquirer';
import { open, sleep } from '../globals/utilities';
import { Globals } from '../globals/globals'
import config from '../globals/config';
import { get_explore, get_find, get_stats } from '../ol/layouts';
import Help from './commands/help';
import { explore_action } from './menus/explore';
import { search_action } from './menus/search';

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

		const stats = await get_stats();

		cli.cout(kleur.italic().gray('Welcome to'), kleur.bold().white('Open Layout'), kleur.italic().gray(`(${pkg.version || '0.0.0'})!`));
		cli.cout(kleur.italic().gray('Explore'), kleur.bold().white(stats.layouts?.ammount || '∞'), kleur.italic().gray('awesome layouts!'));
		cli.cout(kleur.italic().gray('Become one of our'), kleur.bold().white(stats.users?.ammount || '∞'), kleur.italic().gray('users!'));

		for (let i = 0; i < 2; i++)
			cli.cout();

		const prompt = new Select({
			name: 'option',
			message: 'Select an option:',
			margin: [0, 0, 0, 2],
			choices: [
				{ message: 'Explore layouts', name: 'explore' },
				{ message: 'Search layouts\n', name: 'search' },
				{ message: 'Show help', name: 'show_help', disabled: true },

				// { message: 'a', name: 'a', value: 'a', disabled: true },
				{ message: 'Open website', name: 'open_site' },
				{ message: 'Open repository', name: 'open_repository' },
				{ message: 'Quit', name: 'quit' }
			  ]
		});
		
		const result = await prompt.run(); // Handled with uncaughtException
		switch (result) {
			case 'explore':
				cli.pcout('DEBUG', `Executing explore_action...`);
				await explore_action()
				break;
			case 'search': 
				cli.pcout('DEBUG', `Executing explore_action...`);
				await search_action();
				break;
			case 'show_help': {
				cli.clear();
				await Help.run([]);
				break;
			}
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
			case 'quit': {
					cli.cout(kleur.green().italic('Bye!'))
					process.exit(0)
				}
				break;
			default:
				cli.cout(kleur.bold().red('No option selected!'));
				break;
		}

		await sleep(2000);

		Menu.render();
	}
}
 
export { Menu };