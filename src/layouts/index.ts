import { git_check, git_clone } from './git';
import { curl_download } from './filesystem';
import { exec } from 'child_process';

const quick_install = async (name: string, url: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {

        const git_installed = await git_check();

        let result: boolean = false
        if (git_installed)
            result = await git_clone(url);
        else
            result = await curl_download(url);

        if (result) {
            console.log('Layout installed successfully');

            

            resolve();
        }

        /*
            const command = `curl -o ${dest} ${url}`;
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error while downloading file: ${error.message}`);
                    reject(error);
                    return;
                }
                
                if (stderr) {
                    console.error(`Download stderr: ${stderr}`);
                    reject(new Error(stderr));
                    return;
                }

                console.log(`File downloaded successfully: ${url}`);
                resolve();
            });
        */
    });
}

export { quick_install };