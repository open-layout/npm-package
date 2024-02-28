import kleur from 'kleur';
import * as cli from '../cli';
import config from '../../globals/config';
import { createSpinner } from 'nanospinner';
import { get_explore, get_find, get_stats, get_layout } from '../../ol/layouts';

// @ts-ignore
import { Select, AutoComplete, Input } from 'enquirer';
import { quick_install } from '../../layouts';
import { open, sleep } from '../../globals/utilities';

const layout_action = async (layout_name: string): Promise<void> => {
    const msg = kleur.bold(' • Searching ' + layout_name);
    const spinner = createSpinner(msg).start();

    const layout = await get_layout(layout_name);
    const status = Object.keys(layout).length !== 0;

    if (!status) spinner.error(); else spinner.success();
    if (!status) return cli.cout(kleur.italic('Could not find ' + layout_name));

    cli.clear_lines(1);

    const choices = [];
    {
        choices.push('Open in OL');
        if (layout.live_preview) choices.push('Open Demo');
        if (layout.repository) choices.push('Open Repository');
        if (layout.documentation) choices.push('Open Docs');
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
        case 'Open Demo':
            await open(layout.live_preview || '').catch(console.error);
            break;
        case 'Open Repository':
            await open(layout.repository || '').catch(console.error);
            break;
        // case 'Quick Install':
        //     await quick_install(layout.name);
        //     // const install = new Select({
        //     //     name: 'install',
        //     //     message: 'Install this layout?',
        //     //     choices: ['Yes', 'No']
        //     // });

        //     // const install_res = await install.run();

        //     // if (install_res === 'Yes') {
        //     //     const msg = kleur.bold(' • Installing layout ') + kleur.gray(layout.name);
        //     //     const spinner = createSpinner(msg).start();

        //     //     cli.clear_lines(1);

        //     //     await open(layout.repository || '').catch(console.error);
        //     //     spinner.success();
        //     // }
        //     break;
        case 'Open Docs':
            await open(layout.documentation || '').catch(console.error);
            break;
        case 'Quick Install':
            await quick_install(layout.name, layout.repository);
            break;
        case 'Back':
            // Will return to the previous menu
            return;
            break;
        default:
            cli.cout(kleur.red('No action selected!'));
            await sleep(1000);
            break;
    }

    cli.clear_lines(2);
    await layout_action(layout.name);
}


export { layout_action }