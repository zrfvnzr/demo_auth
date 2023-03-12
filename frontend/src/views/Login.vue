<script>
export default {
  name: 'Login',
  data() {
    return {
      email: '',
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
        if (!this.validateEmail()) {
          alert('Invalid email')
          return
        }
        const response = await this.axios.post('/api/login', {email: this.email, password: this.password})
        this.$router.push('/')
      } catch (error) {
        alert('Error')
        console.log('Error on Login.vue > doLogin()', error.response.data.message)
      }
    },
    validateEmail() {
      return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email))
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
  <span>Email</span>
  <input v-model="email" type="text">
  <span>Password</span>
  <input v-model="password" type="password">
  <button @click="doLogin">Login</button>
  <span>Don't have an account? <a href="/register">Register</a></span>
  <span>Forgot password? <a href="/forgot">Reset password</a></span>
</div>
</template>
<style scoped>
</style>