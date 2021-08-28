/**
 * These functions generate messages to send to the server.
 *
 * Protocol for Trie
 *
 * [Command number][Key]
 *
 * Commands:
 * 	0: insert: Insert a key into the Trie
 * 	1: delete: Delete a key from the Trie
 * 	2: exists: Check if a key exists in the Trie
 * 	3: complete: Get all keys that start with a prefix
 * 	4: keys: Get all keys in the Trie
 */

import ENDPOINT from './endpoint';

const CMD_INSERT = 0;
const CMD_DELETE = 1;
const CMD_EXISTS = 2;
const CMD_COMPLETE = 3;
const CMD_KEYS = 4;
const CMD_RESET = 5;

/**
 * @param key The key to insert
 * @returns The request body for the insert command
 */
function insert(key: string) {
	return `${CMD_INSERT}${key}`;
}

/**
 * @param key The key to delete
 * @returns The request body for the delete command
 */
function delete_(key: string) {
	return `${CMD_DELETE}${key}`;
}

/**
 * @param key The key to check
 * @returns The request body for the exists command
 */
function exists(key: string) {
	return `${CMD_EXISTS}${key}`;
}

/**
 * @param key The prefix to complete
 * @returns The request body for the complete command
 */
function complete(key: string) {
	return `${CMD_COMPLETE}${key}`;
}

/**
 * @returns The request body for the keys command
 */
function keys() {
	return `${CMD_KEYS}`;
}

/**
 * @returns The request body for the reset command
 */
function reset() {
	return `${CMD_RESET}`;
}

/**
 * Sends a request to the server.
 *
 * If the request fails, an error is thrown with the error message.
 * Otherwise, the response is returned.
 *
 * @param body The body of the request.
 * @returns A successful response body.
 */
export async function sendRequest(body: string) {
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

export { insert, delete_, exists, complete, keys, reset };
