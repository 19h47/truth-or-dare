window.URL =
	process.env.NODE_ENV === 'production'
		? 'https://truth-or-dare.lebitclub.fr/'
		: 'http://localhost:3000/';

require('scripts/app');

require.context('icons/', true);
require.context('jpg/', true);
require.context('png/', true);
