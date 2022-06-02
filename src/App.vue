<template>
  <div>
    <div class="div_test">
      我是Vue项目啊 {{ username }}
    </div>
    <Button type="primary">Primary Button</Button>
  </div>
</template>
<script lang='js'>
import { ref } from 'vue';
import { Button } from 'ant-design-vue';
export default {
  components: { Button },
  setup() {
    let username = ref('helloworld');
    return {
      username
    };
  }
};
</script>
<style lang="less" scoped>
.div_test {
  color: red;
}
</style>