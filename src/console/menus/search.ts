import kleur from 'kleur';
import * as cli from '../cli';
import config from '../../globals/config';
import { createSpinner } from 'nanospinner';
import { get_explore, get_find, get_stats } from '../../ol/layouts';

// @ts-ignore
import { Select, AutoComplete, Input } from 'enquirer';
import { open, sleep } from '../../globals/utilities';
import { layout_action } from './layout';

const search_action = async (): Promise<void> => {
    const seach_suggetions = [
        'Awesome portfolio layout',
        'Orbit of imagination layout',
        'Automatic github portfolio',
        'Simple star destroyer layout to make at home',
        'oppen-heimer famous project'
    ]

    const prompt = new Input({
        message: 'Seach layouts',
        initial: seach_suggetions[Math.floor(Math.random() * seach_suggetions.length)],
    });
    
    const search = await prompt.run().catch(() => {});
    cli.pcout('DEBUG', `Search result: ${search}`);
    
    if (!search)
        return cli.cout(kleur.red('Failed to read search!')); 
    
    const msg = kleur.bold(' • Searching new layouts...');
    const spinner = createSpinner(msg).start();

    const search_result = await get_find(search)
    
    if (search_result.length === 0) spinner.error(); else spinner.success();
    if (search_result.length === 0) {
        cli.cout(kleur.italic().gray('No layouts found with'), kleur.strikethrough().red(search), kleur.italic().gray('search!'));

        await sleep(1000);

        cli.clear_lines(3);
        return await search_action()
    }

    const select_layout = new Select({
        name: 'layout',
        message: 'Choose a layout:',
        limit: 5,
        margin: [0, 0, 0, 2],
        choices: search_result.map(layout => ({
            message: `${kleur.bold(layout.name)}\n • Description: ${kleur.gray(layout.description)}`,
            name: layout.name
        })),
    });

    const res = await select_layout.run().catch(()=>{});

    const layout = search_result.find(layout => layout.name === res);

    if (!layout) { cli.cout(kleur.red('Failed to find layout!')); }

    await layout_action(layout.name);
}

export { search_action }