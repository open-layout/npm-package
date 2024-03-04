import kleur from 'kleur';
import * as cli from '../cli';
import config from '../../globals/config';
import { createSpinner } from 'nanospinner';
import { get_explore, get_find, get_stats } from '../../ol/layouts';

// @ts-ignore
import { Select, AutoComplete, Input } from 'enquirer';
import { open, sleep } from '../../globals/utilities';
import { layout_action } from './layout';

const explore_action = async (): Promise<void> => {
    const msg = kleur.bold(' • Searching new layouts...');
    const spinner = createSpinner(msg).start();

    const explore = await get_explore();

    if (explore.length === 0) spinner.error(); else spinner.success();
    if (explore.length === 0) return cli.cout(kleur.italic('No layouts found!'));

    cli.clear_lines(1);

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

    if (!layout)
        return cli.cout(kleur.red('Failed to find layout!')); 

    await layout_action(layout.name);

    await explore_action();
}


export { explore_action }