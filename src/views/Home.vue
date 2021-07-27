<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button @click="goAbout">goAbout</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  methods:{
    goAbout(){
      this.$router.push('/about')
    }
  }
}
</script>
