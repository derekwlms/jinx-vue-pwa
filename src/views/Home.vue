<template>
  <div class="container">
    <div class="card login">
      <div class="card-body">
        <h2 class="card-title text-center">Jinx!</h2>
        <form @submit.prevent="login" class="text-center">
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
import { generateGameId } from '../utils';

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
    login() {
      if (!this.name) {
        return this.nameMessage = 'Please enter your name';
      }
      this.nameMessage = null;
      if (!this.gameId) {
        this.$swal({
          title: 'New Game',
          text: 'Start a New Game?',
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.value) {
            var newGameId = generateGameId();
            // Later validate that the gameId is unique
            this.$router.push({name: 'Game', params: {name: this.name, gameId: newGameId}});
          } else {
            return this.gameIdMessage = 'Enter a game ID or start a new game';
          }
        });       
      } else {
        this.$router.push({name: 'Game', params: {name: this.name, gameId: this.gameId}});
      }
    }
  }
}
</script>

<style>
.login{
  max-width: 450px;
  margin-top: 50px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
