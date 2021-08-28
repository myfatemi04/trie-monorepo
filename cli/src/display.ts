import * as chalk from 'chalk';
import { Trie } from './types';

/**
 * Display a trie.
 *
 * This displays the key leading to the trie along with all subtries.
 * If this trie marks the end of the word, it is highlighted in green.
 * Otherwise, it is highlighted in yellow.
 *
 * If the trie has subtries, a down arrow is displayed next to the key.
 *
 * Example trie containing "bar" and "baz":
 * ```
 * b ▾
 *  ba ▾
 *   bar (green)
 *   baz (green)
 * ```
 * @param {{subtries: {[key: string]: typeof trie}, isEndOfWord: boolean}} trie
 */
export default function displayTrie(trie: Trie, preceding = '') {
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
}
