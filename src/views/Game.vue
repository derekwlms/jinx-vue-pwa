<template>
    <div class="chat container">
        <h2 class="text-primary text-center">Jinx! - {{gameId}}</h2>
        <h5>Wins - {{winCount}}, Losses - {{lossCount}}</h5>
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
    import { startPlaying } from '../utils';

    export default {
        name: 'Game',
        props: ['game'],
        components: {
            Guess
        },
        data() {
            return {
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
                this.newGame();
            },
            quitGame() {
                this.$swal('Better luck next time');
                this.lossCount++;
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
            startPlaying(this.gameId, doc => {
                if (doc.data().roundNumber == self.roundNumber) {
                    self.guesses.unshift({
                        id: doc.id,
                        guessNumber: doc.data().guessNumber,
                        message: doc.data().hostPlayerWord,
                        hostPlayerWord: doc.data().hostPlayerWord,
                        guestPlayerWord: doc.data().guestPlayerWord,
                        roundNumber: doc.data().roundNumber,
                        timestamp: doc.data().timestamp
                    });
                }
            });
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
