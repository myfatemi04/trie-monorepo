# Global Trie server

Michael Fatemi

This code allows people to host a global set of keys as a Trie data structure.
The Trie can be searched for keys beginning with a certain prefix.

It includes a minimal yet powerful testing framework and an intuitive, colorful CLI.

## Hosting

How is the Trie hosted?

The Trie server is written in Go. It is hosted as a service on an EC2 machine on Amazon Web Services. I put it in a security group with public HTTP access and SSH access from my personal computer.

I wanted something minimal compared to Docker, so I set up the server manually with Linux services.

I had no idea how to do this, so I did some digging and found [this article](https://www.shubhamdipt.com/blog/how-to-create-a-systemd-service-in-linux/). It took some debugging, but I was finally able to get a service running.

## CLI <--> Server

How does the CLI interact with the server?

A client can either connect to the server via Websocket at `/ws` to send multiple messages quickly, or apply
single commands via HTTP POST requests at `/http`. The CLI uses the `/http` route.

Because the server is written in Go, I made the commands easy to parse for a low-level language.

Syntax: \[Command number]\[Optional string argument]

Command numbers:

```
0: insert: Insert a key into the Trie
1: delete: Delete a key from the Trie
2: exists: Check if a key exists in the Trie
3: complete: Get all keys that start with a prefix
4: keys: Get all keys in the Trie
5: reset: Reset the trie
```

For example, if you wanted to send a request to insert `foo` into the Trie,
the body would be `0foo`. If you wanted to list all the keys in the tree,
you would just send `4`. You can also run operations with keys being empty strings,
and the keys are limited in length to 256 characters.

When the server sends the response, the response body will either begin with `s` or `e`.
`s` indicates a successful response, and `e` indicates and errored response.

For a "success" response, the response body will be `s` and then a JSON string containing either a string or list of strings.

For an "error" response, the response body will be `e` with the error message immediately following.

## CLI Usage

How do I use the CLI?

For more information about how to use the CLI, check out the `README.md` in the `cli/` folder.

## Server

How does the server store the Trie?

### Data Structure

Each Trie object can act as a node in any part of the trie.
Trie objects store a map of subtries and a boolean for whether a word ends at the current Trie.

For example, a Trie containing the words "foo", "bar", "baz", and "fo" would have the following structure:

```
<root>
  - f
    - o (end of word)
      - o (end of word)
  - b
    - a
      - r (end of word)
      - z (end of word)
```

Starting from the root, we can find all keys starting with 'f' by looking at the subtrie in the map
corresponding with 'f'. If we want to find all keys with a given prefix, we can just find the subtrie
corresponding to words beginning with that prefix, and list all of its keys.

If we wanted to find all words beginning with "ba" in the tree, we start from the root,
and follow the subtries corresponding to the characters "b" and "a".

The node for words starting with "ba" in the above trie looks like this:

```
<root>
 - r (end of word)
 - z (end of word)
```

Operations such as insertion and deletion can be applied in a similar fashion.

### Thread Safety

All commands applied to the Trie are dispatched to a single object.
This object has a mutex, which ensures that no two commands are applied at the same time.
This also ensures that commands are executed in the order they arrive.

### Routing

The server exposes a `ServeMux()` method, which allows routes for the Trie server to be embedded
in any Go HTTP server. This is similar to an `express.Router()`.

The routes are `/ws` for handling websocket connections and `/http` for handling HTTP POST requests.

Request bodies should follow the format indicated above.

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
