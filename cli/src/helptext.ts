import * as chalk from 'chalk';

const triecli = chalk.cyanBright`trie-cli`;
const param = chalk.greenBright;

// note: use two spaces instead of a tab
export const helptext = `\
${chalk.yellow`trie-cli 0.0.1`}

Usage:
  ${triecli} ${param`<command>`} ${param`[key]`}
Commands:
  ${triecli} ${param`insert`} ${param`<key>`}: inserts ${param`<key>`}
  ${triecli} ${param`delete`} ${param`<key>`}: deletes ${param`<key>`}
  ${triecli} ${param`exists`} ${param`<key>`}: checks if ${param`<key>`} exists
  ${triecli} ${param`complete`} ${param`<key>`}: returns all keys that start with ${param`<key>`}
  ${triecli} ${param`display`}: returns all keys in the trie
  ${triecli} ${param`reset`}: resets the trie
  ${triecli} ${param`test`} ${param`<filename>`}: runs the test file ${param`<filename>`}
  ${triecli} ${param`xmas`}: displays a christmas "trie"
Testing files:
  Each test case is separated by a blank line.
  The first line of each test case is the command to run.
  The second line is the condition: ${chalk.cyan('EQ <value>')} or ${chalk.cyan(
	'NE <value>'
)}.

The key can be up to 256 characters.
`;
