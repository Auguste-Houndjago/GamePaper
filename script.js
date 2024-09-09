const singlePlayerBtn = document.getElementById('singlePlayerBtn');
const multiPlayerBtn = document.getElementById('multiPlayerBtn');
const createBtn = document.getElementById('createBtn');
const joinBtn = document.getElementById('joinBtn');
const connectionArea = document.getElementById('connectionArea');
const gameMode = document.getElementById('gameMode');

let peerConnection;
let dataChannel;

// Sélection du mode de jeu
singlePlayerBtn.addEventListener('click', () => {
  gameMode.style.display = 'none';
  document.getElementById('displayArea').style.display = 'flex';
});

multiPlayerBtn.addEventListener('click', () => {
  gameMode.style.display = 'none';
  connectionArea.style.display = 'block';
});

// Créer une partie
createBtn.addEventListener('click', () => {
  createGame();
});

// Rejoindre une partie
joinBtn.addEventListener('click', () => {
  const gameCode = document.getElementById('gameCode').value;
  if (gameCode) {
    joinGame(gameCode);
  } else {
    alert('Please enter a game code.');
  }
});

// Créer une partie P2P
function createGame() {
  peerConnection = new RTCPeerConnection();

  dataChannel = peerConnection.createDataChannel('game');
  setupDataChannel();

  peerConnection.createOffer().then(offer => {
    peerConnection.setLocalDescription(offer);
    // Envoyer l'offre au joueur qui rejoint (à implémenter via un serveur de signalisation)
    console.log('Offer created:', offer);
  });

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      // Envoyer le candidat au joueur qui rejoint (à implémenter via un serveur de signalisation)
      console.log('ICE Candidate:', event.candidate);
    }
  };
}

// Rejoindre une partie P2P
function joinGame(offer) {
  peerConnection = new RTCPeerConnection();

  peerConnection.ondatachannel = event => {
    dataChannel = event.channel;
    setupDataChannel();
  };

  peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  peerConnection.createAnswer().then(answer => {
    peerConnection.setLocalDescription(answer);
    // Envoyer la réponse au créateur de la partie (à implémenter via un serveur de signalisation)
    console.log('Answer created:', answer);
  });

  peerConnection.onicecandidate = event => {
    if (event.candidate) {
      // Envoyer le candidat au créateur de la partie (à implémenter via un serveur de signalisation)
      console.log('ICE Candidate:', event.candidate);
    }
  };
}

function setupDataChannel() {
  dataChannel.onopen = () => {
    console.log('Data channel is open');
  };

  dataChannel.onmessage = event => {
    console.log('Received message:', event.data);
    // Gérer les messages échangés entre les joueurs
  };
}
