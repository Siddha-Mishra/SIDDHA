const vscode = require('vscode');
const { fetchTestCasesFromURL } = require('./backend/testCaseHandler');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.fetchTestCases', async () => {
            const url = await vscode.window.showInputBox({
                prompt: 'Enter LeetCode Problem URL',
                placeHolder: 'https://leetcode.com/problems/example-problem',
            });

            if (url) {
                vscode.window.showInformationMessage(`Fetching test cases from ${url}...`);
                try {
                    await fetchTestCasesFromURL(url);
                    vscode.window.showInformationMessage('Test cases fetched successfully!');
                } catch (error) {
                    vscode.window.showErrorMessage(`Failed to fetch test cases: ${error.message}`);
                }
            } else {
                vscode.window.showErrorMessage('No URL provided.');
            }
        })
    );
}

module.exports = { activate };
