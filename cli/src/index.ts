#!/usr/bin/env node

import { insert, delete_, exists, complete, keys, reset } from './protocol';
import display from './display';
import fetch from 'node-fetch';
import * as chalk from 'chalk';
import assemble from './assemble';

// args are:
// [0] where node.exe is located
// [1] path to this file
// [2] command to execute (insert, delete, exists, complete, keys)
// [3] key (does not exist for `keys` command)

const [_node, _path, command, ...rest] = process.argv;
const key = rest.length > 0 ? rest.join(' ') : undefined;

const ENDPOINT = 'http://ec2-54-160-222-75.compute-1.amazonaws.com:8080/http';

const triecli = chalk.cyanBright`trie-cli`;
const param = chalk.greenBright;

// note: use two spaces instead of a tab
const helptext = `\
${chalk.yellow`trie-cli 0.0.1`}

Usage:
  ${triecli} ${param`<command>`} ${param`[key]`}
Commands:
  ${triecli} ${param`insert`} ${param`<key>`}: inserts ${param`<key>`}
  ${triecli} ${param`delete`} ${param`<key>`}: deletes ${param`<key>`}
  ${triecli} ${param`exists`} ${param`<key>`}: checks if ${param`<key>`} exists
  ${triecli} ${param`complete`} ${param`<key>`}: returns all keys that start with ${param`<key>`}
  ${triecli} ${param`display`}: returns all keys in the trie
  ${triecli} ${param`reset`}: resets the trie

The key can be up to 256 characters.
`;

/**
 * Sends a request to the server.
 *
 * If the request fails, an error is thrown with the error message.
 * Otherwise, the response is returned.
 *
 * @param body The body of the request.
 * @returns A successful response body.
 */
async function sendRequest(body: string) {
	const response = await fetch(ENDPOINT, {
		method: 'POST',
		body,
	});
	const text = await response.text();
	if (text.startsWith('s')) {
		return JSON.parse(text.slice(1));
	} else {
		throw new Error(text.slice(1));
	}
}

/**
 * Asserts that a key is defined. Otherwise, displays a message.
 * @param key The value to check if defined.
 * @returns True if the key is defined, false otherwise.
 */
function assertKeyDefined(key?: string) {
	if (key === undefined) {
		console.log(chalk.red`This command requires a key.`);
		console.log(helptext);
		return false;
	}
	return true;
}

/**
 * Main driver for the CLI.
 *
 * Runs a command (insert, delete, exists, complete, display) and displays
 * a help message if the command is not found.
 */
async function main(
	command:
		| 'insert'
		| 'delete'
		| 'exists'
		| 'complete'
		| 'display'
		| 'reset'
		| string,
	key?: string
) {
	switch (command) {
		case 'insert':
			if (assertKeyDefined(key)) {
				const result = await sendRequest(insert(key));
				if (result) {
					console.log('Inserted', chalk.green`${key}`);
				} else {
					console.log('Key', chalk.green`${key}`, 'already exists.');
				}
			}
			break;
		case 'delete':
			if (assertKeyDefined(key)) {
				const result = await sendRequest(delete_(key));
				if (result) {
					console.log('Deleted', chalk.green`${key}`);
				} else {
					console.log('Key', chalk.green`${key}`, 'did not not exist.');
				}
			}
			break;
		case 'exists':
			if (assertKeyDefined(key)) {
				const result = await sendRequest(exists(key));
				if (result) {
					console.log(chalk.green`${key}`, 'exists.');
				} else {
					console.log(chalk.green`${key}`, 'does not exist.');
				}
			}
			break;
		case 'complete':
			if (assertKeyDefined(key)) {
				const result: string[] = await sendRequest(complete(key));
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
			break;
		case 'display':
			const depthFirstKeys: string[] = await sendRequest(keys());
			if (depthFirstKeys.length == 0) {
				console.log(chalk.yellow`Trie is empty.`);
			}
			const trie = assemble(depthFirstKeys);
			display(trie);
			break;
		case 'reset':
			const result = await sendRequest(reset());
			if (result) {
				console.log(chalk.yellow`Trie has been reset.`);
			} else {
				console.log(chalk.red`Trie could not be reset.`);
			}
			break;
		default:
			console.log(helptext);
			break;
	}
}

main(command, key).catch((error: Error) => {
	console.error('There was an error running the command.');
	console.error('Server message:', chalk.redBright(error.message));
	console.error('Command:', chalk.greenBright(command));
});
