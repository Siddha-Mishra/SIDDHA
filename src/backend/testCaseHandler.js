const fs = require('fs');
const path = require('path');

/**
 * Save test cases to the test folder in a structured format.
 * @param {Array<{input: string, output: string}>} testCases
 * @param {string} folder
 */
function saveTestCases(testCases, folder) {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }

    testCases.forEach((testCase, index) => {
        const caseFolder = path.join(folder, `case_${index + 1}`);
        if (!fs.existsSync(caseFolder)) {
            fs.mkdirSync(caseFolder);
        }

        fs.writeFileSync(path.join(caseFolder, 'input.txt'), testCase.input);
        fs.writeFileSync(path.join(caseFolder, 'output.txt'), testCase.output);
    });
}

module.exports = { saveTestCases };
