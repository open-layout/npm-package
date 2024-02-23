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

const open = async (url: string): Promise<string> => {
    if (!url) 
        throw new Error('No URL provided to open');

    return new Promise((resolve, reject) => {
        let result: { stdout: string, stderr: string, code: number };

        if (process.platform == 'darwin') 
            result = exec('open ' + url);
        else if (process.platform == 'win32') 
            result = exec('start ' + url);
        else 
            result = exec('xdg-open ' + url);

        if (result.code !== 0)
            throw new Error('Failed to open URL');

        resolve(result.stdout);
    });
}

export { get_package, open };