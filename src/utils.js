import fb from '@/firebase/init';

export function generateGameId() {
    let gameId = '';
    let allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < 4; i++)
      gameId += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
    return gameId;
}

export function enterGame(gameId, playerId) {
  let freshGame = {
    gameId: gameId,
    hostPlayerName: '',
    guestPlayerName: '',
    winCount: 0,
    lossCount: 0,
    roundNumber: 0,
    guessCount: 0,
    // TODO make the messages (guesses) a subcollection
    // guesses: [],
    // rounds: [],
    // messages: [],
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
    })
    .then(() => {
      gameRef.set(freshGame);
      return freshGame;
    });
}
