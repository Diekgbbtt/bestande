const extractTitleFromName = (name: string): [string, string] => {
	const tokens = ['Frau', 'Herr', 'Prof.', 'Dr.'];
	const titles: string[] = [];
	for (const token of tokens) {
		if (name.includes(token)) {
			name = name.replace(token, '');

			titles.push(token);
		}
	}

	return [name.trim(), titles.join(' ')];
};

export default extractTitleFromName;
