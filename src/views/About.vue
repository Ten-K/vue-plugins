<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="goHome">goHome</button>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: 'Home',
  methods:{
    goHome(){
      this.$router.push('/')
    }
  }
}
</script>
