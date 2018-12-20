<template>
    <div class="chat container">
        <h2 class="text-primary text-center">Jinx! - {{game.gameId}}</h2>
        <h5>Wins - {{game.winCount}}, Losses - {{game.lossCount}}</h5>
        <div class="card">
            <div class="card-action">
                <Guess :gameId="game.gameId" :isHostPlayer="isHostPlayer" :guessCount="game.guessCount" :roundNumber="game.roundNumber"/>
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
    import { startPlaying, updateGame } from '../utils';
    import extend from 'lodash/extend';

    export default {
        name: 'Game',
        props: ['gameParameters'],
        components: {
            Guess
        },
        data() {
            return {
                game: {
                    gameId: null,
                    hostPlayerName: null,
                    guestPlayerName: null,
                    playerName: null,
                    winCount: 0,
                    lossCount: 0,
                    roundNumber: 0,
                    guessCount: 0,
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
                this.game.guessCount = 0;
                this.game.roundNumber++;
            }        
        },
        created() {
            extend(this.game, this.gameParameters);
            this.isHostPlayer = this.game.hostPlayerName == this.game.playerName;
            let self = this;
            startPlaying(this.game.gameId, 
                gameDoc => {
                    extend(self.game, gameDoc.data());
                },            
                guessesDoc => {
                    if (guessesDoc.data().roundNumber == self.game.roundNumber) {
                        // TODO update existing guess (both sides), add scrolling
                        self.guesses.unshift(guessesDoc.data());
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
