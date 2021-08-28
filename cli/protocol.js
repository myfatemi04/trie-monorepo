const CMD_INSERT = 0;
const CMD_DELETE = 1;
const CMD_EXISTS = 2;
const CMD_COMPLETE = 3;
const CMD_KEYS = 4;

function insert(key) {
	return `${CMD_INSERT}${key}`;
}

function delete_(key) {
	return `${CMD_DELETE}${key}`;
}

function exists(key) {
	return `${CMD_EXISTS}${key}`;
}

function complete(key) {
	return `${CMD_COMPLETE}${key}`;
}

function keys() {
	return `${CMD_KEYS}`;
}

module.exports = { insert, delete_, exists, complete, keys };
