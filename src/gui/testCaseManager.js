const vscode = require('vscode');

function showTestCaseManager() {
    const panel = vscode.window.createWebviewPanel(
        'testCaseManager',
        'Test Case Manager',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <body>
            <h1>Test Case Manager</h1>
            <button onclick="addTestCase()">Add Test Case</button>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Input</th>
                        <th>Output</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="testCaseTable"></tbody>
            </table>
            <script>
                function addTestCase() {
                    const table = document.getElementById('testCaseTable');
                    const row = table.insertRow();
                    row.innerHTML = '<td>#</td><td><textarea></textarea></td><td><textarea></textarea></td><td><button onclick="deleteRow(this)">Delete</button></td>';
                }

                function deleteRow(button) {
                    const row = button.parentElement.parentElement;
                    row.remove();
                }
            </script>
        </body>
        </html>
    `;
}

module.exports = { showTestCaseManager };
