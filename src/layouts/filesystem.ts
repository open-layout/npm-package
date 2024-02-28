import { exec, spawn } from 'child_process';
import { cwd } from 'process';

const curl_download = (url: string, attempt: number = 0): Promise<boolean> => {
    const branches = ['master', 'main']
    if (attempt >= branches.length) return Promise.reject(new Error('Failed to download file!'));
    
    const archive_url = `${url}/archive/${branches[attempt]}.zip`;

    return new Promise((resolve, reject) => {
        const command = `curl -L -o repo.zip ${archive_url}`;
        
        const cprocess = spawn('curl', ['-L', '-o', 'olayout.zip', archive_url], { cwd: cwd() });

        cprocess.on('error', (error) => {
            console.error(`Error while downloading file: ${error.message}`);
            reject(error);
        });

        cprocess.on('close', (code) => {
            if (code === 0) {
                console.log(`File downloaded successfully: ${url}`);
                resolve(true);
            } else {
                console.error(`Download process exited with code ${code}`);
                curl_download(url, attempt + 1)
                    .then(resolve)
                    .catch(reject);
            }
        });

        /*
        exec(command, { cwd: cwd() }, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error while downloading file: ${error.message}`);
                // await curl_download(url, attemp + 1);
                return;
            }
            
            if (stderr) {
                console.error(`Download stderr: ${stderr}`);
            }

            console.log(`File downloaded successfully: ${url}`);
            resolve(true);
        });    
        */
    });
}

export { curl_download }