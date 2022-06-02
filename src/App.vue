<template>
  <div class="div_test">
    我是Vue项目啊 {{ username }}
  </div>
</template>
<script lang='js'>
import { ref } from 'vue';
export default {
  setup() {
    let username = ref('helloworld');
    return {
      username
    };
  }
};
</script>
<style lang="less" scoped>
.div_test{
  color: red;
}
</style>