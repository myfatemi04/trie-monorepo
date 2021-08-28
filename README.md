# Global Trie server

Michael Fatemi

This code allows people to host a global set of keys as a Trie data structure.
The Trie can be searched for keys beginning with a certain prefix.

## Hosting

The Trie server is written in Go. It is hosted on an EC2 machine on Amazon Web Services.

## CLI <--> Server

How does the CLI interact with the server?

A client can either connect to the server via Websocket at `/ws` to send multiple messages quickly, or apply
single commands via HTTP POST requests at `/http`. The CLI uses the `/http` route.

Because the server is written in Go, I made the commands easy to parse for a low-level language.

Syntax: \[Command number]\[Optional string argument]

Command numbers:
0: insert: Insert a key into the Trie
1: delete: Delete a key from the Trie
2: exists: Check if a key exists in the Trie
3: complete: Get all keys that start with a prefix
4: keys: Get all keys in the Trie

For example, if you wanted to send a request to insert `foo` into the Trie,
the body would be `0foo`. If you wanted to list all the keys in the tree,
you would just send `4`. You can also run operations with keys being empty strings,
and the keys are limited in length to 256 characters.

When the server sends the response, the response body will either begin with `s` or `e`.
`s` indicates a successful response, and `e` indicates and errored response.

For a "success" response, the response body will be `s` and then a JSON string containing either a string or list of strings.

For an "error" response, the response body will be `e` with the error message immediately following.

## CLI Usage

For more information about how to use the CLI, check out the `README.md` in the `cli/` folder.
