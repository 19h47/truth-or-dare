module.exports = {
	root: true,
	env: {
		node: true,
		browser: true,
	},
	extends: ['airbnb-base', 'plugin:vue/essential'],
	rules: {
		'arrow-parens': 0,
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-tabs': 0,
		indent: ['error', 'tab'],
		'no-param-reassign': ['error', {
			props: true,
			ignorePropertyModificationsFor: ['state']
		}],
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	settings: {
		'import/resolver': {
			'webpack': {
				'config': 'config/webpack.common.js'
			},
		}
	},
};
