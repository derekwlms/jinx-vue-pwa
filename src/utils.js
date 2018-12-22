import fb from '@/firebase/init';
import extend from 'lodash/extend';

export function enterGame(existingGameId, playerId) {
  let gameId = existingGameId || generateGameId();
  let freshGame = {
    gameId: gameId,
    hostPlayerName: '',
    guestPlayerName: '',
    winCount: 0,
    lossCount: 0,
    hostPlayerWord: '',
    guestPlayerWord: '',
    hostGuessCount: 0,
    guestGuessCount: 0,
    timestamp: Date.now()      
  }  
  let docKey = 'game-' + gameId;
  let gameRef = fb.collection('jinxGames').doc(docKey);
  return gameRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        let data = doc.data();
        if (!data.hostPlayerName) {
          throw 'Invalid game ID (missing host player name)';
        }
        if (data.guestPlayerName && data.guestPlayerName != playerId && data.hostPlayerName != playerId) {
          throw 'This game (' + gameId + ') is already taken by other players';
        }
        extend(freshGame, data);
        if (data.hostPlayerName !== playerId) {  // Host can re-join an existing game
          freshGame.guestPlayerName = playerId;
        }
      } else {
        freshGame.hostPlayerName = playerId;
      }
    })
    .then(() => {
      gameRef.set(freshGame);
      return freshGame;
    });
}

export function startPlaying(gameId, gameListener) {
  let docKey = 'game-' + gameId;
  let gamesRef = fb.collection('jinxGames').doc(docKey);
  gamesRef.onSnapshot(doc => {
    gameListener(doc.data());
  });
}

export function updateGame(game) {
  fb.collection('jinxGames').doc('game-' + game.gameId).set(game);
}

function generateGameId() {
  let gameId = '';
  let allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 4; i++)
    gameId += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
  return gameId;
}
