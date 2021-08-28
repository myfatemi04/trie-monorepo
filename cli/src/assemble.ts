import { Trie } from './types';

/**
 * Helper method for inserting a key into a trie.
 *
 * If the key is empty, it is assumed to be the end of
 * a key, and the trie is marked as the end of a word.
 *
 * If the key is not empty, then the subtrie responsible
 * for keys beginning with the first character of the key
 * is created if it does not already exist, and the rest of
 * the key is inserted into that subtrie.
 *
 * @param key The key to insert into the trie
 * @param trie The trie to insert the key into
 * @returns void
 */
function insert(key: string, trie: Trie) {
	if (key.length === 0) {
		trie.isEndOfWord = true;
		return;
	}
	const firstChar = key[0];
	if (!trie.subtries[firstChar]) {
		trie.subtries[firstChar] = {
			subtries: {},
			isEndOfWord: false,
		};
	}
	insert(key.slice(1), trie.subtries[firstChar]);
}

/**
 * Given a list of keys, inserts each key into an empty trie.
 * @param {string[]} depthFirstKeys Keys in the trie, in depth-first order.
 */
export default function assembleTrie(depthFirstKeys: string[]): Trie {
	const trie = {
		subtries: {},
		isEndOfWord: false,
	};
	for (const key of depthFirstKeys) {
		insert(key, trie);
	}
	return trie;
}
