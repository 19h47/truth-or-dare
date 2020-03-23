window.URL = process.env.NODE_ENV === 'production' ? 'https://truth-or-dare.19h47.fr/' : 'http://localhost:9000/';

require('scripts/app');

require.context('icons/', true);
require.context('jpg/', true);
require.context('png/', true);
