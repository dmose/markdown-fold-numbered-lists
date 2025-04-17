import * as path from 'path';
import Mocha from 'mocha';
import { glob } from 'glob';

async function main() {
    try {
        // Create the mocha test
        const mocha = new Mocha({
            ui: 'bdd',  // Use BDD style for describe/it
            color: true
        });

        const testsRoot = path.resolve(__dirname);

        // Find all test files
        const files = await glob('**/**.test.js', { cwd: testsRoot });

        // Add files to the test suite
        files.forEach(f => mocha.addFile(path.resolve(testsRoot, f)));

        // Run the mocha test
        return new Promise<void>((resolve, reject) => {
            mocha.run((failures: number) => {
                if (failures > 0) {
                    reject(new Error(`${failures} tests failed.`));
                } else {
                    resolve();
                }
            });
        });
    } catch (err) {
        console.error('Failed to run tests:', err);
        process.exit(1);
    }
}

main(); 