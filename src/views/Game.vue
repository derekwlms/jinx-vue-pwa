<template>
    <div class="game container">
        <h2 class="text-primary text-center">Jinx! - {{game.gameId}}</h2>
        <h5>Wins - {{game.winCount}}, Losses - {{game.lossCount}}</h5>
        <div class="card">
            <div class="card-action">
                <Guess @newGuess="guess" :isWaiting="isWaiting"/>
                <button @click="closeEnough" class="btn game-button" name="closeEnough">Close Enough</button>
                <button @click="quitGame" class="btn game-button" name="quitGame">Give Up</button>  
            </div>                       
            <div class="card-body">
                <table class="guesses table">
                    <thead>
                        <tr>
                            <th>{{game.hostPlayerName}}</th>
                            <th></th>
                            <th>{{game.guestPlayerName}}</th>
                        </tr>
                        <tr class="player-message text-primary">
                            <th><em>{{hostMessage}}</em></th>
                            <th></th>
                            <th><em>{{guestMessage}}</em></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="guess in guesses" :key="guess.id">
                            <td class="text-info">{{ guess.hostPlayerWord }}</td>
                            <td class="text-info">{{ guess.guessNumber }}</td>
                            <td class="text-info">{{ guess.guestPlayerWord }}
                                <span class="d-none">
                                    {{guess.timestamp}}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Guess from '@/components/Guess';
    import { initializeGame, startPlaying, updateGame } from '../utils';
    import extend from 'lodash/extend';

    export default {
        name: 'Game',
        props: ['gameParameters', 'playerName'],
        components: {
            Guess
        },
        data() {
            return {
                game: initializeGame(),
                guesses: [],
                guestMessage: '',
                hostMessage: '',
                isHostPlayer: false,
                isWaiting: false
            }
        },
        methods: {
            closeEnough() {
                this.game.gameMessage = 'Ok, sure, you win!';
                this.game.winCount++;
                updateGame(this.game);
            },
            quitGame() {
                this.game.gameMessage = 'Better luck next time';
                this.game.lossCount++;
                updateGame(this.game);
            },
            newGame() {
                this.guesses = [];
                extend(this.game, {
                    hostPlayerWord: '',
                    guestPlayerWord: '',
                    hostGuessCount: 0,
                    guestGuessCount: 0,
                    gameMessage: '',
                    timestamp: Date.now()
                });
                this.hostMessage = this.guestMessage = '';
                this.isWaiting = false;
            },
            guess(newWord) {
                this.isWaiting = true;
                const game = this.game;
                if (this.isHostPlayer) {
                    this.hostMessage = newWord;
                    game.hostPlayerWord = newWord;
                    game.hostGuessCount++;
                } else {
                    this.guestMessage = newWord;
                    game.guestPlayerWord = newWord;
                    game.guestGuessCount++;
                }
                if (game.hostGuessCount && game.guestGuessCount &&
                    game.hostPlayerWord && game.hostPlayerWord == game.guestPlayerWord) {
                    game.gameMessage = 'You win!';
                    game.winCount++;
                }
                game.timestamp = Date.now();
                updateGame(game);
            }       
        },
        created() {
            extend(this.game, this.gameParameters);
            this.isHostPlayer = this.game.hostPlayerName == this.playerName;
            let self = this;
            startPlaying(this.game.gameId, 
                game => {
                    extend(self.game, game);
                    if (game.gameMessage) {
                        this.$swal(game.gameMessage)
                            .then(() => this.newGame());
                        return;
                    }
                    if (game.hostGuessCount == game.guestGuessCount) {
                        let guess = {
                            guestPlayerWord: game.guestPlayerWord,
                            hostPlayerWord: game.hostPlayerWord,
                            guessNumber: game.hostGuessCount,
                            timestamp: game.timestamp
                        }
                        if (game.hostGuessCount > 0) {
                            self.guesses.unshift(guess);
                        }
                        self.hostMessage = self.guestMessage = '';
                        self.isWaiting = false;
                    } else if (game.hostGuessCount < game.guestGuessCount) {
                        self.hostMessage = 'Waiting...';
                    } else {
                        self.guestMessage = 'Waiting...';
                    }
                }
            );
        }
    }
</script>

<style>
.game h2 {
    font-size: 2em;
    margin-bottom: 0px;
}
.game h5 {
    margin-top: 0px;
    margin-bottom: 12px;
}
.game span {
    font-size: 1.2em;
}
.game-button {
  margin-left: 4px;
  margin-right: 4px;
}
.guesses {
    max-height: 300px;
    overflow: auto;
}
.player-message {
    font-size: 0.9em;
    font-style: italic;
}
</style>
