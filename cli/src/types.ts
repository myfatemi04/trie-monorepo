/**
 * Represents the recursive structure of the Trie.
 */
export type Trie = {
	subtries: Record<string, Trie>;
	isEndOfWord: boolean;
};
