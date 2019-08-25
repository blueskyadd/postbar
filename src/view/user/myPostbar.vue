<template>
    <div class="my_post_list">
        <div class="detail-header border-bottom">
            <div class="blue_kit_left"   @click="$router.go(-1)" ></div>
         </div>
        <scroller v-model="scrollerStatus" :top='88' lock-x scrollbar-y ref="scroller"
            :use-pullup="showUp"   :pullup-config="upobj" @on-pullup-loading="selPullUp">
            <ul>
                <li  v-for="(item, index) in poatList" :key="index" >
                    <header @click="golistDetaiil(item)">
                        <div class="photoImg"><img :src="item.headImg" alt=""></div>
                        <div  class="content">
                            <h4 class="title">{{item.userName}}</h4> 
                            <div class="sub-title">
                                <span class="forumname">二手吧</span>
                                <span class="split"></span> 
                                <span class="createtime">{{item.publishTime}}</span>
                            </div>
                        </div>
                    </header>
                    <div  class="main-context" >
                        <p  class="forum-sub-title" @click="golistDetaiil(item)">{{item.postDesc}}</p>
                        <div class="sudoku" @click="golistDetaiil(item)">
                            <div class="sudoku-wrap">
                                <span class="img-item" v-for="(imglist, index) in item.postImgList" :key="index" v-if="index < 3">
                                    <img alt="" :src="imglist">
                                </span>
                            </div>
                        </div> 
                        <div  class="interaction">
                            <div class="wrap">
                                <a class="item comment itemonly" >
                                    <i class="icon iconfont icon-xiaoxi"></i>
                                    {{item.commentNum||0}}
                                </a>
                                <a class="item comment itemonly">
                                    <i class="iconfont icon-fenxiang1"></i>
                                    {{item.shareNum||0}}
                                </a>
                                <a class="item comment itemonly" :style="{color: item.isDianzan? '#119dfc':''}" >
                                    <i class="icon iconfont icon-dianzan"></i>
                                    {{item.likeNum||0}}
                                </a>
                                <a class="item comment itemonly" @click.stop="deleteMyPost(item,index)">
                                    <i class="iconfont icon-caozuo-shanchu1 "></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </li>
                <li v-if="isLoader" class="isLoader">
                    <load-more :show-loading="false" tip="已经加载全部数据" background-color="#fbf9fe"></load-more>
                </li>
            </ul>
        </scroller>
        <loading v-model="showloading" :text="textloading"></loading>
        <button @click.stop="goReleaseContent"><img src="../../assets/img/issueLu.png" alt=""></button>
    </div>
</template>
<script>
import {Scroller, Loading, LoadMore } from 'vux';
import wx from 'weixin-js-sdk' 
export default {
    name:'myPostbar',
    components:{Scroller, Loading, LoadMore},
    data(){
        return{
            poatList:[],
            showloading: false,//加载logo
            textloading: '加载中',
            isbounce: false,
            showUp: true,
            showDown: true,
            isShow: false,//是否显示scroller,第一次请求数据过程中隐藏插件，不隐藏的时候会显示“请上拉刷新数据”的字样
            upobj: {
                content: '',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '释放后加载',
                upContent: '',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            },
            pulldownDefaultConfig : {
                content: '',
                height: 40,
                autoRefresh: false,
                downContent: '下拉刷新',
                upContent: '释放后刷新',
                loadingContent: '正在刷新...',
                clsPrefix: 'xs-plugin-pulldown-'
            },
            scrollerStatus: {
                pullupStatus: 'default'
            },
            pagenumber: 1,
            isLoader: false,
            isDianzan:false
        }
    },
    created(){
        this.$emit('showheader',false)
    },
    destroyed(){
        this.$emit('showheader',true)
    },  
    methods:{
        golistDetaiil(item){
            this.$router.push({path: '/listDetail',query:{id: item.postId,publishTime: item.publishTime}})
        },
        goReleaseContent(){
           
            // var openid = this.$route.query.openid;
            // if(typeof openid !== 'undefined') {
            //     var exp = new Date();
            //     exp.setTime(exp.getTime() + 3600 * 1000);//过期时间60分钟
            //     document.cookie = 'openid=' + openid + ";expires=" + exp.toGMTString();
            // }
            // // 获取openid
            // if(this.getCookie('openid')==null) {
            //     window.location.href =this.$conf.env.wxLogin + '?returnUrl=' + encodeURIComponent('http://forum.vxiangwang.com/#/');
            // }else{
                this.$router.push({name:'releaseContent'})
            // }
        },
        
        selPullUp () {
            console.log('加载')
            this.pagenumber += 1;
            this.getPostList(this.pagenumber)
            this.$nextTick(() => {
                this.$refs.scroller.reset()
            })
        },
        /**@name 加载数据 */
        getPostList(number,flag){
            console.log(number)
            var params = {
            	"channelCode": 0,//帖子频道 默认0 二手
                "openId": this.getCookie('openid'),//用户ID
                "pageNo": number,//页码
                "pageSize": 10,//pageSize
            }
            this.$http.post(this.$conf.env.getMyPostList, params).then(res =>{
            console.log('aaaa')
                if(res.status == '200'){
                    if(res.data.code == '001'){
                        if(res.data.data.returnData && res.data.data.returnData.length>0){
                            this.scrollerStatus.pullupStatus = 'default';
                            res.data.data.returnData.forEach(element => {
                                // element.isDianzan = false;
                            });
                            this.$nextTick(() => {
                                this.$refs.scroller.reset()
                            })
                            // flag ? this.$refs.scroller.donePulldown() : ''
                            this.isLoader = false;
                        }else{
                            this.scrollerStatus.pullupStatus = 'disabled';
                            this.isLoader = true;
                        }
                        
                        this.poatList = number == 1 ? res.data.data.returnData : this.poatList.concat(res.data.data.returnData)
                    }else{
                        this.poatList = [];
                        this.isLoader = true;
                        this.scrollerStatus.pullupStatus = 'disabled';
                    }
                }else{
                    this.poatList = [];
                    this.isLoader = true;
                     this.scrollerStatus.pullupStatus = 'disabled';
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        updateLikeCount(item){
            if(item.isDianzan) return;
            this.$http.post(this.$conf.env.updateLikeCount,{'openId':'0','postId': item.postId}).then(res =>{
                console.log(res)
                this.$vux.toast.text('点赞成功');
                item.isDianzan = true;
                item.likeNum +=1;
            }).catch(err =>{
                console.log(err)
            })
        },
        deleteMyPost(item,index){
            this.$http.get(this.$conf.env.deleteMyPost+'?openId=' + this.getCookie("openid") +'&postId=' + item.postId).then(res =>{
                this.$vux.toast.text('删除成功');
                this.poatList.splice(index, 1);
            }).catch(err =>{
                console.log(err)
            })
        },
        getCookie(name) {
            var arr;
            var reg = new RegExp('(^| )' +name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },
           //分享
        getShareInfo(item){
            this.$http.post(this.$conf.env.getShareInfo,{postId:item.postId}).then(res =>{
                console.log(res)
                this.search(res.data.data)
            }).catch(err =>{
                console.log(err)
            })
        },
        search(data){
        this.$http.get(this.$conf.env.getWxJsSdkSignature  + "?url=" +encodeURIComponent(window.location.href)).then(res=>{
            
            console.log(res.data.data.signature)
            wx.config({
                debug: true,
                appId: res.data.data.appId,
                timestamp: res.data.data.timestamp,
                nonceStr: res.data.data.nonceStr,
                signature: res.data.data.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'getLocation'
                ]
            });
            console.log(data.postDesc)
            wx.ready(function () {
                // //分享朋友圈
                wx.onMenuShareTimeline({
                    title: data.postDesc,
                    desc: data.postDesc,
                    imgUrl: data.imageUrl,
                    link: res.data.data.url,
                    trigger: function (res) {console.lg('trigger') },
                    success: function (res) {console.log('success') },
                    cancel: function (res) {console.log('cencel') },
                    fail: function (res) { console.log('fail')}
                });
                // //分享朋友
                wx.onMenuShareAppMessage({
                    title: data.postDesc,
                    desc: data.postDesc,
                    imgUrl: data.imageUrl,
                    link: res.data.data.url,
                    trigger: function (res) { },
                    success: function (res) { },
                    cancel: function (res) { },
                    fail: function (res) { }
                });
            });
        })
           
        }
    },
    activated () {
      this.$refs.scroller.reset()
    },
    mounted(){
        this.getPostList(1)
        //  console.log('this.$conf.wxLogin',this.$conf.env.wxLogin)
        this.$nextTick(() => {
            this.$refs.scroller.reset({top: 0})
            
        })
        var openid = this.$route.query.openid;
        // alert(openid)
        if(typeof openid !== 'undefined') {
	          var exp = new Date();
            exp.setTime(exp.getTime() + 3600 * 1000);//过期时间60分钟
            document.cookie = 'openid=' + openid + ";expires=" + exp.toGMTString();
        }
        // 获取openid
        // alert(this.getCookie('openid'))
        if(this.getCookie('openid')==null) {
            // window.location.href =this.$conf.env.wxLogin + '?returnUrl=' + encodeURIComponent('http://forum.vxiangwang.com/#/');
        }
    }
};
</script>
<style lang="scss">
.my_post_list {
    height: 100%;
    // margin-bottom: .1rem;
    overflow: hidden;
    .xs-plugin-pulldown-container, .xs-plugin-pullup-container{
        font-size: .32rem;
        color: #666;
    }
    .detail-header{
        height: .88rem;
        line-height: .88rem;
        color: #000;
        background: #fff;
        padding: 0 .34rem;
        display: flex;
        align-items: center;
        // text-align: center;
        div{
            height: .24rem;
            width: .24rem;
            transform:rotate(135deg);
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            
        }
    }
  ul {
      height: 100%;
      background: #f5f5f5;
    li {
      padding-top: 0.34rem;
      background: #fff;
      margin-bottom: .34rem;
      header {
        height: 0.7rem;
        display: flex;
        margin: 0  0.34rem;
        .photoImg {
          width: 0.7rem;
          height: 0.7rem;
          overflow: hidden;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: .16rem;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .content{
            -webkit-box-flex: 1;
            -webkit-flex: 1;
            -ms-flex: 1;
            flex: 1;
            text-align: left;
            .title{
                font-size: .28rem;
                color: #333;
                font-weight: 400;
            }
            .sub-title{
                font-size: .24rem;
                color: #999;
                .split{
                    position: relative;
                    display: inline-block;
                    top: 1px;
                    margin: 0 .14rem;
                    width: 1px;
                    height: .2rem;
                    background: #999;
                    transform: scaleX(.5);
                }
            }
        }
      }
      .main-context{
          //标题
          .forum-title{
            line-height: .48rem;
            font-size: .32rem;
            margin: .26rem .34rem .08rem;
            text-align: left;
            color: #000;
          }
          //内容
          .forum-sub-title{
                line-height: .4rem;
                font-size: .28rem;
                margin-left: .34rem;
                margin-right:.34rem;
                text-align: left;
                color: #666;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
          }
          //图片
          .sudoku{
              position: relative;
               margin: 0 .34rem;
               .sudoku-wrap{
                   display: flex;
                    -webkit-box-orient: horizontal;
                    -webkit-box-direction: normal;
                    flex-flow: row nowrap;
                    .img-item{
                        display: block;
                        width:2.16rem;
                        height: 2.16rem;
                        -webkit-background-size: cover;
                        background-size: cover;
                        margin-right: 8px;
                        margin-top: 9px;
                        background-color: #eee;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                    //视频
                    .video-item{
                        width: 100%;
                        height: 3.41rem;
                        overflow: hidden;
                        img{
                            width:100%;
                        }
                    }
               }
          }
          //点赞
          .interaction{
                margin: 0 .34rem;
                font-size: .24rem;
                .wrap{
                    display: flex;
                    flex-flow: row wrap;
                    justify-content: flex-end;
                    height: .88rem;
                    line-height: .88rem;
                    .itemonly{
                        text-align: right;
                        display: inline-block;
                        color: #666;
                        i{
                            font-size: .4rem;
                            
                        }
                    }
                    .active{
                            color: #119dfc;
                        }
                    .item{
                        color: #666;
                        margin-right: .34rem;
                        .icon-comment{
                            position: relative;
                            top: -1px;
                            width: .36rem;
                            height: .36rem;
                            vertical-align: middle;
                        }
                    }
                    .itemonly{
                        text-align: right;
                    }
                }
          }
      }
    }
    .isLoader{
        height: 1rem;
        font-size: .3rem;
        text-align: center;
        // margin: 0;
        padding: 0;
        background: #f5f5f5;
    }
  }
  button{
        width: 1rem;
        border:0;
        height: 1rem;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #119dfc;
        position: fixed;
        right: .4rem;
        bottom: 2.4rem;
        img{
            width:80%;
            height: 80%;

        }
  }
}
</style>
