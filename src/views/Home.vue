<template>
  <div class="container">
    <div class="card enter-game">
      <div class="card-body">
        <h2 class="card-title text-center">Jinx!</h2>
        <form @submit.prevent="enterGame" class="text-center">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Please enter your name ..." name="name" v-model="name">
            <p v-if="nameMessage" class="text-danger">{{ nameMessage }}</p>            
            <br />
            <input type="text" class="form-control" placeholder="... and an optional game ID" name="gameId" v-model="gameId">
            <p v-if="gameIdMessage" class="text-danger">{{ gameIdMessage }}</p>              
          </div>
          <button class="btn btn-primary">Let's Go!</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { enterGame } from '../utils';

export default {
  name: "home",
  data () {
    return {
      name: "",
      gameId: "",
      nameMessage: null,
      gameIdMessage: null
    }
  },
  methods: {
    enterGame() {
      var playerName = (this.name || '').trim();
      if (!playerName) {
        return this.nameMessage = 'Please enter your name';
      }
      this.nameMessage = null;
      var gameKey = (this.gameId || '').trim().toUpperCase();
      if (!gameKey) {
        this.$swal({
          title: 'New Game',              text: 'Start a New Game?',
          type: 'question',               showCancelButton: true,
          confirmButtonColor: '#3085d6',  cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',       cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            this.startGame(null, playerName);
          } else {
            return this.gameIdMessage = 'Enter a game ID or start a new game';
          }
        });       
      } else {
        this.gameIdMessage = null;
        this.startGame(gameKey, playerName);
      }
    },
    startGame(gameKey, playerName) {
      enterGame(gameKey, playerName)
        .then((game) => {
          this.$router.push({name: 'Game', params: { gameParameters: game }});
        })
        .catch((error) => {
          this.$swal('Start Game', ('' + error) || 'Error starting game', 'error');
        });
    }
  }
}
</script>

<style>
.enter-game {
  max-width: 450px;
  margin-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
