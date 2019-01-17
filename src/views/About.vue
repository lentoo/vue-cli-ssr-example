<template>
  <div class="about">
    <h1>This is an about page</h1>
    <welcome name="about"></welcome>
  </div>
</template>
<script>
import Welcome from '@/components/Welcome'
export default {
  name: 'ViewAbout',
  components: {
    Welcome
  }
}
</script>
<style module>
  .about {
    color: red;
  }
</style>