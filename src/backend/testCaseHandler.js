const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

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

/**
 * Fetch test cases from a LeetCode problem URL.
 * @param {string} url - The LeetCode problem URL.
 * @returns {Promise<void>}
 */
async function fetchTestCasesFromURL(url) {
    console.log(`Fetching test cases from: ${url}`);
    
    const browser = await puppeteer.launch({ headless: true }); 
    const page = await browser.newPage(); 
    await page.goto(url, { waitUntil: 'networkidle2' }); 

    try {
        
        await page.waitForSelector('.question-content__StyledQuestionContent', { timeout: 10000 });

        const testCases = await page.evaluate(() => {
            const inputBlocks = Array.from(document.querySelectorAll('pre'));
            const inputs = [];
            const outputs = [];

            for (let i = 0; i < inputBlocks.length; i += 2) {
                inputs.push(inputBlocks[i]?.textContent.trim());
                outputs.push(inputBlocks[i + 1]?.textContent.trim());
            }

            return inputs.map((input, index) => ({
                input: input || '',
                output: outputs[index] || '',
            }));
        });

        console.log(`Fetched ${testCases.length} test cases.`);
        if (testCases.length === 0) {
            console.log('No test cases found!');
        } else {
            saveTestCases(testCases, './test_cases'); 
        }
    } catch (error) {
        console.error('Error fetching test cases:', error.message);
    } finally {
        await browser.close(); 
    }
}

module.exports = { saveTestCases, fetchTestCasesFromURL };
