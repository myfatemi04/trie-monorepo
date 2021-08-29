import * as chalk from 'chalk';

const halfWidths = [0, 2, 2, 4, 3, 5, 4, 6, 5, 7];

const generateChristmasTree = (halfWidths: number[]) => {
	const maxHalfWidth = Math.max(...halfWidths);
	const totalWidth = 1 + maxHalfWidth + 1 + maxHalfWidth + 1;
	const lines: string[] = [];
	for (let rowHalfWidth of halfWidths) {
		const width = 1 + rowHalfWidth + 1 + rowHalfWidth + 1;
		const leadingWhitespaceLength = Math.floor((totalWidth - width) / 2);
		const leadingWhitespace = ' '.repeat(leadingWhitespaceLength);
		const row = '/' + '-'.repeat(rowHalfWidth * 2 + 1) + '\\';
		lines.push(leadingWhitespace + chalk.green(row));
	}

	const halfSpacer = ' '.repeat(maxHalfWidth);

	const trunk = chalk.yellow('|');

	lines.push(` ${halfSpacer}${trunk}${halfSpacer} `);
	lines.push(
		` ${' '.repeat(maxHalfWidth - 2)}__${trunk}__${' '.repeat(
			maxHalfWidth - 2
		)} `
	);

	const message = 'Christmas Trie!';
	const messageHalfWidth = Math.floor(message.length / 2);
	lines.push(' '.repeat(maxHalfWidth + 1 - messageHalfWidth) + message);

	return lines.join('\n');
};

const christmasTree = generateChristmasTree(halfWidths);

console.log(christmasTree);

export default christmasTree;
