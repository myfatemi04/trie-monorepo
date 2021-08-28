export type Trie = {
	subtries: Record<string, Trie>;
	isEndOfWord: boolean;
};
