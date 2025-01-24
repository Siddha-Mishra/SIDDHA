CPH VS Code Extension (Leetcode)

Overview

The CPH extension code written by me using Javascript and json is an application which enables automated fetching of 
problem test cases and running code against them, while excluding the code submission feature.

Features:

1. Problem URL Fetching:

   Enables users to fetch test cases directly from LeetCode problem URLs and paste then in the command pallete in vs code.
   Using graph ql, my program reads test cases from the leetcode platform.

2. Test Case Storage:

   The program after reading from the leetcode platform, stores the data in a file as input.txt and output.txt for each
   test case.

3. Code Execution:

   The code creates solution.cpp and solution.out / solution.py where the user's solution is stored and executed using the inbuilt
   compilers of vs code.

4. Multi-Language Support:

   Provided execution support for commonly used languages, such as:
  - Python
  - C++
  Each language has customizable compile and run commands in languageConfig.json file.


Technologies Used

1. Programming Language: Python, Javascript

Installation

1. Clone the repository:

   git clone https://github.com/Siddha-Mishra/SIDDHA.git
