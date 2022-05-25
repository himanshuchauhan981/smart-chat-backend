module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: [
		'airbnb-base',
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		indent: ['error', 'tab'],
		'no-tabs': ['error', { allowIndentationTabs: true }],
		'no-console': 'off',
		'no-underscore-dangle': 'off',
		'no-plusplus': 'off',
	},
};
