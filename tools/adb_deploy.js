var path = require('path');
var launchApp = require('node-firefox-launch-app');
var installToADB = require('install-to-adb');
var Promise = require('es6-promise').Promise;
var appPath = path.join(__dirname, '..', 'app');

installToADB(appPath)
	.then(function(result) {
		return Promise.all(result.map(function(res) {
			return launchApp({
				manifestURL: res.app.manifestURL,
				client: res.client
			});
		}));
	})
	.then(function() {
		process.exit(0);
	});
