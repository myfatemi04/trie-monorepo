# Trie Command Line Interface

Update a global Trie from the command line. The possibilities are endless!

## Commands

`trie-cli insert <key>`: inserts <key>
`trie-cli delete <key>`: deletes <key>
`trie-cli exists <key>`: checks if <key> exists
`trie-cli complete <key>`: returns all keys that start with <key>
`trie-cli display`: returns all keys in the trie

Example:

Input:
`trie-cli insert test`
`trie-cli insert test123`
`trie-cli insert test456`
`trie-cli display`

Output:

```
<root> ▾
 t ▾
  te ▾
   tes ▾
    test ▾
     test1 ▾
      test12 ▾
       test123
     test4 ▾
      test45 ▾
       test456
```

## Installation

### `npm install trie-cli-myfatemi04`

This is hosted in the NPM registry under `trie-cli-myfatemi04`.

After installing, the CLI is accessible with the command `trie-cli`.
