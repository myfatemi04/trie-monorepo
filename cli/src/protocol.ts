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

const CMD_INSERT = 0;
const CMD_DELETE = 1;
const CMD_EXISTS = 2;
const CMD_COMPLETE = 3;
const CMD_KEYS = 4;

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

export { insert, delete_, exists, complete, keys };
