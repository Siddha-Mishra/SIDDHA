const vscode = require('vscode');
const path = require('path');
const { fetchTestCasesFromURL } = require('./backend/testCaseHandler');
const { executeTestCases } = require('./backend/executionHandler');

function activate(context) {
    // Register the command for fetching and running test cases
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.fetchTestCases', async () => {
            const url = await vscode.window.showInputBox({
                prompt: 'Enter LeetCode Problem URL',
                placeHolder: 'https://leetcode.com/problems/example-problem',
            });

            if (!url) {
                vscode.window.showErrorMessage('No URL provided.');
                return;
            }

            try {
                // Fetch test cases
                await fetchTestCasesFromURL(url);
                vscode.window.showInformationMessage('Test cases fetched successfully!');

                // Ask for language
                const language = await vscode.window.showQuickPick(['python', 'cpp'], {
                    placeHolder: 'Select a language to execute',
                });

                if (!language) {
                    vscode.window.showErrorMessage('No language selected.');
                    return;
                }

                const codeFile = path.join('./workspace', `solution.${language}`);
                const results = await executeTestCases(language, codeFile);

                results.forEach((result) => {
                    vscode.window.showInformationMessage(
                        `Test Case ${result.testCase}: ${result.pass ? 'PASS' : 'FAIL'}`
                    );
                });
            } catch (error) {
                vscode.window.showErrorMessage(`Error: ${error.message}`);
            }
        })
    );
}

function deactivate() {}

module.exports = { activate, deactivate };
