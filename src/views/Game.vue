<template>
    <div class="chat container">
        <h2 class="text-primary text-center">Jinx!</h2>
        <div class="card">
            <div class="card-action">
                <CreateMessage :name="name"/>
            </div>            
            <div class="card-body">
                <p class="nomessages text-secondary" v-if="messages.length == 0">
                    [Type your first word]
                </p>
                <div class="messages" v-chat-scroll="{always: false, smooth: true}">
                    <div v-for="message in messages" :key="message.id">
                        <span class="text-info">[{{ message.name }}]: </span>
                        <span>{{message.message}}</span>
                        <span class="text-secondary time">{{message.timestamp}}</span>
                    </div>
                </div>
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
        props: ['name'],
        components: {
            CreateMessage
        },
        data() {
            return{
                messages: []
            }
        },
        created() {
            let ref = fb.collection('messages').orderBy('timestamp');

            ref.onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let doc = change.doc;
                        this.messages.push({
                            id: doc.id,
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
    font-size: 2.6em;
    margin-bottom: 0px;
}

.chat h5{
    margin-top: 0px;
    margin-bottom: 40px;
}

.chat span{
    font-size: 1.2em;
}

.chat .time{
    display: block;
    font-size: 0.7em;
}

.messages{
    max-height: 300px;
    overflow: auto;
}
</style>
