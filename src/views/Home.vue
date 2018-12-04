<template>
  <div class="container">
    <div class="card login">
      <div class="card-body">
        <h2 class="card-title text-center">Jinx!</h2>
        <form @submit.prevent="login" class="text-center">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Please enter your name ..." name="name" v-model="name">
            <p v-if="errorText" class="text-danger">{{ errorText }}</p>
          </div>
          <button class="btn btn-primary">Enter Game</button>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      name: "",
      errorText: null
    }
  },
  methods: {
    login() {
      if (this.name) {
        this.$router.push({name: 'Game', params: {name: this.name}})
      } else {
        this.errorText = "Please enter a name"
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
