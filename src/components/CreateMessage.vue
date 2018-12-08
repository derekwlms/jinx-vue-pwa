<template>
    <div class="container" style="margin-top: 14px">
        <form @submit.prevent="createMessage">
            <div class="form-group">
                <div class="input-group">
                    <input type="text" name="message" class="form-control" placeholder="Enter a word ..." v-model="newMessage">
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
    import fb from '@/firebase/init';

    export default {
        name: 'CreateMessage',
        props: ['gameId', 'guessCount', 'name', 'roundNumber'],
        data() {
            return {
                errorText: null,
                latestGuessNumber: 0,
                newMessage: null
            }
        },
        methods: {
            createMessage () {
                if (this.newMessage) {
                    fb.collection('messages').add({
                        gameId: this.gameId,
                        guessNumber: ++this.latestGuessNumber,
                        message: this.newMessage,
                        name: this.name,
                        roundNumber: this.roundNumber,
                        timestamp: Date.now()
                    }).catch(err => {
                        console.log(err);
                    });
                    this.newMessage = null;
                    this.errorText = null;
                } else {
                    this.errorText = 'Enter a word';
                }
            }
        }
    }
</script>
