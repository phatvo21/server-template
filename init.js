/* eslint-disable no-console */
import fs from 'node:fs';
import readline from 'node:readline';
import process from 'node:process';


console.log(`\x1b[32m
############################
# Initializing new service #
############################
\x1b[0m`);

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const files = ['package.json', 'package-lock.json', 'jest.config.js', 'tsconfig.json', './test/jest-e2e.json'];

reader.question('Project name (ex: user-service): ', (name) => {
    reader.question('Description: ', (description) => {
        reader.question('Application config path (ex: user): ', (appName) => {
            // Replace name and description in each of the config files
            for (const file of files) {
                const fileData = fs.readFileSync(file, 'utf-8');
                const replacedFileData = fileData
                    .replace(/~~name~~/g, name)
                    .replace(/~~description~~/g, description)
                    .replace(/~~appName~~/g, appName);
                fs.writeFileSync(file, replacedFileData, 'utf-8');
            }
            // Write README
            fs.writeFileSync('README.md', `# ${name}\n\n${description}`, 'utf-8');
            // Delete this file
            fs.unlinkSync('init.js');
            // Done
            console.log(`\x1b[33m
    |\\/\\/\\/\\/\\/|
    |          |
    |          |
    |          |
    |    __  __|
    |   /  \\/  \\
    |  (o   )o  )
   /c   \\__/ --.
   \\_   ,     -'
    |  '\\_______)\x1b[0m     Successfully initialized \x1b[32m${name}\x1b[33m
    |      _)
    |     |\x1b[0m\x1b[31m
   /\`-----'\\
  /         \\
\x1b[0m`);
            process.exit(0);
        });
    });
});