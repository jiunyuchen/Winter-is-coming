README
===============
This is an open-ended single-page JavaScript applicaton that would be a community page to a number of towns in the Fife area, with a message board, relevant town informaton such as weather and transport, and other features.

This applicaton uses Node.js with a number of diferent packages while the user interface is built
using VueJS framework

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
