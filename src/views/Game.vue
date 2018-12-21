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
                    </thead>
                    <tbody>
                        <tr v-for="guess in guesses" :key="guess.id">
                            <td class="text-info">{{ guess.hostPlayerWord }}</td>
                            <td class="text-info">{{ guess.guessNumber }}</td>
                            <td class="text-info">{{ guess.guestPlayerWord }}
                                <span class="d-none">
                                    {{guess.timestamp}}, {{guess.roundNumber}} 
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
    import { shareGuess, startPlaying, updateGame } from '../utils';
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
                    roundNumber: 0
                },
                guesses: [],
                isHostPlayer: false
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
                // Firestore lacks delete all, so tag each guess with round # and filter
                this.game.roundNumber++;
            },
            guess(newWord) {
                let initialGuess = this.guesses[0];
                if (initialGuess && initialGuess.guestPlayerWord && initialGuess.hostPlayerWord) {
                    initialGuess = null;
                }
                let guess = {
                    gameId: this.game.gameId,
                    guessNumber: this.guesses.length,
                    roundNumber: this.game.roundNumber,
                    timestamp: Date.now()
                };
                if (this.isHostPlayer) {
                    guess.hostPlayerWord = newWord;
                    guess.guestPlayerWord = initialGuess ? initialGuess.guestPlayerWord : null;
                } else {
                    guess.guestPlayerWord = newWord;
                    guess.hostPlayerWord = initialGuess ? initialGuess.hostPlayerWord : null;
                }
                shareGuess(guess);
            }       
        },
        created() {
            extend(this.game, this.gameParameters);
            this.isHostPlayer = this.game.hostPlayerName == this.playerName;
            let self = this;
            startPlaying(this.game.gameId, 
                game => {
                    extend(self.game, game);
                },            
                guess => {
                    if (guess.roundNumber == self.game.roundNumber) {
                        // TODO update existing guess (both sides), add scrolling
                        if (guess.guestPlayerWord && guess.hostPlayerWord) {
                            self.guesses.splice(0, 1);
                        }
                        if (guess.hostPlayerWord && guess.hostPlayerWord == guess.guestPlayerWord) {
                            throw 'You win!';
                        }
                        self.guesses.unshift(guess);
                    }
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
