import kleur from 'kleur';
import * as cli from '../cli';
import config from '../../globals/config';
import { createSpinner } from 'nanospinner';
import { get_explore, get_find, get_stats, get_layout } from '../../ol/layouts';
import clipboard from 'copy-paste';
import { cwd } from 'process';
import fs from 'fs';

// @ts-ignore
import { Snippet, Input } from 'enquirer';
import { quick_install } from '../../layouts';
import { open, sleep } from '../../globals/utilities';
import { open_folder, find_folder } from '../../layouts/filesystem';
import { cat } from 'shelljs';

const auto_complete = {
    name: '',
    version: '',
    description: '',
    author: '',
    category: '',

    repository: '',

    live_preview: '',
    project_type: '',
    frameworks: [] as string[],
    languages: [] as string[],

    readme: '',
    socials: [] as Object[],

    documentation: '',
}

const create_layout_action = async (): Promise<void> => {
    const prompt = new Input({
        message: 'Path to the project you want share with the community',
        initial: cwd()
    });

    const path = await prompt.run().catch(() => { });
    cli.pcout('DEBUG', `Path result: ${path}`);

    if (!path)
        return cli.cout(kleur.red('Failed to read path!'));

    let dir = [];
    try {
        dir = await fs.readdirSync(path);
        cli.pcout('DEBUG', `Dir found with ${dir.length} files/folders`);
    } catch (error) {
        cli.cout(kleur.red('Invalid path!, try again!'));
        await sleep(1000);
        cli.clear_lines(1);
        return await create_layout_action();
    }

    if (dir.length === 0) {
        cli.cout(kleur.red('The directory is empty!'));
        await sleep(1000);
        cli.clear_lines(1);
        return await create_layout_action();
    }

    const nodejs_project = dir.includes('package.json');

    if (nodejs_project) {
        cli.pcout('DEBUG', `Node.js project found, package.json is present!`);

        let lpackage: object | any = {};

        try {
            const json_package = fs.readFileSync(path + '/package.json', 'utf8');
            lpackage = JSON.parse(json_package);
            cli.pcout('DEBUG', `Parsed package.json: ${lpackage.name} v${lpackage.version} with ${Object.keys(lpackage).length} keys`);
        } catch (error) {
            cli.cout(kleur.red('Error reading package.json!'));
        }

        auto_complete.name = lpackage.name;
        auto_complete.version = lpackage.version;
        auto_complete.description = lpackage.description;
        auto_complete.author = lpackage.author;
        auto_complete.repository = lpackage.repository.url?.replace('git+', '').replace('.git', '');
        auto_complete.documentation = lpackage.homepage;
        auto_complete.readme = lpackage.homepage;
        auto_complete.frameworks = Object.keys(lpackage.dependencies);
    }

    const layout_prompt = new Snippet({
        name: 'layout',
        message: 'Fill out the file with the layout information',
        // required: true,
        fields: [
            { name: 'name', message: 'Name of the project', required: true },
            { name: 'version', message: 'Version of the project', required: true },
            { name: 'description', message: 'Description of the project', required: true },
            { name: 'author', message: 'Author of the project', required: true },
            { name: 'repository', message: 'Repository of the project', required: true },
            {
                name: 'category',
                message: 'Category [website/other]',
                required: true,
                validate(value: string, state: string, item: object | any, index: number) {
                    // console.log(value, state, item, index);
                    
                    if (item === 'category') return true;

                    if (
                        value === 'website' || 
                        value === 'other')
                        return true;

                    return prompt.styles.danger('Category must be website or other!');
                }
            }
        ],
        template: `{
            "name": "${auto_complete.name ? kleur.green(auto_complete.name) : '\${name}'}",
            "version": "${auto_complete.version ? kleur.green(auto_complete.version) : '\${version}'}",
            "description": "${auto_complete.description ? kleur.green(auto_complete.description) : '\${description}'}",
            "author": "${auto_complete.author ? kleur.green(auto_complete.author) : '\${username}'}",
            "category": "${auto_complete.category ? kleur.green(auto_complete.category) : '\${category}'}",

            "repository": "${auto_complete.repository ? kleur.green(auto_complete.repository) : 'https://github.com/\${username}/\${name}'}",

            "live_preview": "${auto_complete.live_preview ? kleur.green(auto_complete.live_preview) : '\${live_preview}'}",
            "project_type": "${auto_complete.project_type ? kleur.green(auto_complete.project_type) : '\${project_type}'}",
            "frameworks": [${auto_complete.frameworks.map(f => `"${f}"`).join(', ')}],
            "languages": [${auto_complete.languages.map(l => `"${l}"`).join(', ')}],

            "readme": "${auto_complete.readme ? kleur.green(auto_complete.readme) : 'https://github.com/\${username}/\${name}#readme'}",
            "socials": {
                "github": "https://github.com/${auto_complete.author ? kleur.green(auto_complete.author) : '\${username}'}",
                "discord": "@${auto_complete.author ? kleur.green(auto_complete.author) : '\${username}'}",
                "x": "https://x.com/${auto_complete.author ? kleur.green(auto_complete.author) : '\${username}'}"
            },

            "documentation": "${auto_complete.documentation ? kleur.green(auto_complete.documentation) : '\${documentation}'}"
        }`
    });

    const layout = await layout_prompt.run().catch(() => { });

    if (!layout)
        return cli.cout(kleur.red('Action canceled! exiting...'));

    let parsed_layout = layout.result;
    try {
        parsed_layout = JSON.parse(layout.result);
    } catch (error) {
        cli.cout(kleur.red('Error parsing layout! something when wrong!'));
        return await create_layout_action();
    }

    clipboard.copy(JSON.stringify(parsed_layout, null, 4));

    cli.cout(kleur.bold().green('Layout created and copied to clipboard!'));
    cli.cout(kleur.italic().gray('You can now create a pull request with this layout data!'));

    cli.cout(kleur.italic().gray('Press any key to open the repository...')); cli.cin();
    await open(config.pull_request_url || '').catch(() => { });

    cli.cout(kleur.italic().gray('Press any key to exit...')); cli.cin();
}


export { create_layout_action }