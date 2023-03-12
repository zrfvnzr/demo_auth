<script>
export default {
  name: 'Forgot',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    async resetPassword() {
      try {
        const response = await this.axios.post('/api/forgotPassword', {email: this.email})
        alert(response.data.message)
        location.href = '/reset'
      } catch (error) {
        alert(error.response.data.message)
      }  
    }
  }
}
</script>
<template>
<div class="align-items-start d-flex">
  Forgot Password
  <span>Email</span>
  <input v-model="email" type="text">
  <button @click="resetPassword()">Reset password</button>
  <span>This will send a link to your email containing the instructions to reset your password.</span>
</div>
</template>
<style scoped>
</style>