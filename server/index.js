var config = require('../config/config.js').config;
require('./app.js').listen(config.oauthServerPort);