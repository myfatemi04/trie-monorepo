#!/usr/bin/env node

import * as chalk from 'chalk';
import assemble from './assemble';
import display from './display';
import { helptext } from './helptext';
import { complete, exists, insert, keys as keys_, remove, reset } from './ops';
import test from './test';

// args are:
// [0] where node.exe is located
// [1] path to this file
// [2] command to execute (insert, delete, exists, complete, keys)
// [3] key (does not exist for `keys` command)

const [_node, _path, command, ...rest] = process.argv;
const arg = rest.length > 0 ? rest.join(' ') : undefined;

const COMMANDS_REQUIRING_KEY = ['insert', 'delete', 'exists', 'complete'];

/**
 * Main driver for the CLI.
 *
 * Runs a command (insert, delete, exists, complete, display) and displays
 * a help message if the command is not found.
 */
export async function run(
	command:
		| 'insert'
		| 'delete'
		| 'exists'
		| 'complete'
		| 'display'
		| 'reset'
		| string,
	key: string | undefined,
	automated: boolean
) {
	if (COMMANDS_REQUIRING_KEY.includes(command) && key === undefined) {
		if (!automated) {
			console.log(chalk.red(`${command} requires a key.`));
			console.log(helptext);
			return;
		} else {
			throw new Error(`${command} requires a key.`);
		}
	}
	switch (command) {
		case 'insert': {
			const result = await insert(key);
			if (!automated) {
				if (result) {
					console.log('Inserted', chalk.green`${key}`);
				} else {
					console.log('Key', chalk.green`${key}`, 'already exists.');
				}
			}
			return result;
		}
		case 'delete': {
			const result = await remove(key);
			if (!automated) {
				if (result) {
					console.log('Deleted', chalk.green`${key}`);
				} else {
					console.log('Key', chalk.green`${key}`, 'did not not exist.');
				}
			}
			return result;
		}
		case 'exists': {
			const result = await exists(key);
			if (!automated) {
				if (result) {
					console.log(chalk.green`${key}`, 'exists.');
				} else {
					console.log(chalk.green`${key}`, 'does not exist.');
				}
			}
			return result;
		}
		case 'complete': {
			const result = await complete(key);
			if (!automated) {
				if (result.length == 0) {
					console.log(chalk.green`${key}`, 'is not a prefix.');
				} else {
					console.log(chalk.yellow`Suggestions`);
					result.forEach(suggestion => {
						const prefix = key;
						const rest = suggestion.slice(prefix.length);

						console.log(`${chalk.greenBright`${prefix}`}${rest}`);
					});
				}
			}
			return result;
		}
		case 'display': {
			const keys = await keys_();
			if (keys.length == 0) {
				console.log(chalk.yellow`Trie is empty.`);
			}
			const result = assemble(keys);
			if (!automated) {
				display(result);
			}
			return result;
		}
		case 'reset': {
			const result = reset();
			if (!automated)
				if (result) {
					console.log(chalk.yellow`Trie has been reset.`);
				} else {
					console.log(chalk.red`Trie could not be reset.`);
				}
			return result;
		}
		default:
			if (!automated) {
				console.log(helptext);
			} else {
				throw new Error(`Command ${command} not found.`);
			}
			break;
	}
}

if (command === 'test') {
	test(arg);
} else {
	run(command, arg, false).catch((error: Error) => {
		console.error('There was an error running the command.');
		console.error('Server message:', chalk.redBright(error.message));
		console.error('Command:', chalk.greenBright(command));
	});
}
