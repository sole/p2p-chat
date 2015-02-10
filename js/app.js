window.addEventListener('DOMContentLoaded', function() {

	'use strict';

	var nickname = document.getElementById('nickname');
	var txt = document.getElementById('txt');

	var p2pMan = navigator.mozWifiP2pManager;

	if(p2pMan.enabled) {
		log('wifi direct enabled');
	} else {
		log('nothing to do here. wifi direct is not enabled :-(');
		return;
	}

	setNickname('user' + Math.floor(Math.random() * 100));

	p2pMan.setScanEnabled(true)
	.then(result => {
		if(!result) {
			throw(new Error('wifiP2P non workee'));
		}
		return p2pMan.getPeerList();
	}).then(peers => {
		console.log(`number of peers around: ${peers.length}`);
	});

	function setNickname(str) {
		nickname.value = str;
		
		p2pMan.setDeviceName(str)
			.then(result => {
				log(str + ' nickname updated? ' + result);
			});
	}

	function log(string) {
		txt.innerHTML = txt.innerHTML + '<div>' + string.toString() + '</div>';
	}
});
