<template>
    <div class="container" style="margin-top: 14px">
        <form @submit.prevent="guess">
            <div class="form-group">
                <div class="input-group">
                    <input type="text" name="guess" class="form-control" placeholder="Enter a word ..." v-model="newWord">
                    <span class="input-group-btn">
                        <button class="btn btn-primary game-button" type="submit" name="action">Guess</button>
                    </span>
                </div>
                <p class="text-danger" v-if="errorText">{{ errorText }}</p>
            </div>
        </form>
    </div>
</template>

<script>
    import { addGuess } from '../utils';

    export default {
        name: 'Guess',
        props: ['gameId', 'isHostPlayer', 'guessCount', 'roundNumber'],
        data() {
            return {
                errorText: null,
                latestGuessNumber: 0,
                newWord: null
            }
        },
        methods: {
            guess() {
                if (this.newWord) {
                    var guess = {
                        gameId: this.gameId,
                        guessNumber: ++this.latestGuessNumber,
                        roundNumber: this.roundNumber,
                        timestamp: Date.now()
                    };
                    if (this.isHostPlayer) {
                        guess.hostPlayerWord = this.newWord;
                    } else {
                        guess.guestPlayerWord = this.newWord;
                    }
                    addGuess(guess);
                    this.newWord = '';
                } else {
                    this.errorText = 'Enter a word';
                }
            }
        }
    }
</script>
