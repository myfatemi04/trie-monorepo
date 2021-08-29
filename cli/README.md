# Trie Command Line Interface

Update a global Trie from the command line. The possibilities are endless!

## Commands

- `trie-cli insert <key>`: inserts <key>
- `trie-cli delete <key>`: deletes <key>
- `trie-cli exists <key>`: checks if <key> exists
- `trie-cli complete <key>`: returns all keys that start with <key>
- `trie-cli display`: returns all keys in the trie
- `trie-cli reset`: resets the trie
- `trie-cli test <test filename>`: tests the trie server. More information below.
- `trie-cli xmas`: xmas trie

Example:

Input:

```
trie-cli insert test
trie-cli insert test123
trie-cli insert test456
trie-cli display
```

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

How do I install this?

### `npm install trie-cli-myfatemi04`

This is hosted in the NPM registry under `trie-cli-myfatemi04`.

After installing, the CLI is accessible with the command `trie-cli`.

## Testing

How do I know if the Trie works?

### `trie-cli test tests.txt`

This code allows you to input a file for testing purposes.

Each test case is split by a blank line.
The first line is the command to be executed, and
the second line is the optional condition to check
for.

Conditions can be `eq <JSON value>` or `neq <JSON value>`.
For arrays, `eq` checks that the expected and resulting
arrays have the same size and that all values in the expected
array are present in the resulting array. `neq` is not supported
for arrays.

Example run-through of a test:

tests.txt

```
reset

insert hello
EQ true

insert hey

insert hellloo

display

complete hel
EQ ["hello", "hey"]

```

Run `trie-cli test tests.txt`

Output:

```
<root> ▾
 h ▾
  he ▾
   hel ▾
    hell ▾
     helll ▾
      helllo ▾
       hellloo
     hello
   hey
Test 1 / 2 => OK
Test 2 / 2 => Expected hey in results, not found
Result: 1 / 2
Non-test commands: 3
```
