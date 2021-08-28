import * as fs from 'fs/promises';
import { run } from '.';
import * as chalk from 'chalk';

export default async function test(filename: string) {
	const content = await fs.readFile(filename, { encoding: 'utf-8' });
	const tests = content.split(/[\n\r]{2,}/);
	const results = [];
	for (const test of tests) {
		try {
			const [input, condition] = test.split(/[\n\r]/);
			if (input === undefined) {
				throw new Error('Invalid test case: input command was empty');
			}
			const [command, arg] = input.split(' ', 2);
			const result = await run(command, arg, true);
			if (condition !== undefined) {
				// Condition: EQ <string> or NEQ <string>
				const [comparison, expected_] = condition.split(' ', 2);
				const expected = JSON.parse(expected_);
				switch (comparison) {
					case 'EQ':
						if (result !== expected) {
							results.push(
								`Expected ${chalk.green(expected)} but got ${chalk.green(
									result
								)}`
							);
						} else {
							results.push(`${chalk.green('OK')}`);
						}
						break;
					case 'NEQ':
						if (result === expected) {
							results.push(
								`Expected ${chalk.green(expected)} but got ${chalk.green(
									result
								)}`
							);
						} else {
							results.push(`${chalk.green('OK')}`);
						}
						break;
					default:
						throw new Error(
							`Invalid test case: invalid comparison ${comparison}`
						);
				}
			}
		} catch (e) {
			results.push(chalk.red(`Error during test: ${e.message}`));
		}
	}
}
