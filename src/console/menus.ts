import kleur from 'kleur';
import figlet from 'figlet';
import * as cli from './cli';
import { createSpinner } from 'nanospinner';

// @ts-ignore
import { Select } from 'enquirer';
import { open, sleep } from '../globals/utilities';
import { Globals } from '../globals/globals'
import config from '../globals/config';
import { get_layouts } from '../ol/layouts';
import Help from './commands/help';

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
				{ message: 'Explore layouts', name: 'explore' },
				{ message: 'Search layouts\n', name: 'search' },
				{ message: 'Show help', name: 'show_help', disable: true },

				// { message: 'a', name: 'a', value: 'a', disabled: true },
				{ message: 'Open website', name: 'open_site' },
				{ message: 'Open repository', name: 'open_repository' },
				{ message: 'Quit', name: 'quit' }
			  ]
		});
		
		const result = await prompt.run(); // Handled with uncaughtException
		switch (result) {
			case 'explore':
				const msg = kleur.bold(' • Searching new layouts...');
				const spinner = createSpinner(msg).start();

				const explore = await get_layouts();

				if (explore.length === 0) spinner.error(); else spinner.success();
				if (explore.length === 0) 
					return cli.cout(kleur.italic('No layouts found!'));

				const select_layout = new Select({
					name: 'layout',
					message: 'Choose a layout:',
					limit: 5,
					margin: [0, 0, 0, 2],
					choices: explore.map(layout => ({
						message: `${kleur.bold(layout.name)}\n • Description: ${kleur.gray(layout.description)}`,
						name: layout.name
					})),
				});

				const res = await select_layout.run().catch(()=>{});

				const layout = explore.find(layout => layout.name === res);

				if (!layout) { cli.cout(kleur.red('Failed to find layout!')); await sleep(1000); break; }

				const choices = [];
				{
					choices.push('Open in OL');
					if (layout.website) choices.push('Open Preview');
					if (layout.repository) choices.push('Open Repository');
					if (layout.demo) choices.push('Open Demo');
					choices.push('Quick Install');
					choices.push('Back');
				}

				const action = new Select({
					name: 'Layout',
					margin: [0, 0, 0, 2],
					message: `Pick an action to do with (${layout.name}):`,
					choices: choices
				});

				const action_res = await action.run().catch(()=>{});

				switch (action_res) {
					case 'Open in OL':
						await open(config.website + '/layouts/' + layout.name || '').catch(console.error);
						break;
					case 'Open Website':
						await open(layout.website || '').catch(console.error);
						break;
					case 'Open Repository':
						await open(layout.repository || '').catch(console.error);
						break;
					case 'Quick Install':
						const install = new Select({
							name: 'install',
							message: 'Install this layout?',
							choices: ['Yes', 'No']
						});

						const install_res = await install.run();

						if (install_res === 'Yes') {
							const msg = kleur.bold(' • Installing layout ') + kleur.gray(layout.name);
							const spinner = createSpinner(msg).start();

							await open(layout.repository || '').catch(console.error);
							spinner.success();
						}
						break;
					default:
						cli.cout(kleur.red('No action selected!'));
						break;
				}

				cli.pcout('DEBUG', `Action result: ${action_res}`);
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