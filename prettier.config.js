module.exports = {
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	arrowParens: 'avoid',
	overrides: [
		{
			files: '*.md',
			options: {
				parser: 'markdown',
			},
		},
	],
};
