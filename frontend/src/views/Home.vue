<script>
export default {
  name: 'Home',
  data() {
    return {
      user: {}
    }
  },
  methods: {
    async authorize() {
      try {
        const response = await this.axios.post('/api/authorize')
        this.user = response.data
      } catch (error) {
        // alert('Error')
        console.log('Error on Home.vue > authorize()', error.response.data.message)
        this.$router.push('/login')
      }
    },
    async doLogout() {
      try {
        const response = await this.axios.post('/api/logout')
        this.$router.push('/login')
      } catch (error) {
        alert('Error')
        console.log('Error on Home.vue > doLogout()', error.respone.data.message)
      }
    }
  },
  async mounted() {
    await this.authorize()
  }
}
</script>
<template>
<div>
  Home View
  <div>
    Logged in as <b>{{ user.username }}</b> with role <b>{{ user.role }}</b>
  </div>
  <div>
    <button @click="doLogout">Logout</button>
  </div>
</div>
</template>
<style scoped>
</style>