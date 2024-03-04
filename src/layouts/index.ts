import { git_check, git_clone } from './git';
import { curl_download } from './filesystem';
import { exec } from 'child_process';

const quick_install = async (name: string, url: string): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {

        const git_installed = await git_check();

        let result: boolean = false
        if (git_installed)
            result = await git_clone(url);
        else 
            result = await curl_download(name, url);

        resolve(result);
    });
}

export { quick_install };