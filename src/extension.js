const vscode = require('vscode');
const { showTestCaseManager } = require('./gui/testCaseManager');
const { showResults } = require('./gui/resultsView');

function activate(context) {
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.manageTestCases', showTestCaseManager),
        vscode.commands.registerCommand('extension.showResults', () => {
            showResults(['Pass', 'Fail', 'Pass']);
        })
    );
}

module.exports = { activate };

