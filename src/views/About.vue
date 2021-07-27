<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="goHome">goHome</button>
    <br />
    state:{{$store.state.age}}
    <br />
    getter：{{$store.getters.myAge}}
    <br />
    同步commit: <button @click="syncAdd">+1</button>
    <br />
    异步dispatch:延迟1s <button @click="add">+10</button>
    <br />
    {{$store.state.a.x}}
    <br />
    changeX <button @click="changeX">100</button>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: 'Home',
  mounted(){
    console.log('store',this.$store)
  },
  methods: {
    changeX(){
      this.$store.commit('changeX')
    },
    syncAdd() {
      this.$store.commit('syncAdd',1)
    },
    add() {
      this.$store.dispatch('add',10)
    },
    goHome() {
      this.$router.push('/')
    },
  },
}
</script>
