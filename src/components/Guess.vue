<template>
    <div class="container" style="margin-top: 14px">
        <form @submit.prevent="guess">
            <div class="form-group">
                <div class="input-group">
                    <input type="text" name="guess" class="form-control" placeholder="Enter a word ..." v-model="newWord">
                    <span class="input-group-btn">
                        <button :disabled="isWaiting" class="btn btn-primary game-button" type="submit" name="action">Guess</button>
                    </span>
                </div>
                <p class="text-danger" v-if="errorText">{{ errorText }}</p>
            </div>
        </form>
    </div>
</template>

<script>
    export default {
        name: 'Guess',
        props: ['isWaiting'],
        data() {
            return {
                errorText: null,
                newWord: null
            }
        },
        methods: {
            guess() {
                const trimmedWord = this.newWord.trim();
                if (trimmedWord) {
                    this.$emit('newGuess', trimmedWord);
                    this.newWord = '';
                } else {
                    this.errorText = 'Enter a word';
                }
            }
        }
    }
</script>
