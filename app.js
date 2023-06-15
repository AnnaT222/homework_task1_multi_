import { spawn } from 'child_process';
import fs from 'fs';

const fsPromises = fs.promises

const statistics = {
    start: getTime(),
    duration: null,
    success: false,
    commandSuccess: true,
    error: null
}

fsPromises.mkdir('./logs').then(() => {
    console.log('Directory created successfully');
}).catch(() => {
    console.log('Already created');
})
async function getStatistics(command, args, timeout) {
    const fileName = `${statistics.start}_${command}.json`

    const childProcess = spawn(command, args);
    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });


    childProcess.on('error', (data) => {
        console.log(`error: ${data}`);
    });


    childProcess.on('error', (error) => {
        statistics.error = error.message
        statistics.commandSuccess = false
        console.error('Child: Command execution failed');
    });

    childProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (statistics.commandSuccess) {
            getDuration()
            statistics.success = true
            delete statistics.commandSuccess
        } else {
            getDuration()
        }
        fs.createWriteStream('./logs/' + `${fileName}`).write(JSON.stringify(statistics));
    });
}
function getTime() {
    const start = Date.now()
    return start
}
function getDuration() {
    statistics.duration = getTime() - statistics.start
}
await getStatistics('ls', ["-lh"])