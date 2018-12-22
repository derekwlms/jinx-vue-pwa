<template>
    <div class="chat container">
        <h2 class="text-primary text-center">Jinx! - {{game.gameId}}</h2>
        <h5>Wins - {{game.winCount}}, Losses - {{game.lossCount}}</h5>
        <div class="card">
            <div class="card-action">
                <Guess @newGuess="guess"/>
                <button @click="closeEnough" class="btn game-button" name="closeEnough">Close Enough</button>
                <button @click="quitGame" class="btn game-button" name="quitGame">Give Up</button>  
            </div>                       
            <div class="card-body">
                <p class="text-secondary" v-if="guesses.length == 0">
                    [Type your first word]
                </p>
                <table class="guesses table">
                    <thead>
                        <tr>
                            <th>{{game.hostPlayerName}}</th>
                            <th></th>
                            <th>{{game.guestPlayerName}}</th>
                        </tr>
                        <tr>
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
    import { startPlaying, updateGame } from '../utils';
    import extend from 'lodash/extend';

    export default {
        name: 'Game',
        props: ['gameParameters', 'playerName'],
        components: {
            Guess
        },
        data() {
            return {
                game: {
                    gameId: null,
                    hostPlayerName: null,
                    guestPlayerName: null,
                    winCount: 0,
                    lossCount: 0,
                    hostPlayerWord: '',
                    guestPlayerWord: '',
                    hostGuessCount: 0,
                    guestGuessCount: 0,
                    timestamp: null
                },
                guesses: [],
                guestMessage: '',
                hostMessage: '',
                isHostPlayer: false,
            }
        },
        methods: {
            closeEnough() {
                this.$swal('OK, sure, you win!');
                this.game.winCount++;
                this.newGame();
                updateGame(this.game);
            },
            quitGame() {
                this.$swal('Better luck next time');
                this.game.lossCount++;
                this.newGame();
                updateGame(this.game);
            },
            newGame() {
                this.guesses = [];
                extend(this.game, {
                    hostPlayerWord: '',
                    guestPlayerWord: '',
                    hostGuessCount: 0,
                    guestGuessCount: 0,
                    timestamp: Date.now()
                });
            },
            guess(newWord) {
                if (this.isHostPlayer) {
                    this.hostMessage = newWord;
                    this.game.hostPlayerWord = newWord;
                    this.game.hostGuessCount++;
                } else {
                    this.guestMessage = newWord;
                    this.game.guestPlayerWord = newWord;
                    this.game.guestGuessCount++;
                }
                this.game.timestamp = Date.now();
                updateGame(this.game);
            }       
        },
        created() {
            extend(this.game, this.gameParameters);
            this.isHostPlayer = this.game.hostPlayerName == this.playerName;
            let self = this;
            startPlaying(this.game.gameId, 
                game => {
                    if (game.hostGuessCount == game.guestGuessCount) {
                        let guess = {
                            guestPlayerWord: game.guestPlayerWord,
                            hostPlayerWord: game.hostPlayerWord,
                            guessNumber: game.hostGuessCount,
                            timestamp: game.timestamp
                        }
                        if (guess.hostPlayerWord && guess.hostPlayerWord == guess.guestPlayerWord) {
                            this.$swal('You win!');
                            this.game.winCount++;
                            // TODO Update game (outside of this handler) so that both sides see it
                            // this.newGame();
                            return;
                        }
                        if (game.hostGuessCount > 0) {
                            self.guesses.unshift(guess);
                        }
                        self.hostMessage = self.guestMessage = '';
                    } else if (game.hostGuessCount < game.guestGuessCount) {
                        self.hostMessage = 'Waiting...';
                    } else {
                        self.guestMessage = 'Waiting...';
                    }
                    extend(self.game, game);
                }
            );
        }
    }
</script>

<style>
.chat h2{
    font-size: 2em;
    margin-bottom: 0px;
}

.chat h5{
    margin-top: 0px;
    margin-bottom: 12px;
}

.chat span{
    font-size: 1.2em;
}

.chat .time{
    display: block;
    font-size: 0.7em;
}

.game-button {
  margin-left: 4px;
  margin-right: 4px;
}

.guesses{
    max-height: 300px;
    overflow: auto;
}

</style>
