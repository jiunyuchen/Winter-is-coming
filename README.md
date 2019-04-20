README
===============
This is our online platform displaying the most up-to-date information for the St Andrews region.
It was built as part of our CS5003 'Winter is coming' project practical and in partial completion for the CS5003 module.

INSTRUCTIONS
---------------
In order to run our repository, please follow the instructions below:
1. cd to the folder where the project files are saved
2. $ npm install --save
3. $ node main

TESTING
---------------
To run Mocha/Chai tests, first ensure that no server is running on port 8080:
1. $ killall -9 node

Next, make sure dependencies are installed in the correct repository. Then run the full set of automated tests:
1. $ npm install
2. $ mocha tests

JSDoc
---------------
To generate documentation, run the following command:
1. jsdoc -r api/ static/
