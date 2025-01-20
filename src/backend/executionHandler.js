const { exec } = require('child_process');

/**
 * Executes a shell command with provided input and returns the output.
 * @param {string} command - The shell command to execute.
 * @param {string} input - The input to pass to the command.
 * @param {Object} options - Options for execution.
 * @param {number} [options.timeout=5000] - Timeout for execution in milliseconds.
 * @returns {Promise<string>} - Resolves with the command's output, or rejects on error.
 */
async function executeCommand(command, input, options = {}) {
    const { timeout = 5000 } = options;

    return new Promise((resolve, reject) => {
        const process = exec(command, { timeout }, (error, stdout, stderr) => {
            if (error) {
                if (error.signal === 'SIGTERM') {
                    reject(new Error(`Execution timed out after ${timeout}ms.`));
                } else {
                    reject(new Error(stderr || error.message));
                }
                return;
            }
            resolve(stdout.trim());
        });

        if (process.stdin) {
            process.stdin.write(input);
            process.stdin.end();
        }
    });
}

module.exports = { executeCommand };
