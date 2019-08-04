<template>
  <div id="app">
    <appHeader v-if="isShowHeader"/>
    <router-view  @showheader='showheader'/>
  </div>
</template>

<script>
import appHeader from './components/appheader.vue'
export default {
  name: 'App',
  components:{appHeader},
  data(){
    return{
      isShowHeader: true
    }
    
  },
  methods:{
    showheader(flag){
      this.isShowHeader = flag
    }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
</style>
