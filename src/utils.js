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
    roundNumber: 0,
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
        if (data.hostPlayerName !== playerId) {  // Host can re-join existing game
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

export function startPlaying(gameId, gameListener, guessesListener) {
  let docKey = 'game-' + gameId;
  let gamesRef = fb.collection('jinxGames').doc(docKey);
  gamesRef.onSnapshot(doc => {
    gameListener(doc.data());
  });
  // Avoid nested collections for now - not fully baked in firestore (no cascade deletes, etc)
  // let guessesRef = fb.collection('jinxGames').doc(docKey)
  //                     .collection('guesses').orderBy('guessNumber', 'desc');  
  let guessesRef = fb.collection('jinxGuesses').where('gameId', '==', gameId).orderBy('guessNumber', 'desc');
  guessesRef.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          // TODO Probably don't need a collection, just store the latest guess in the game
          // TODO don't display the guess until both sides have entered words
          // TODO show a message (or change the quote direction) when one side has guessed
          guessesListener(change.doc.data());
        }
        // TODO Also monitor the other player's changes to the same guess
    });
  });  
}

export function shareGuess(guess) {
  // TODO just store the latest guess in the game
  if (guess.guestPlayerWord && guess.hostPlayerWord) {
    // TODO update or remove initial partial guess
    fb.collection('jinxGuesses').add(guess);
  } else {
    fb.collection('jinxGuesses').add(guess)
  }
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