import fb from '@/firebase/init';

export function enterGame(existingGameId, playerId) {
  let gameId = existingGameId || generateGameId();
  let freshGame = {
    gameId: gameId,
    hostPlayerName: '',
    guestPlayerName: '',
    playerName: '',
    winCount: 0,
    lossCount: 0,
    roundNumber: 0,
    guessCount: 0,
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
        freshGame.hostPlayerName = data.hostPlayerName;
        freshGame.winCount = data.winCount;
        freshGame.lossCount = data.lossCount;
        freshGame.roundNumber = data.roundNumber;
        freshGame.guestPlayerName = playerId;
      } else {
        freshGame.hostPlayerName = playerId;
      }
      freshGame.playerName = playerId;
    })
    .then(() => {
      gameRef.set(freshGame);
      return freshGame;
    });
}

export function startPlaying(gameId, listener) {
  let docKey = 'game-' + gameId;
  let guessesRef = fb.collection('jinxGames').doc(docKey)
                      .collection('guesses').orderBy('guessNumber', 'desc');
  guessesRef.onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        if (change.type == 'added') {
          // TODO don't display the guess until both sides have entered words
          // TODO show a message (or change the quote direction) when one side has guessed
          listener(change.doc);
        }
        // TODO Also monitor the other player's changes to the same guess
    });
  });  
  // TODO Watch for updates to the shared game - winCount, lossCount, etc
}

export function addGuess(guess) {
  let docKey = 'game-' + guess.gameId;
  let guessesRef = fb.collection('jinxGames').doc(docKey).collection('guesses');
  // TODO Don't just add - update an existing guess for the second player
  guessesRef.add(
      guess
  ).catch(err => {
      console.log(err);
  });

}

function generateGameId() {
  let gameId = '';
  let allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < 4; i++)
    gameId += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
  return gameId;
}