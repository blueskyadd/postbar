<template>
     <div class="listDetail" ref='scrollList'>
         <div class="detail-header">
            <div class="blue_kit_left" @click="$router.go(-1)"></div>
         </div>
         <scroller v-model="scrollerStatus" lock-x scrollbar-y ref="scroller"
              :use-pullup="showUp" :use-pulldown='false' :pullup-config="upobj" @on-pullup-loading="selPullUp">
              <div>
                  <div class="detail"  v-if="postDetail.userDto" >
                    <header>
                        <div class="photoImg">
                            <img :src="postDetail.userDto.headImg" alt="">
                        </div>
                        <div  class="content">
                            <h4 class="title">{{postDetail.userDto.nickName}}</h4> 
                            <div class="sub-title">
                                <span class="forumname">二手吧</span>
                                <span class="split"></span> 
                                <span class="createtime">{{$route.params.publishTime}}</span>
                            </div>
                        </div>
                    </header>
                    <div  class="main-context">
                            <p  class="forum-sub-title">{{postDetail.postDetailDto.postDesc}}</p>
                            <div class="sudoku" >
                                <div class="sudoku-wrap">
                                    <span class="video-item">
                                        <img alt="" v-if="postDetail.postDetailDto" class="previewer-demo-img" v-for="(item, index) in postDetail.postDetailDto.imgUrlList" :src="item.src" :key="index" @click="show(index)" :data-src="item"  lazy="loaded">
                                    </span>
                                </div>
                            </div>
                            <div  class="interaction">
                            <div class="wrap">
                                <a class="item comment itemonly">
                                    {{postDetail.postDetailDto.commentNum || 0}}
                                </a>
                                <a class="item comment itemonly">
                                    {{postDetail.postDetailDto.shareNum || 0}}
                                </a>
                                <a class="item comment itemonly">
                                    {{postDetail.postDetailDto.likeNum || 0}}
                                </a>
                            </div>
                        </div>
                        </div>
                        <!-- 评论 -->
                        <div class="comment">
                            <h3 class="line-bottom line-title border-bottom">评论</h3>
                            <div class="list" v-if="commentList.length >0">
                                <div class="commentIn" v-for="(item,index) in commentList" :key="index">
                                    <img class="headImg" v-if="item.commentCreator.image" :src="item.commentCreator.image" alt="">
                                    <div class="commentText line-bottom">
                                        <p class="name">{{processStr(item.commentCreator.name, 11)}}</p>
                                        <div class="commentBox">
                                            <span class="time">{{item.commentTime}}</span>
                                            <p class="inforMore">
                                                <span class="del" v-if="item.isMyComment == 1" v-on:click="delComment(item.contentCommentId)">删除</span>
                                                <span class="del" v-if="item.isMyComment != 1" v-on:click="replyComment(item.contentCommentId)">回复</span>
                                                <span class="like" v-on:click="comLikeClick(item.clicked,item.clickNum,index,item.contentCommentId)">
                                                <i class="icon" v-bind:class="{active:item.clicked == 1}"></i>{{item.clickNum}}</span>
                                            </p>
                                        </div>
                                        <p class="textOne">{{item.commentDesc}}</p>
                                        <div class="reply" v-if="item.parentComment">
                                            <p class="name" v-if='item.parentComment.commentCreator && item.parentComment.commentCreator.name'>{{processStr(item.parentComment.commentCreator.name, 11)}}</p>
                                            <p class="title" v-if="item.parentComment">{{item.parentComment.commentDesc}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="noMore border-top" v-if="isLoading" style="background:none">加载中~</div>
                            <div class="noMore border-top" v-if="hintNoMore">没有更多啦~</div>
                            <div class="noMore border-top" v-if="showAll">已显示全部评论</div>
                            <div class="noMore border-top" v-if="notComment">暂无评论</div>
                        </div>
                    </div>
              </div>
         </scroller>
         <!-- //大图展 -->
        <div v-transfer-dom v-if="postDetail.postDetailDto">
            <previewer :list="postDetail.postDetailDto.imgUrlList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
        </div>
     </div>
</template>
<script>
import { Previewer, TransferDom, Scroller } from 'vux';
export default {
    name:'listDetail',
    directives: {TransferDom},
    components: { Previewer, Scroller},
    data(){
        return{
            list: [{
                    msrc: 'http://ww1.sinaimg.cn/thumbnail/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
                    src: 'http://ww1.sinaimg.cn/large/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
                    w: 800,
                    h: 400
                },
                {
                    msrc: 'http://ww1.sinaimg.cn/thumbnail/663d3650gy1fplwvqwuoaj20xc0p0t9s.jpg',
                    src: 'http://ww1.sinaimg.cn/large/663d3650gy1fplwvqwuoaj20xc0p0t9s.jpg',
                    w: 1200,
                    h: 900
                }, {
                    msrc: 'http://ww1.sinaimg.cn/thumbnail/663d3650gy1fplwwcynw2j20p00b4js9.jpg',
                    src: 'http://ww1.sinaimg.cn/large/663d3650gy1fplwwcynw2j20p00b4js9.jpg'
                }],
            options: {
                getThumbBoundsFn (index) {
                // find thumbnail element
                let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
                // get window scroll Y
                let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
                // optionally get horizontal scroll
                // get position of element relative to viewport
                let rect = thumbnail.getBoundingClientRect()
                // w = width
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
                // Good guide on how to get element coordinates:
                // http://javascript.info/tutorial/coordinates
                }
            },
            commentList:[
                {
                    'commentCreator':{
                        'image':'http://ww1.sinaimg.cn/large/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
                        'name':'张大侠',
                    },
                    'commentTime':'2019-02-20',
                    'isMyComment':'1',
                    'clickNum':'30',
                    'commentDesc':'不错奴才的',
                    'parentComment':{
                        'commentCreator':{
                           'name':'叶卿卿' ,
                           'commentDesc':'百八十度厄u肥肉发'
                        }
                    },
                    'contentCommentId':'09'

                }
            ],//评论
            postDetail:{},
            hintNoMore: true,
            showAll:false,
            notComment:false,
            isLoading:false,
            showUp: true,
            isbounce: false,
            scrollerStatus: {
                pullupStatus: 'default'
            },
            upobj: {
                content: '请上拉刷新数据',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '请上拉刷新数据',
                upContent: '请上拉刷新数据',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            },

        }
    },
    created(){
        this.$emit('showheader',false)
    },
    destroyed(){
        this.$emit('showheader',true)
    },
    mounted(){
        this.getPostDetail()
    },
    methods:{
        logIndexChange (arg) {
            console.log(arg)
        },
        show (index) {
            this.$refs.previewer.show(index)
        },
        processStr(str, n) {
             if(!str) return
            var l = str.length;
            if (l <= n) return str;
            return str.slice(0, l - (l - n)) + "...";
        },
        delComment(id) {//删除评论
        },
        //回复评论
        replyComment(id){

        },
        selPullUp(){
            console.log('评论加载');
        },
        /**@name 获取帖子详情数据*/
        getPostDetail(){
            console.log(this.$route.params.id )
            var res = {
  "code": "001",
  "info": "操作成功",
  "data": {
    "postDetailDto": {
      "postId": 1,
      "postDesc": "测试帖aaa",
      "postChannel": 0,
      "imgUrlList": [
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1901600690,2735789840&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1901600690,2735789840&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1901600690,2735789840&fm=26&gp=0.jpg",
        "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1901600690,2735789840&fm=26&gp=0.jpg"
      ],
      "shareNum": 0,
      "commentNum": 0
    },
    "userDto": {
      "openId": "oDvUZ0orKKyaOvEK-OZjPplpH4Sk",
      "nickName": "tony198x",
      "headImg": "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1901600690,2735789840&fm=26&gp=0.jpg",
      "sex": 1
    }
  },
  "successful": true
}
            // this.$http.get(this.$conf.env.getPostDetail + this.$route.params.id ).then(res =>{
            //     console.log(res)
                if(res.data.postDetailDto.imgUrlList && res.data.postDetailDto.imgUrlList.length>0){
                    var arr = []
                    res.data.postDetailDto.imgUrlList.forEach( element =>{
                        var obj = {'src':element}
                        arr.push(obj)
                    })
                    res.data.postDetailDto.imgUrlList = arr
                }
                this.postDetail = res.data
            // }).catch( err =>{
            //     console.log(err)
            // })
        }

    }
}
</script>
<style lang="scss">
.listDetail{
    overflow-x: hidden;
    background: #f5f5f5;
    height: 100%;
    width: 100%;
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
        div{
            height: .24rem;
            width: .24rem;
            transform:rotate(135deg);
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            
        }
        
    }
    .detail{
        width: 100%;
        overflow-x: hidden;
        height: calc(100% - .88rem);
        
        padding-top: .17rem;
        header {
        height: 1.04rem;
        display: flex;
        padding: .34rem  0.34rem 0;
        background: #fff;
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
      //内容
      .main-context{
          margin-bottom: .34rem;
          padding-bottom: .34rem;
          overflow: hidden;
          background: #fff;
          margin-top: -.02rem;
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
                text-indent: .2rem;
                padding-top: .34rem;
                line-height: .46rem;
                font-size: .3rem;
                margin-left: .34rem;
                margin-right:.34rem;
                text-align: left;
                color: #000; 
                text-align: justify;
          }
          //图片
          .sudoku{
              position: relative;
               margin: 0 .34rem;
               .sudoku-wrap{
                   display: flex;
                    -webkit-box-orient: horizontal;
                    -webkit-box-direction: normal;
                    flex-direction: column;
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
                        // height: 3.41rem;
                        overflow: hidden;
                        img{
                            width:100%;
                            margin-top: .34rem;
                        }
                    }
               }
          }
          
      }
      //评论
      .comment {
            margin-top: .36rem;
            h3 {
                position: relative;
                height: 1rem;
                text-align: center;
                line-height: 1rem;
                color: #333;
                font-size: .4rem;
                background: #fff;
            }
            .commentIn {
                position: relative;
                padding: .34rem 0rem 0rem 1.3rem;
                background: #fff;
                .headImg {
                    position: absolute;
                    left: .34rem;
                    top: .34rem;
                    width: .7rem;
                    height: .7rem;
                    background: #acc4dd;
                    border-radius: 50%;
                }
                .name {
                    font-weight: bold;
                    line-height: .4rem;
                    font-size: .28rem;
                    color: #333;
                }
                .textOne {
                    font-size: .3rem;
                    color: #333;
                    line-height: .48rem;
                    padding-bottom: .34rem;
                }
                .commentText {
                    position: relative;
                    padding-bottom: .6rem;
                    padding-right: .42rem;
                }
                .commentBox {
                    display: flex;
                    justify-content: space-between;
                    font-size: .24rem;
                    color: #999;
                    .inforMore, .like{
                        line-height: .24rem;
                        display: flex;
                    }
                    .like{
                        display: flex;
                    }
                    .inforMore .like .icon {
                        display: inline-block;
                        width: 0.42rem;
                        height: 0.44rem;
                        // background: url("../../images/like2.png") no-repeat center;
                        background-size: 0.42rem 0.44rem;
                        margin-right: .22rem;
                        .active {
                            // background: url("../../images/likeActive.png") no-repeat center;
                            background-size: 0.42rem 0.44rem;
                        }
                    }
                }
                .reply {
                    font-size: .38rem;
                    padding: .17rem 1.33rem .2rem .42rem;
                    box-sizing: border-box;
                    background: #f2f2f2;
                    border-left: .1rem solid #ddd;
                    .name {
                        color: #119dfc;
                        font-weight: normal;
                    }
                    .title {
                        color: #808080;
                        font-size: .38rem;
                        line-height: .5rem;
                    }
                }
                .del {
                    margin-right: .6rem;
                }
                .lookMore {
                    position: relative;
                    text-align: center;
                    color: #333;
                    font-size: .36rem;
                    color: #999;
                    line-height: 1.32rem;
                    background: #fff;
                }
                
            }
            .noMore {
                margin: -.1rem;
                font-size: .32rem;
                color: #999;
                text-align: center;
                line-height: 1.32rem;
                background: #fff;
            }
        }
    }
   
}

</style>
