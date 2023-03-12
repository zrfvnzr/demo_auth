<script>
export default {
  name: 'Reset',
  data() {
    return {
      email: '',
      token: '',
      pw: '',
      confirm_pw: ''
    }
  },
  methods: {
    async resetPassword() {
      try {
        if (this.email == '' || this.token == '' || this.pw == '' || this.confirm_pw == '') {
          alert('Input cannot be blank')
          return
        }
        if (this.pw != this.confirm_pw) {
          alert('Passwords do not match')
          return
        }
        const response = await this.axios.post('/api/resetPassword', {email: this.email, token: this.token, pw: this.pw})
        alert(response.data.message)
        location.href = '/login'
      } catch (error) {
        alert('Error')
        console.log('Error on Reset.vue > resetPassword()', error)
      }
    }
  }
}
</script>
<template>
<div class="align-items-start d-flex">
  Reset Password
  <span>Email</span>
  <input v-model="email" type="text">
  <span>Token</span>
  <input v-model="token" type="text">
  <span>New Password</span>
  <input v-model="pw" type="password">
  <span>Confirm New Password</span>
  <input v-model="confirm_pw" type="password">
  <button @click="resetPassword">Reset Password</button>
</div>
</template>
<style scoped>
</style>