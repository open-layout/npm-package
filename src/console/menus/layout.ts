import kleur from 'kleur';
import * as cli from '../cli';
import config from '../../globals/config';
import { createSpinner } from 'nanospinner';
import { get_explore, get_find, get_stats, get_layout } from '../../ol/layouts';

// @ts-ignore
import { Select, AutoComplete, Input, Confirm } from 'enquirer';
import { quick_install } from '../../layouts';
import { open, sleep } from '../../globals/utilities';
import { open_folder, find_folder } from '../../layouts/filesystem';

const layout_action = async (layout_name: string): Promise<void> => {
    const msg = kleur.bold(' • Searching ' + layout_name);
    const spinner = createSpinner(msg).start();

    const layout = await get_layout(layout_name);
    const status = Object.keys(layout).length !== 0;

    if (!status) spinner.error(); else spinner.success();
    if (!status) return cli.cout(kleur.italic('Could not find ' + layout_name));

    const is_present_folder = (await find_folder(layout.name, true)).length > 0;
    
    cli.clear_lines(1);

    const choices = [];
    {
        choices.push({ name: `Open in ${kleur.underline().italic('OL')}`, value: 'ol' });
        choices.push({ name: `Open ${kleur.underline().cyan('Code.Dev')}`, value: 'code.dev' });
        if (layout.live_preview) choices.push({ name: `Open ${kleur.underline().green('Demo')}`, value: 'demo' });
        if (layout.repository) choices.push({ name: `Open ${kleur.underline().green('Repository')}`, value: 'repo' });
        if (layout.documentation) choices.push({ name: `Open ${kleur.underline('Docs')}`, value: 'docs' });
        choices.push({ name: is_present_folder ? 'Already Installed' : kleur.green('Quick Install'), value: 'install', disabled: is_present_folder });
        choices.push({ name: kleur.italic('Back'), value: 'back' });
    }

    const action = new Select({
        name: 'Layout',
        margin: [0, 0, 0, 2],
        message: `Pick an action to do with (${layout.name}):`,
        choices: choices,
        result() { return this.focused.value }
    });

    const action_res = await action.run().catch(() => {});

    switch (action_res) {
        case 'ol':
            await open(config.website + '/layouts/' + layout.name || '').catch(console.error);
            break;
        case 'code.dev':
            await open(layout.repository.replace('github.com', 'github.dev') || '').catch(console.error);
            break;
        case 'demo':
            await open(layout.live_preview || '').catch(console.error);
            break;
        case 'repo':
            await open(layout.repository || '').catch(console.error);
            break;
        case 'docs':
            await open(layout.documentation || '').catch(console.error);
            break;
        case 'install':
            const ispinner = createSpinner("Cloning repository...").start();

            const iresult = await quick_install(layout.name, layout.repository);
            
            if (iresult) ispinner.success(); else ispinner.error();

            await sleep(500);
            cli.clear_lines(1);

            if (layout.project_ide) {
                const ide_prompt = new Confirm({
                    name: 'question',
                    message: `Do you want to open this project in ${kleur.bold().underline().green(layout.project_ide)}?`,
                    initial: true
                });

                const ide_response = await ide_prompt.run().catch(()=>{});

                if (ide_response) 
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
            } else {
                open_folder(layout.name, true);
            }

            cli.clear_lines(1);
            break;
        case 'back':
            // Will return to the previous menu
            return;
            break;
        default:
            cli.cout(kleur.yellow('No action selected! Returning to previous menu...'));
            return;
    }

    cli.clear_lines(2);
    await layout_action(layout.name);
}


export { layout_action }