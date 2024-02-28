import { exec } from 'child_process';
import { cwd } from 'process';

const curl_download = (url: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const command = `curl -o . ${url}`;
        exec(command, { cwd: cwd() }, (error, stdout, stderr) => {
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
            resolve(true);
        });    
    });
}

export { curl_download }