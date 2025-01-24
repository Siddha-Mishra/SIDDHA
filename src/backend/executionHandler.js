const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CONFIG_FILE = path.join("/Users/siddhamishra/Documents/CPH-VS-Code-Extension-LeetCode--Tinkering-Lab/src/backend", 'languagesConfig.json');
const TEST_CASES_FOLDER = '/Users/siddhamishra/Documents/CPH-VS-Code-Extension-LeetCode--Tinkering-Lab/src/test_cases';
const WORKSPACE_FOLDER = './workspace';
function loadLanguageConfig() {
    if (!fs.existsSync(CONFIG_FILE)) {
        throw new Error('Language configuration file not found.');
    }

    try {
        const configContent = fs.readFileSync(CONFIG_FILE, 'utf-8');
        return JSON.parse(configContent);
    } catch (error) {
        throw new Error(`Failed to parse config file: ${error.message}`);
    }
}


function readTestCases() {
    if (!fs.existsSync(TEST_CASES_FOLDER)) {
        throw new Error('Test cases folder not found.');
    }

    const testCases = [];
    fs.readdirSync(TEST_CASES_FOLDER).forEach((folder) => {
        const inputPath = path.join(TEST_CASES_FOLDER, folder, 'input.txt');
        const outputPath = path.join(TEST_CASES_FOLDER, folder, 'output.txt');
        if (fs.existsSync(inputPath) && fs.existsSync(outputPath)) {
            testCases.push({
                input: fs.readFileSync(inputPath, 'utf-8'),
                output: fs.readFileSync(outputPath, 'utf-8').trim(),
            });
        }
    });

    return testCases;
}

function executeCommand(command, args, input='') {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, { shell: true });
        let stdout = '';
        let stderr = '';

        // Capture standard output
        process.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        // Capture standard error
        process.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Handle process close
        process.on('close', (code) => {
            if (code !== 0) {
                reject(stderr || `Process exited with code ${code}`);
            } else {
                resolve(stdout.trim());
            }
        });

        // Provide input to the process if required
        if (input) {
            process.stdin.write(input);
            process.stdin.end();
            
        }
    });
    
}

async function executeTestCases(language, codeFile) {
    
    const config = loadLanguageConfig();
    if (!config.languages) {
        throw new Error("The 'languages' key is missing in the configuration file.");
    }
    console.log("Available languages:", Object.keys(config.languages));

    const langConfig = config.languages[language];


    if (!langConfig) throw new Error(`Unsupported language: ${language}`);

    const testCases = readTestCases();
    const results = [];

    for (const [index, testCase] of testCases.entries()) {
        let command, args;
        console.log('Loaded language configuration:', langConfig);

        if (!langConfig.compile && !langConfig.run) {
            console.error(`No compile or run configuration found for the language.`);
        }

        if (langConfig.compile) {

            const outputFile = codeFile.replace(/\.[^.]+$/, '');
            const compileCommand = langConfig.compile
  .replace('./solution.cpp', codeFile)
  .replace('./solution.out', outputFile);

  console.log('Compile Command:', langConfig.compile);
  console.log('Command After Replacement:', compileCommand);
  try {
    await executeCommand(compileCommand);
    console.log('Compilation successful');
  } catch (error) {
    console.error('Error:', error);
  }
  
            await executeCommand(langConfig.compile.replace('./solution.cpp', codeFile).replace('./solution.out', outputFile));

            command = langConfig.run.replace('{./solution.out}', outputFile);

        } else {
            command = langConfig.run.replace('./solution.cpp', codeFile);
        }
        args = args || [];
        
        console.log('Command:', command);
        console.log('Arguments:', args);
        console.log('Test Case Input:', testCase.input);
        let actualOutput;
        async function runTestCase() {
            try {
              actualOutput = await executeCommand(command, args, testCase.input);
              console.log('Actual Output:', actualOutput);
            } catch (error) {
              console.error('Error:', error);
              actualOutput = '';
            }
          }
        await runTestCase();
            
        
        results.push({
            testCase: index + 1,
            input: testCase.input,
            expected: testCase.output,
            actual: actualOutput,
            pass: actualOutput === testCase.output,
        });
        
    }
    
    return results;
}

module.exports = { executeTestCases };
