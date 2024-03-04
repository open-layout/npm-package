import { exec } from 'shelljs';


/**
 * Get the package information stored in the package.json file
 * @returns {any | object} The package information
 */
const get_package = (): any | object => {
    const path = process.env.npm_package_json
    if (path) 
        return require(path)

	return { };
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

export { get_package, open, sleep };