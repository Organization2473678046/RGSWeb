<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- or name="fade" -->
<<<<<<< HEAD
      <!-- <router-view :key="key"></router-view> -->
      <router-view/>
=======
      <router-view :key="key"/>
      <!--<router-view/>-->
>>>>>>> dev-v7
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
<<<<<<< HEAD
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
=======
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    }
>>>>>>> dev-v7
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
}
</style>
