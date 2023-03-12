<script>
export default {
  name: 'Register',
  data() {
    return {
      email: '',
      password: '',
      role: 'role1'
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
    async doRegister() {
      try {
        if (!this.validateEmail()) {
          alert('Invalid email')
          return
        }
        const response = await this.axios.post('/api/register', {email: this.email, password: this.password, role: this.role})
        this.$router.push('/')
      } catch (error) {
        alert(error.response.data.message)
        console.log('Error on Register.vue > doRegister()', error.response.data.message)
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
  Register View
  <span>Email</span>
  <input v-model="email" type="email">
  <span>Password</span>
  <input v-model="password" type="password">
  <span>Role</span>
  <select v-model="role">
    <option value="role1">Role 1</option>
    <option value="role2">Role 2</option>
    <option value="role3">Role 3</option>
    <option value="role4">Role 4</option>
  </select>
  <button @click="doRegister">Register</button>
  <span>Already have an account? <a href="/login">Login</a></span>
</div>
</template>
<style scoped>
</style>