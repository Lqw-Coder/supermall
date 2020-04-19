<template>
  <div>
    <button @click="testToast">测试</button>
    <h2>分类</h2>
  </div>
</template>

<script>
  export default {
    name: "Category",
    methods:{
      testToast(){
        this.$toast.show('测试成功')
      }
    }
  }
</script>

<style scoped>

</style>
