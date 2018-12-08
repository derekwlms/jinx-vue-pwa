<template>
    <div class="chat container">
        <h2 class="text-primary text-center">Jinx! - {{gameId}}</h2>
        <h5>Wins - {{winCount}}, Losses - {{lossCount}}</h5>
        <div class="card">
            <div class="card-action">
                <CreateMessage :name="name" :guessCount="guessCount" :roundNumber="roundNumber"/>
                <button @click="closeEnough" class="btn game-button" name="closeEnough">Close Enough</button>
                <button @click="quitGame" class="btn game-button" name="quitGame">Give Up</button>  
            </div>                       
            <div class="card-body">
                <p class="nomessages text-secondary" v-if="messages.length == 0">
                    [Type your first word]
                </p>
                <table class="messages table" v-chat-scroll="{always: false, smooth: true}">
                    <thead>
                        <tr>
                            <th>{{hostPlayerName}}</th>
                            <th></th>
                            <th>{{guestPlayerName}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="message in messages" :key="message.id">
                            <td class="text-info">{{ message.message }}</td>
                            <td class="text-info">{{ message.guessNumber }}</td>
                            <td class="text-info">{{ message.message }}
                                <span class="d-none">
                                    {{message.timestamp}}, {{message.roundNumber}}, {{message.name}} 
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
    import CreateMessage from '@/components/CreateMessage';
    import fb from '@/firebase/init';
    import moment from 'moment';

    export default {
        name: 'Game',
        props: ['name', 'gameId'],
        components: {
            CreateMessage
        },
        data() {
            return {
                hostPlayerName: null,
                guestPlayerName: null,
                winCount: 0,
                lossCount: 0,
                roundNumber: 0,
                guessCount: 0,
                rounds: [],
                messages: []
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
                // Firebase lacks delete all - so tag each message with round # and filter
                this.guessCount = 0;
                this.roundNumber++;
            }        
        },
        created() {
            this.hostPlayerName = this.name;
            this.guestPlayerName = 'TBD';

            let fbMessages = fb.collection('messages').orderBy('guessNumber', 'desc');

            fbMessages.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let doc = change.doc;
                        this.messages.unshift({
                            id: doc.id,
                            guessNumber: doc.data().guessNumber,
                            name: doc.data().name,
                            message: doc.data().message,
                            timestamp: moment(doc.data().timestamp).format('LTS')
                        });
                    }
                });
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

.messages{
    max-height: 300px;
    overflow: auto;
}

</style>
