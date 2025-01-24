const axios = require('axios');
const fs = require('fs');
const path = require('path');
const vscode=require('vscode')

const OUTPUT_FOLDER=path.resolve(__dirname, '../test_cases');
const graphqlEndpoint = "https://leetcode.com/graphql";

/**
 * Ensure the output folder exists or create it.
 */
function ensureOutputFolderExists() {
    if (!fs.existsSync(OUTPUT_FOLDER)) {
        console.log('Creating output folder at:'+ OUTPUT_FOLDER);
        fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
    } else {
        console.log('Output folder already exists at: '+OUTPUT_FOLDER);
    }
}

/**
 * Save test cases to files in a structured format.
 * @param {Array<{input: string, output: string}>} testCases - Test cases to save.
 */
function saveTestCases(testCases) {
    ensureOutputFolderExists();

    testCases.forEach((testCase, index) => {
        const caseFolder = path.join(OUTPUT_FOLDER, `case_${index + 1}`);
        if (!fs.existsSync(caseFolder)) {
            fs.mkdirSync(caseFolder);
        }
        fs.writeFileSync(path.join(caseFolder, 'input.txt'), testCase.input);
        fs.writeFileSync(path.join(caseFolder, 'output.txt'), testCase.output);
    });

    console.log('Test cases saved to folder: '+OUTPUT_FOLDER);
    vscode
}

/**
 * Extract test cases from the problem's content HTML.
 * @param {string} content - HTML content from LeetCode.
 * @returns {Array<{input: string, output: string}>} - Extracted test cases.
 */
function extractTestCases(content) {
    console.log('Extracting test cases...');
    vscode.window.showInformationMessage('Extracting test cases...')
    const testCases = [];

    // Updated regex to consider <strong> tags inside <pre>
    const inputOutputRegex = /<pre>\s*<strong>Input:<\/strong>\s*(.*?)\s*<strong>Output:<\/strong>\s*(.*?)\s*<\/pre>/g;

    console.log('Using regex:', inputOutputRegex);

    let match;
    let attempt = 0; // Debug: Counter for matches

    // Iterate over matches
    while ((match = inputOutputRegex.exec(content)) !== null) {
        attempt++;
        console.log(`Match ${attempt}:`, match); // Debug: Log the match groups

        testCases.push({
            input: match[1].trim(),  // Extract and trim Input
            output: match[2].trim(), // Extract and trim Output
        });
    }

    // Debug: Log extracted test cases or warn if none were found
    if (testCases.length === 0) {
        console.warn('No structured test cases found.');
        console.log('Ensure the content has <pre> tags containing <strong>Input:</strong> and <strong>Output:</strong>.');
    } else {
        console.log(`Extracted ${testCases.length} test cases.`);
        console.log('Extracted test cases:', JSON.stringify(testCases, null, 2));
        vscode.window.showInformationMessage(`Extracted ${testCases.length} test cases`);
    }

    return testCases;
}


/**
 * Fetch test cases from a LeetCode problem URL using GraphQL API.
 * @param {string} url - The LeetCode problem URL.
 */
async function fetchTestCasesFromURL(url) {
    const query = `
        query getQuestionDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                content
            }
        }
    `;

    const problemSlug = extractProblemName(url);
    console.log(problemSlug);
    if (!problemSlug) {
        console.error('Invalid URL format.');
        return;
    }

    try {
        console.log('hi'+problemSlug);
        console.log('Fetching test cases for '+problemSlug);

        const response = await axios.post(graphqlEndpoint, {
            query,
            variables: { titleSlug: problemSlug },
        });

        const content = response.data.data.question.content;
        console.log(content);
        if (!content) {
            console.error('Failed to fetch problem content.');
            return;
        }

        // Extract and save test cases
        const testCases = extractTestCases(content);
        console.log(testCases)
        if (testCases.length > 0) {
            saveTestCases(testCases);
        } else {
            console.log('No test cases to save.');
        }
    } catch (error) {
        console.error('Error fetching test cases:'+error.message);
    }
}
/*
 * Extract problem name (slug) from the LeetCode URL.
 * @param {string} url - The LeetCode problem URL.
 * @returns {string} - Extracted problem slug.
 */
function extractProblemName(url) {
    const match = url.match(/https:\/\/leetcode\.com\/problems\/([^\/]+)\//);
    if (match && match[1]) {
        return match[1];
    }
    throw new Error('Invalid LeetCode URL format.');
}

module.exports = { fetchTestCasesFromURL };