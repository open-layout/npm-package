import { exec, spawn } from 'child_process';
import hidefile from 'hidefile';
import { cwd } from 'process';
import zip from 'extract-zip'
import fs from 'fs';

/**
 * Download a repository using curl in case the user doesnt have git installed
 * @param url URL of the repository
 * @param attempt Number of attempts to download the file
 * @returns Promise<boolean>
 */
const curl_download = (name: string, url: string, attempt: number = 0): Promise<boolean> => {
    const branches = ['master', 'main']
    if (attempt >= branches.length) return Promise.reject(new Error('Failed to download file!'));
    
    const archive_url = `${url}/archive/${branches[attempt]}.zip`;

    return new Promise((resolve, reject) => {
        // const command = `curl -L -o olayout.zip ${archive_url}`;
        
        const cprocess = spawn('curl', ['-L', '-o', 'olayout.zip', archive_url], { cwd: cwd() });

        cprocess.on('error', (error) => {
            // console.error(`Error while downloading file: ${error.message}`);
            reject(error);
        });

        cprocess.on('close', async (code) => {
            if (code === 0) {
                await unzip('olayout.zip', cwd())
                await delete_file('olayout.zip')

                // rename open-layouts-main to open-layouts so we remove the branch name
                const folder = await find_folder(name)

                if (folder)
                    await rename_folder(`${cwd()}/${folder}`, `${cwd()}/${name}`)

                resolve(true);
            } else {
                curl_download(name, url, attempt + 1)
                    .then(resolve)
                    .catch(reject);
            }
        });
    });
}

/**
 * Hide a file using the hidefile package
 * @param path Path to the file
 * @returns Promise<boolean> result of the operation
 */
const hide = (path: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        hidefile.hide(path, (error) => {
            if (error) reject(error);
            resolve(true);
        });
    });
}

/**
 * Unzip a file using the extract-zip package
 * @param path Path to the file
 * @param dest Destination path
 * @returns Promise<boolean> result of the operation
 */
const unzip = (path: string, dest: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        zip(path, { dir: dest })
        
        .then(() => {
            resolve(true);
        }).catch((error) => {
            reject(error);
        });
    });
}

/**
 * Delete a file using the fs package
 * @param path Path to the file
 * @returns Promise<boolean> result of the operation
 */
const delete_file = (path: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (error) => {
            if (error) reject(error);
            resolve(true);
        });
    });
}

const open_folder = (path: string, relative: boolean = false): boolean => {
    path = relative ? cwd() + '/' + path : path;

    console.log('Opening folder:', path);

    if (process.platform == 'darwin') 
        spawn('open', [path], { stdio: 'inherit' });
    else if (process.platform == 'win32') 
        spawn('explorer', [path], { stdio: 'inherit' });
    else 
        spawn('xdg-open', [path], { stdio: 'inherit' });

    return true;
}

const find_folder = (name: string, exact: boolean = false, path: string = cwd()): Promise<string> => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, folders) => {
            if (error) reject(error);
            resolve(folders.find((dir: string) => (!exact) ? dir.includes(name) : dir == name) || '');
        });
    });
}

const rename_folder = (path: string, new_name: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.rename(path, new_name, (error) => {
            if (error) reject(error);
            resolve(true);
        });
    });
}
/*
    const sanitize_gh_name = (input: string): string => {
        const parts = input.split('-');
        const result = parts.slice(0, -1).join('-');
        return result.endsWith('/') ? result.slice(0, -1) : result;
    };
*/

export { curl_download, open_folder, find_folder }