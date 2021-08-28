const chalk = require('chalk');

/**
 * Display a trie.
 * Example trie containing "bar" and "baz":
 * b
 *  ba
 *   bar
 *   baz
 * @param {{subtries: {[key: string]: typeof trie}, isEndOfWord: boolean}} trie
 */
module.exports = function displayTrie(trie, preceding = '') {
	const tab = ' '.repeat(preceding.length);
	const keys = Object.keys(trie.subtries).sort();
	const suffix = keys.length > 0 ? ' ▾' : '';
	if (trie.isEndOfWord) {
		// If this trie is the end of a word, print it in green.
		console.log(tab + chalk.green(preceding || '<root>') + suffix);
	} else {
		// Otherwise, print it in yellow.
		console.log(tab + chalk.yellow(preceding || '<root>') + suffix);
	}
	// Now, iterate over the subtries.
	for (const key of keys) {
		// For each subtrie, call this function recursively.
		displayTrie(trie.subtries[key], preceding + key);
	}
};
