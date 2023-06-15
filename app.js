import { spawn } from 'child_process';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const fsPromises = fs.promises

const statistics = {
    start: getTime(),
    duration: null,
    success: true,
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
        delete statistics.commandSuccess
    });



    childProcess.on('error', (error) => {
        statistics.error = error.message
        statistics.commandSuccess = false
        statistics.success = false
        console.error('Child: Command execution failed');
    });


    childProcess.on('close', () => {
        console.log("Child process closed");
        getDuration()

        return new Promise((resolve, reject) => {

            writeFile(path.join('./logs', fileName), JSON.stringify(statistics))

                .then(() => {
                    resolve("Everything was ok")
                })
                .catch(err => {
                    reject(err)
                })
        })
    })
}

function getTime() {
    const start = Date.now()
    return start
}

function getDuration() {
    statistics.duration = getTime() - statistics.start
}

await getStatistics('ls', ["-lh"])