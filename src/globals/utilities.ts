import fs from 'fs';
import { exec } from 'shelljs';


/**
 * Get the package information stored in the package.json file
 * @returns {any | object} The package information
 */
const get_package = (): any | object => {
    try {
        const path = process.env.npm_package_json
        
        if (path) 
            return require(path)

        const file = fs.readFileSync(__dirname + '/../../package.json', 'utf8');

        if (file) 
            return JSON.parse(file);
    } catch (e) { 
        return {}; 
    }

	return { };
}

const get_latest_version = async (package_name: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        exec(`npm show ${package_name} version`, { silent: true },  (code, stdout, stderr) => {
            if (code !== 0) 
                resolve('');

            resolve(stdout.replace('\n', ''));
        });
    })
}

/**
 * Open any URL or file using the default application
 * @param target The URL to open 
 * @returns {Promise<string>} The result of the command
 */
const open = async (target: string): Promise<string> => {
    if (!target) 
        throw new Error('No URL provided to open');

    return new Promise((resolve, reject) => {
        let result: { stdout: string, stderr: string, code: number };

        if (process.platform == 'darwin') 
            result = exec('open ' + target);
        else if (process.platform == 'win32') 
            result = exec('start ' + target);
        else 
            result = exec('xdg-open ' + target);

        if (result.code !== 0)
            throw new Error('Failed to open Target');

        resolve(result.stdout);
    });
}

/**
 * Sleep for a given amount of time
 * @param ms The time to sleep in milliseconds
 * @returns {Promise<void>} A promise that resolves after the given time
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export { get_package, get_latest_version, open, sleep };