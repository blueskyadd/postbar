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
    var openid = this.$route.query.openid;
        if(typeof openid !== 'undefined') {
	          var exp = new Date();
            exp.setTime(exp.getTime() + 3600 * 1000);//过期时间60分钟
            document.cookie = 'openid=' + openid + ";expires=" + exp.toGMTString();
        }
        // 获取openid
        if(!this.getCookie('openid')) {
            // this.$conf.wxLogin
            this.$http.get(this.$conf.env.wxLogin + '?returnUrl=' + encodeURIComponent('http://192.168.43.236:8080') ).then(res =>{
                console.log(res)
            }).catch(err =>{
                console.log(err)
            })
            console.log('this.$conf.wxLogin',this.$conf.wxLogin,this.$conf.env.wxLogin + '&returnUrl=' +  encodeURIComponent('http://192.168.43.236:8080'))
            // location.href =this.$conf.env.wxLogin + '?returnUrl=' +  encodeURIComponent('http://192.168.43.236:8080');
        }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/1px.less';
@import '../static/font/iconfont.css';

</style>
