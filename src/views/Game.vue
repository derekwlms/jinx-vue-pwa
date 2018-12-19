<template>
    <div class="chat container">
        <h2 class="text-primary text-center">Jinx! - {{gameId}}</h2>
        <h5>Wins - {{winCount}}, Losses - {{lossCount}} - {{game2.test1}}</h5>
        <div class="card">
            <div class="card-action">
                <Guess :gameId="gameId" :isHostPlayer="hostPlayerName == playerName" :guessCount="guessCount" :roundNumber="roundNumber"/>
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
                            <th>{{hostPlayerName}}</th>
                            <th></th>
                            <th>{{guestPlayerName}}</th>
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

    export default {
        name: 'Game',
        props: ['game'],
        components: {
            Guess
        },
        data() {
            return {
                game2: {
                    test1: null
                },
                hostPlayerName: null,
                guestPlayerName: null,
                playerName: null,
                winCount: 0,
                lossCount: 0,
                roundNumber: 0,
                guessCount: 0,
                guesses: []
            }
        },
        methods: {
            closeEnough() {
                this.$swal('OK, sure, you win!');
                this.winCount++;
                // TODO Finish game updates, sync from both sides
                this.game.winCount++;
                this.newGame();
                updateGame(this.game);
            },
            quitGame() {
                this.$swal('Better luck next time');
                this.lossCount++;
                // TODO test:
                this.game2.test1 = 'testing';
                this.newGame();
            },
            newGame() {
                this.guesses = [];
                // Firestore lacks delete all, so tag each guess with round # and filter
                this.guessCount = 0;
                this.roundNumber++;
            }        
        },
        created() {
            // TODO bind to game directly, make game an object
            this.hostPlayerName = this.game.hostPlayerName;
            this.guestPlayerName = this.game.guestPlayerName;
            this.playerName = this.game.playerName;
            this.gameId = this.game.gameId;
            let self = this;
            startPlaying(this.gameId, 
                gameDoc => {
                    self.hostPlayerName = gameDoc.data().hostPlayerName;
                    self.guestPlayerName = gameDoc.data().guestPlayerName;
                    self.winCount = gameDoc.data().winCount;
                    self.lossCount = gameDoc.data().lossCount;
                    self.roundNumber = gameDoc.data().roundNumber;
                },            
                guessesDoc => {
                    if (guessesDoc.data().roundNumber == self.roundNumber) {
                        self.guesses.unshift({
                            id: guessesDoc.id,
                            guessNumber: guessesDoc.data().guessNumber,
                            message: guessesDoc.data().hostPlayerWord,
                            hostPlayerWord: guessesDoc.data().hostPlayerWord,
                            guestPlayerWord: guessesDoc.data().guestPlayerWord,
                            roundNumber: guessesDoc.data().roundNumber,
                            timestamp: guessesDoc.data().timestamp
                        });
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
