<template>
  <div id="app">
    <appHeader v-if="isShowHeader"/>
    <router-view  @showheader='showheader'/>
  </div>
</template>

<script>
import appHeader from './components/appheader.vue'
import { all } from 'q';
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
    },
    getCookie(name) {
        var arr;
        var reg = new RegExp('(^| )' +name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    },
  },
  mounted(){
    
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../static/font/iconfont.css';

</style>
