<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        this.$router.push('/')
      } catch (error) {
        // user is logged out, nothing
      }
    },
    async doLogin() {
      try {
        const response = await this.axios.post('/api/login', {username: this.username, password: this.password})
        this.$router.push('/')
      } catch (error) {
        alert('Error')
        console.log('Error on Login.vue > doLogin()', error.response.data.message)
      }
    }
  },
  async mounted() {
    await this.authorize()
  }
}
</script>
<template>
<div class="align-items-start d-flex">
  Login View
  <span>Username</span>
  <input v-model="username" type="text">
  <span>Password</span>
  <input v-model="password" type="password">
  <button @click="doLogin">Login</button>
  <span>Don't have an account? <a href="/register">Register</a></span>
</div>
</template>
<style scoped>
</style>