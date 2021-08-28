import * as fs from 'fs/promises';
import { run } from '.';
import * as chalk from 'chalk';
import displayTrie from './display';
import { keys as keys_ } from './ops';
import assembleTrie from './assemble';

function splitAtFirstSpace(text: string) {
	const idx = text.indexOf(' ');
	if (idx === -1) {
		return [text, undefined];
	} else {
		return [text.substring(0, idx), text.substring(idx + 1)];
	}
}

export default async function test(filename: string) {
	const content = await fs.readFile(filename, { encoding: 'utf-8' });
	const tests = content.split(/\n\n|\n\r\n\r|\r\n\r\n|\r\r/);
	const results = [];
	let passed = 0;
	let nontestcommands = 0;

	function markOK() {
		results.push(chalk.green('OK'));
		passed++;
	}

	for (const test of tests) {
		try {
			const [input, condition, ...others] = test.split(/[\n\r]+/);
			if (!input) {
				continue;
			}
			if (others.join('').trim()) {
				console.warn('Warning: Extra lines detected in test, ignoring');
			}
			const [command, arg] = splitAtFirstSpace(input);
			if (command === 'display') {
				const keys = await keys_();
				displayTrie(assembleTrie(keys));
				continue;
			}

			const result = await run(command, arg, true);
			if (condition !== undefined) {
				// Condition: EQ <string> or NEQ <string>
				const [comparison, expected_] = splitAtFirstSpace(condition);
				let expected: any;
				try {
					expected = JSON.parse(expected_);
				} catch (e) {
					throw new Error(
						'Invalid expected value. Values must be valid JSON. Received: ' +
							expected_
					);
				}
				switch (comparison.toUpperCase()) {
					case 'EQ':
						// If both are arrays, just check that they have the same elements
						if (Array.isArray(result)) {
							if (Array.isArray(expected)) {
								if (result.length !== expected.length) {
									results.push(
										`Expected ${chalk.green(
											expected.length
										)} results, got ${chalk.green(result.length)}`
									);
								} else {
									const resultArray = new Set(result);
									let valid = true;
									for (let expectedKey of expected) {
										if (!resultArray.has(expectedKey)) {
											results.push(
												`Expected ${chalk.green(
													expectedKey
												)} in results, not found`
											);
											valid = false;
											break;
										}
									}
									if (valid) {
										markOK();
									}
								}
							} else {
								throw new Error('Expected value must be an array');
							}
						} else if (result !== expected) {
							results.push(
								`Expected ${chalk.green(expected)} but got ${chalk.green(
									result
								)}`
							);
						} else {
							markOK();
						}
						break;
					case 'NEQ':
						if (Array.isArray(result) || Array.isArray(expected)) {
							throw new Error('NEQ comparison is not supported for arrays');
						}
						if (result === expected) {
							results.push(
								`Expected ${chalk.green(expected)} but got ${chalk.green(
									result
								)}`
							);
						} else {
							markOK();
						}
						break;
					default:
						throw new Error(
							`Invalid test case: invalid comparison ${comparison}`
						);
				}
			} else {
				nontestcommands++;
			}
		} catch (e) {
			results.push(chalk.red(`Error during test: ${e.message}`));
			console.log(e);
		}
	}
	results.forEach((result, index) =>
		console.log(
			`Test ${chalk.yellow(`${index + 1} / ${results.length}`)} => ${result}`
		)
	);
	console.log(`Result: ${chalk.yellow(`${passed} / ${results.length}`)}`);
	console.log(`Non-test commands: ${chalk.yellow(nontestcommands)}`);
}
