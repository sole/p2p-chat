window.addEventListener('DOMContentLoaded', function() {

	'use strict';

	var nickname = document.getElementById('nickname');
	var txt = document.getElementById('txt');
	var loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
	var words = loremIpsum.replace(',', '').split(' ');

	var p2pMan = navigator.mozWifiP2pManager;
	var currentPeers = [];

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
						/*broadcastRandomWord().then(broadcastRes => {
							log('broadcasted ' + broadcastRes);
						});*/

						setTimeout(doRandomBroadcast, 5000);
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
			currentPeers = peers;
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
	};

	function doRandomBroadcast() {

		log('random broadcast');
		broadcastRandomWord().then(() => {
			setTimeout(doRandomBroadcast, 5000);
		});

	}

	function broadcastRandomWord() {
		var randomIndex = Math.floor(Math.random() * words.length);
		var randomWord = words[randomIndex];
		return broadcastMessage(randomWord);
	}

	function broadcastMessage(text) {
		log(`BROADCASTING ${text} to ${currentPeers.length}`);
		var sequence = Promise.resolve(currentPeers.length);

		currentPeers.forEach(p => {
			sequence = sequence.then(function() {
				log('sequencing ' + p.name);
				return sendMessageToPeer(p, text);
			});
		});

		return sequence;
	}

	function sendMessageToPeer(peer, message) {
		var name = peer.name;
		log(`sending message to ${name} - connecting`);
		if(peer.isGroupOwner || peer.connectionStatus !== disconnected) {
			var err = `${name} is busy - O: ${peer.isGroupOwner} - S: ${peer.connectionStatus}`;
			log(err);
			return err;
		} else {
			p2pMan.connect(peer.address, 'pbc', 15)
				.then(result => {
					if(!result) {
						log(`AAAH NOT CONNECTED ${peer.name}`);
						return;
					}
					log('connected ' + name);
					return p2pMan.disconnect(peer.address);
				});

		}
		/*return p2pMan.connect(peer.address, 'pbc', 15)
			.then(result => {
				if(!result) {
					log(`AAAH NOT CONNECTED ${peer.name}`);
					return;
				}
				log('connected');
				//log(`connected to ${peer.name}`);
				//log(result.toString());
				//log(`now disconnecting from ${peer.name}`);
				//return p2pMan.disconnect(peer.address);
				//return peer.name;
			});*/
	}
});
