import { spawn } from 'child_process';
import fs from 'fs';

function getStatistics(command, args, timeout) {
    const startTime = new Date();
    const timestamp = startTime.toISOString().replace(/:/g, '-');
    spawn('mkdir', ['./logs']);
    const statistics = {
        start: timestamp,
        duration: null,
        success: false,
        commandSuccess: true,
        error: "There isn't any errors"

    }
    const childProcess = spawn(command, args);
    childProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });
    childProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
    childProcess.on('error', (error) => {
        statistics.error = error.message
        statistics.commandSuccess = false
        console.error('Child: Command execution failed');
    });
    childProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (statistics.commandSuccess) {
            delete statistics.commandSuccess
        }
        fs.createWriteStream('./logs/' + `${timestamp}.json`).write(JSON.stringify(statistics));
    });
}
getStatistics('ls', ["-lh"])