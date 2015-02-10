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

	setNickname('user' + Math.floor(Math.random() * 100))
		.then(result => {
			log('updated');
			setupEventListeners();
			enableScanning();
		});

	function enableScanning() {
		p2pMan.setScanEnabled(true)
			.then(result => {
				if(!result) {
					throw(new Error('Cannot start scanning'));
				} else {
					log('Scanning enabled');
					p2pMan.addEventListener('peerinfoupdate', onPeerListChanged);
					refreshPeerList();
				}
			});
	}

	function refreshPeerList() {
		p2pMan.getPeerList().then(peers => {
			log(`number of peers around: ${peers.length}`);
			peers.forEach(p => {
				log(p.name);
			});
		});
	}

	function onPeerListChanged(e) {
		refreshPeerList();
	}

	function setNickname(str) {
		nickname.value = str;
		
		return p2pMan.setDeviceName(str)
			.then(result => {
				log(str + ' nickname updated? ' + result);
			});
	}

	function log(string) {
		txt.innerHTML = txt.innerHTML + '<div>' + string.toString() + '</div>';
	}

	var setupEventListeners = () => {
		nickname.addEventListener('blur', e => {
			setNickname(nickname.value);
		});
	}
});
