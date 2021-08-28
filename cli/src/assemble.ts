import { Trie } from './types';

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
 * Assemble a trie from a list of words.
 * @param {string[]} depthFirstKeys Keys in the trie, in depth-first order.
 */
export default function assembleTrie(depthFirstKeys: string[]): Trie {
	const trie = { subtries: {}, isEndOfWord: false };
	for (const key of depthFirstKeys) {
		insert(key, trie);
	}
	return trie;
}
