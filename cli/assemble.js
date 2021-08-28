/**
 * Display a trie.
 * Example trie containing "bar" and "baz":
 * b
 *  ba
 *   bar
 *   baz
 * @param {string[]} depthFirstKeys Keys in the trie, in depth-first order.
 * @return {{subtries: {[key: string]: typeof trie}, isEndOfWord: boolean}}
 */
module.exports = function assembleTrie(depthFirstKeys) {
	const trie = { subtries: {}, isEndOfWord: false };
	function insert(key, trie) {
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
	for (const key of depthFirstKeys) {
		insert(key, trie);
	}
	return trie;
};
