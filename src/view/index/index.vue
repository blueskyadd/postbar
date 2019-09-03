<template>
    <!-- <div  class="homeIndex" style="height:100%"> -->
            <!-- <tab :line-width=2 active-color='#119dfc' v-model="index" v-if="!isTablebar">
                <tab-item class="vux-center" :selected="demo2 === item" v-for="(item, index) in list2" @click="demo2 = item" :key="index">{{item}}</tab-item>
            </tab> -->
            <!-- <swiper v-model="index" height="100px" :show-dots="false">
                <swiper-item v-for="(item, index) in list2" :key="index"> -->
                    <div class="post_list" ref="navBar">
                        <div class="homeIndex_postList" v-if="isTablebar"   >
                            <ul class="titleList">
                                <li class=" vux-1px-b"><span>二手</span></li>
                                <li class="vux-1px-l vux-1px-b"><span>推荐</span></li>
                                <li class="vux-1px-l vux-1px-b"><span>热议</span></li>
                                <li class="vux-1px-l vux-1px-b"><span>娱乐</span></li>
                                <li><span>风景</span></li>
                                <li class="vux-1px-l "><span>风景</span></li>
                                <li class="vux-1px-l"><span>读书</span></li>
                                <li class="vux-1px-l " @click="goList"><span>查看全部</span></li>
                            </ul>
                            <h3 class="vux-1px-b">热议</h3>
                        </div>
                        <tab :line-width=2 active-color='#119dfc' v-model="index" v-if="!isTablebar">
                            <tab-item class="vux-center" :selected="demo2 === item" v-for="(item, index) in list2" @click="demo2 = item" :key="index">{{item}}</tab-item>
                        </tab>
                            <div class="scroller" ref="scroller">
                                <!-- <swiper v-model="index"  :show-dots="false">
                                <swiper-item v-for="(item, index) in list2" :key="index"> -->
                                <ul :style="{'padding-top':isTablebar?'':'1rem'}">
                                    <li  v-for="(item, index) in poatList" :key="index"  @click="golistDetaiil(item)">
                                        <header>
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
                                        <div  class="main-context">
                                            <p  class="forum-sub-title" >{{item.postDesc}}</p>
                                            <div class="sudoku">
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
                                                    <a class="item comment itemonly" :style="{color: item.isDianzan? '#119dfc':''}">
                                                        <i class="icon iconfont icon-dianzan"></i>
                                                        {{item.likeNum||0}}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li v-if="isLoader" class="isLoader">
                                        <load-more :show-loading="false" tip="已经加载全部数据" background-color="#fbf9fe"></load-more>
                                    </li>
                                </ul>
                                <!-- </swiper-item>
                        </swiper> -->
                            </div>
                          <button @click="goReleaseContent"><img src="../../assets/img/issueLu.png" alt=""></button>
                    </div>
                <!-- </swiper-item> -->
            <!-- </swiper> -->
        <!-- </div> -->
</template>
<script>
import {Scroller, Loading, LoadMore,Alert ,Tab, TabItem,Swiper, SwiperItem } from 'vux';
import wx from 'weixin-js-sdk' 
const list = () => ['精选', '美食', '电影', '酒店', '外卖','更多']
export default {
    name:'index',
    components:{Scroller, Loading, LoadMore,Alert,Tab, TabItem,Swiper, SwiperItem },
    data(){
        return{
            list2: list(),
            index: 0,
            demo2: '精选',
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
            isDianzan:false,
            showSearchLink: false,
            refrseh: true,
            isTablebar:true
        }
    },
    methods:{
        golistDetaiil(item){
            this.$router.push({path: '/listDetail',query:{id: item.postId,form:false}})
        },
        goReleaseContent(){
            var openid = this.$route.query.openid;
            if(typeof openid !== 'undefined') {
                var exp = new Date();
                exp.setTime(exp.getTime() + 3600 * 1000);//过期时间60分钟
                document.cookie = 'openid=' + openid + ";expires=" + exp.toGMTString();
            }
            // 获取openid
            if(this.getCookie('openid')==null) {
                window.location.href =this.$conf.env.wxLogin + '?returnUrl=' + encodeURIComponent('http://forum.vxiangwang.com');
            }else{
                this.$router.push({name:'releaseContent'})
            }
        },
        
        selPullUp () {
            console.log('加载')
            this.pagenumber += 1;
            this.refrseh = false;
            this.getPostList(this.pagenumber)

        },
        /**@name 加载数据 */
        getPostList(number,flag){
            console.log(number)
            var params = {
            	"channelCode": 0,//帖子频道 默认0 二手
                "openId": '',//用户ID
                "pageNo": number,//页码
                "pageSize": 10,//pageSize
            }
            this.$http.post(this.$conf.env.getPostList, params).then(res =>{
                if(res.status == '200'){
                    if(res.data.code == '001'){
                        if(res.data.data.returnData && res.data.data.returnData.length>0){
                            this.refrseh = true;
                            this.isLoader = false;
                        }else{
                            this.refrseh = false;
                            this.isLoader = true;
                        }
                        
                        this.poatList = number == 1 ? res.data.data.returnData : this.poatList.concat(res.data.data.returnData)
                    }else{
                        this.poatList = [];
                        this.isLoader = true;
                        this.refrseh = false;
                    }
                }else{
                    this.poatList = [];
                    this.isLoader = true;
                    this.refrseh = false;
                }
            }).catch(err =>{
                console.log(err)
            })
        },
        updateLikeCount(item){
            if(item.isDianzan) return;
            this.$http.post(this.$conf.env.updateLikeCount,{'openId':this.getCookie('openid'),'postId': item.postId}).then(res =>{
                console.log(res)
                this.$vux.toast.text('点赞成功');
                item.isDianzan = true;
                item.likeNum +=1;
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
        goList(){
            this.$router.push({name:'homeIndex'})
        }
    },
    mounted(){
        this.getPostList(1)
        var _that= this
        this.$bus.$on('changeTab',(data)=>{
            if(data){
                alert('a')
                // _that.$refs.scroller.scrollTop = 22
                _that.isTablebar = false;
                _that.demo2 = data;
            }
        })
        // 注册scroll事件并监听
        let _this = this;
        this.$refs.scroller.addEventListener('scroll', function () {
            var topScroll = _this.$refs.scroller.scrollTop ;
            // console.log(_this.$refs.scroller.scrollTop)
            //判断距离顶部的距离
            if (topScroll > 25 || topScroll == 25) {
                // console.log('开')
                _this.isTablebar =  false;

            } else {
                // console.log('关')
                 _this.isTablebar = true;
            }
            // 判断是否滚动到底部
            if (topScroll > _this.$refs.scroller.scrollHeight -  _this.$refs.scroller.clientHeight - 200 && _this.refrseh) {
                // 如果开关打开则加载数据
                _this.selPullUp()
            }
        });
        var openid = this.$route.query.openid;
        if(typeof openid !== 'undefined') {
	          var exp = new Date();
            exp.setTime(exp.getTime() + 3600 * 1000);//过期时间60分钟
            document.cookie = 'openid=' + openid + ";expires=" + exp.toGMTString();
        }
        if(this.getCookie('openid')==null) {
            window.location.href =this.$conf.env.wxLogin + '?returnUrl=' + encodeURIComponent('http://forum.vxiangwang.com');
        }
    }
};
</script>
<style lang="scss">
 .vux-swiper-item,.vux-slider,.vux-swiper{
    height: 100%!important;
}

.post_list {
    height: calc(100% - .88rem);
    overflow: hidden;
    .titleList{
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: .4rem .2rem .2rem;
    // padding-top: .2rem;
    border-radius: .3rem;
    overflow: hidden;
    background: linear-gradient(to right,#fa5956,#fb8650 54%);
        // background: linear-gradient(to right,#ffbc49,#ffd252);
    // background: #000 url('https://img.tukuppt.com/bg_grid/00/03/57/pEfqIMlZvO.jpg!/fh/350') 0 0 /100% 100%;
        // background: linear-gradient(to right,#34c2aa,#6cd557);
        background: linear-gradient(to right,#ffbc49,#ffd252);
            background: linear-gradient(to right,rgba(75, 143, 237, 1),#53bced);
    
    li{
        width: 24.9%;
        margin-bottom: 0;
        // margin-right: .01rem;
        height: 1rem;
        // margin-bottom: .02rem;
        background: transparent;
        // background: rgba(52, 194, 170,.6);
        // box-shadow: 0 .01rem .02rem .021rem #999;
        // border-radius: .05rem;
        font-size: .3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        padding: .2rem;
    }
    
    
}
h3{
        width: 100%;
        height: .88rem;
        font-size: .34rem;
        background: #fff;
        text-align: center;
        line-height: .88rem;
    }
    .scroller{
        height: 100%;
        overflow-y: scroll;
    }
    .scroller::-webkit-scrollbar{
        display: none;
    }
    .xs-plugin-pulldown-container, .xs-plugin-pullup-container{
        font-size: .32rem;
        color: #666;
    }
    .weui-dialog__hd{
        padding: 0;
    }
    .weui-dialog__btn_primary{
        color: #119dfc;
    }
  ul {
      height: 100%;
      height:calc(100% - 4rem);
      background: #f5f5f5;
    li {
      padding-top: 0.34rem;
      background: #fff;
      margin-bottom: .34rem;
    //   .homeIndex{
           
            // padding: .4rem .2rem .2rem;
            
        // }
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
