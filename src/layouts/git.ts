import { exec } from 'child_process';
import { cwd } from 'process';

const git_check = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        exec('git --version', (error, stdout, stderr) => {
            resolve(error ? false : true);
        });
    });
};

const git_clone = (url: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const command = `git clone ${url}`; 
        exec(command, { cwd: cwd() }, (error, stdout, stderr) => {
            if (error) 
                return resolve(false);
            
            /*
                if (stderr) {
                    // console.error(`Git clone stderr: ${stderr}`);
                    // reject(new Error(stderr));
                    return;
                }

                // console.log(`Repository cloned successfully: ${url}`);
            */

            resolve(true);
        });
    });
}

export { git_check, git_clone };