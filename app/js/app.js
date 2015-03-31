window.addEventListener('DOMContentLoaded', function() {

	'use strict';

	var nickname = document.getElementById('nickname');
	var txt = document.getElementById('txt');
	var loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
	var words = loremIpsum.replace(',', '').split(' ');

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
					refreshPeerList().then(peers => {
						log(`got me some ${peers.length} peers`);
						setInterval(() => {
							var randomIndex = Math.floor(Math.random() * words.length);
							var randomWord = words[randomIndex];
							broadcastMessage(randomWord);
						}, 2000);
					});
				}
			});
	}

	function refreshPeerList() {
		return p2pMan.getPeerList().then(peers => {
			log(`number of peers around: ${peers.length}`);
			peers.forEach(p => {
				log(`${p.name} / ${p.connectionStatus} / ${p.address} / ${p.isGroupOwner}`);
			});
			return peers;
		});
	}

	function onPeerListChanged(e) {
		log('PEER LIST CHANGED');
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

	function broadcastMessage(text) {
		log(`BROADCASTING ${text}`);
	}
});
