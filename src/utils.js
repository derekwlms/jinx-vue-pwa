export function generateGameId() {
    var gameId = '';
    var allowedCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  
    for (var i = 0; i < 4; i++)
      gameId += allowedCharacters.charAt(Math.floor(Math.random() * allowedCharacters.length));
  
    return gameId;
  }
