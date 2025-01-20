const vscode = require('vscode');

function showResults(results) {
    const panel = vscode.window.createWebviewPanel(
        'testResults',
        'Test Results',
        vscode.ViewColumn.Two,
        { enableScripts: true }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Test Results</h1>
            <ul>
                ${results.map((result, index) => `<li>Test Case ${index + 1}: ${result}</li>`).join('')}
            </ul>
        </body>
        </html>
    `;
}

module.exports = { showResults };
