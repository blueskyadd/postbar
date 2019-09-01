<template>
     <div class="listDetail" ref='scrollList'>
         <div class="detail-header border-bottom">
            <div class="blue_kit_left"   @click="goBack" ></div>
            
         </div>
         <scroller v-model="scrollerStatus" lock-x scrollbar-y ref="scroller"
              :use-pullup="showUp" :use-pulldown='false' :pullup-config="upobj" @on-pullup-loading="selPullUp">
              <div id="scrollbar" style="margin-bottom:1rem;">
                  <div class="detail"  v-if="postDetail.userDto" >
                    <header>
                        <div class="photoImg">
                            <img :src="postDetail.userDto.headImg" alt="">
                        </div>
                        <div  class="content">
                            <h4 class="title">{{postDetail.userDto.nickName}}</h4> 
                            <div class="sub-title">
                                <span class="forumname">二手吧</span>
                                <!-- <span class="split"></span>  -->
                                <!-- <span class="createtime">{{$route.query.publishTime}}</span> -->
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
                        </div>
                        <!-- 评论 -->
                        <div class="comment">
                            <h3 class="line-bottom line-title border-bottom">评论</h3>
                            <div class="list" >
                                <div v-if="commentList.length >0" class="commentIn" v-for="(item,index) in commentList" :key="index">
                                    <img class="headImg" v-if="item.userInfo" :src="item.userInfo.headImg" alt="">
                                    <div class="commentText line-bottom">
                                        <p class="name" v-if="item.userInfo">{{processStr(item.userInfo.nickName, 11)}}</p>
                                        <div class="commentBox">
                                            <span class="time">{{item.commentTime}}</span>
                                            <!-- <p class="inforMore">
                                                <span class="del" v-if="item.isMyComment == 1" v-on:click="delComment(item.contentCommentId)"><i class="iconfont icon-caozuo-shanchu1"></i>删除</span>
                                                <span class="del" v-if="item.isMyComment != 1" v-on:click="replyComment(item.contentCommentId)"><i class="icon iconfont icon-xiaoxi"></i>回复</span>
                                                <span class="like" v-on:click="comLikeClick(item.clicked,item.clickNum,index,item.contentCommentId)">
                                                <i class="icon" v-bind:class="{active:item.clicked == 1}"></i>{{item.clickNum}}</span>
                                            </p> -->
                                        </div>
                                        <p class="textOne">{{item.commentContent}}</p>
                                        <!-- <div class="reply" v-if="item.parentComment">
                                            <p class="name" v-if='item.parentComment.commentCreator && item.parentComment.commentCreator.name'>{{processStr(item.parentComment.commentCreator.name, 11)}}</p>
                                            <p class="title" v-if="item.parentComment">{{item.parentComment.commentDesc}}</p>
                                        </div> -->
                                    </div>
                                </div>
                                <!-- <div class="noMore " v-if="hintNoMore">没有更多啦~</div> -->
                                <div class="noMore border-top" v-if="notComment">暂无评论</div>
                                <div class="noMore " v-if="hintNoMore">已显示全部评论</div>
                                <div class="noMore border-top" v-if="isLoading" >加载中~</div>
                                <div style="height:2rem;background:transparent"></div>
                                <!-- <div class="commentIn"></div> -->
                            </div>
                            <!-- <div class="noMore border-top" v-if="isLoading" style="background:none">加载中~</div> -->
                            
                        </div>
                    </div>
              </div>
         </scroller>
         <footer></footer>
         <footer class="border-top" v-if="isTextarea">
             <textarea name="" placeholder="友好的交流从此开始"  v-model="commentContent" id="" cols="30" rows="10"></textarea>
             <button @click="savePostComment()">发送</button>
         </footer>
         <footer class="border-top" style="justify-content: flex-end;" v-else>
             <div class="textarea" @click="setTextarea">友好的交流从此开始</div>
             <div  class="interaction" >
                <div class="wrap">
                    <a class="item comment itemonly" @click="upKey">
                        <input type="text" ref="upKey" style="display:none" @focus="upTheKey">
                        <i class="icon iconfont icon-xiaoxi"></i>
                        {{postDetail.postDetailDto.commentNum||0}}
                    </a>
                    <a class="item comment itemonly" @click="getShareInfo(item)">
                        <i class="iconfont icon-fenxiang1"></i>
                        {{postDetail.postDetailDto.shareNum||0}}
                    </a>
                    <a class="item comment itemonly" :style="{color: postDetail.alreadyLikePost ? '#119dfc' : ''}" @click="updateLikeCount(postDetail.postDetailDto)">
                        <i v-if="!postDetail.alreadyLikePost" class="icon iconfont icon-dianzan"></i>
                        <i v-else class="icon iconfont icon-dianzantianchong-"></i>
                        {{postDetail.postDetailDto.likeNum||0}}
                    </a>
                </div>
            </div>
         </footer>
         <!-- //大图展 -->
        <div v-transfer-dom v-if="postDetail.postDetailDto">
            <previewer :list="postDetail.postDetailDto.imgUrlList" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
        </div>
        <alert v-model="showSearchLink" title="分享" content="点击右上角按钮进行分享吧"></alert>
     </div>
</template>
<script>
import { Previewer, TransferDom, Scroller, Alert, Popover} from 'vux';
import wx from 'weixin-js-sdk';
import wxapi from '../../components/sdk';
export default {
    name:'listDetail',
    directives: {TransferDom},
    components: { Previewer, Scroller, Alert, Popover},
    data(){
        return{
            list: [],
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
            commentList:[ ],//评论
            commentContent: '',    
            postDetail:{},
            hintNoMore: false,
            showAll:false,
            notComment:false,
            isLoading:false,
            showUp: true,
            isbounce: false,
            scrollerStatus: {
                pullupStatus: 'default'
            },
            upobj: {
                content: '',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '加载中..',
                upContent: '加载中..',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            },
            pagenumber: 1,
            isDianzan: false,
            showSearchLink:false,
            isTextarea: false
        }
    },
    created(){
        this.$emit('showheader',false);
        this.getShareInfo()
    },
    destroyed(){
        this.$emit('showheader',true)
    },
    mounted(){
        //分享
        this.getPostDetail();
        this.getPostCommentDetail(1);
        var that = this;
        setTimeout(()=>{
            var box = document.getElementById('scrollbar')
            box.addEventListener('touchstart', function (e) {
                that.isTextarea = false;
            })
        },100)
    },
    methods:{
        goBack(){
            this.$route.params.form ?  this.$router.go(-1) : this.$router.replace({name:'index'})
           
        },
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
        setTextarea(){
            this.isTextarea = true;
        },
        savePostComment(){
            var openid = this.$route.query.openid;
            if(typeof openid !== 'undefined') {
                var exp = new Date();
                exp.setTime(exp.getTime() + 3600 * 1000);//过期时间60分钟
                document.cookie = 'openid=' + openid + ";expires=" + exp.toGMTString();
            }
            // 获取openid
            if(this.getCookie('openid')==null) {
                window.location.href =this.$conf.env.wxLogin + '?returnUrl=' + encodeURIComponent('http://forum.vxiangwang.com/#/');
            }else{
                var params ={
                    "commentContent": this.commentContent,//评价内容
                    "createBy": this.getCookie('openid'),//评论人
                    "parentCommentId": 0,//评论上级主键 默认0 无上级
                    "postId": this.$route.query.id,//帖子主键
                    "openId": this.getCookie('openid'),//微信用户openID
                }
                this.$http.post(this.$conf.env.savePostComment,params).then(res =>{
                    console.log(res)
                    this.$vux.toast.text('评论成功');
                    this.commentContent = '';
                    this.getPostCommentDetail(1);
                }).catch(err =>{
                    console.log(err)
                })
            }
            
        },
        showModuleAuto () {
        setTimeout(() => {
            AlertModule.hide()
        }, 3000)
        },
        upKey(){
            this.$refs.upKey.click()
        },
        upTheKey(){
            console.log('ss')
        },
        selPullUp(){
            console.log('加载')
            this.pagenumber += 1;
            
            this.getPostCommentDetail(this.pagenumber)
            this.$nextTick(() => {
                this.$refs.scroller.reset()
            })
            console.log('评论加载');
        },
        /**@name 获取帖子详情数据*/
        getPostDetail(){
            this.$http.get(this.$conf.env.getPostDetail + this.$route.query.id +'&openId=' + this.getCookie('openid')).then(res =>{
                console.log(res)
               
                if(res.data.data.postDetailDto.imgUrlList && res.data.data.postDetailDto.imgUrlList.length>0){
                    var arr = []
                    res.data.data.postDetailDto.imgUrlList.forEach( element =>{
                        var obj = {'src':element}
                        arr.push(obj)
                    })
                    res.data.data.postDetailDto.imgUrlList = arr
                }
                this.postDetail = res.data.data
            }).catch( err =>{
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
        /**@name 获取评论列表 */
        getPostCommentDetail(num){
            
            this.isLoading = true;
            var params ={
                "openId": this.getCookie('openid'),
                "pageNo": num,
                "pageSize": 10,
                "postId": this.$route.query.id
            }
            this.$http.post(this.$conf.env.getPostCommentDetail, params).then(res =>{
                 if(res.status == '200'){
                     this.isLoading = false;
                     if(res.data.data.returnData.postCommentDtoList && res.data.data.returnData.postCommentDtoList.length>0){
                        this.scrollerStatus.pullupStatus = 'default';
                        this.commentList = num == 1 ? res.data.data.returnData.postCommentDtoList : this.commentList.concat(res.data.data.returnData.postCommentDtoList)
                    }else{
                        num ==1 ? this.notComment = true : this.hintNoMore = true;
                        num ==1 ? this.hintNoMore = false : this.notComment = false;
                        this.scrollerStatus.pullupStatus = 'disabled';
                    }
                 }else{
                    num ==1 ? this.notComment = true : this.hintNoMore = true;
                    num ==1 ? this.hintNoMore = false : this.notComment = false;
                    this.scrollerStatus.pullupStatus = 'disabled';
                 }
                console.log(res.data.data.returnData.postCommentDtoList)
            }).catch(err =>{
                this.isLoading = false;
                num ==1 ? this.notComment = true : this.hintNoMore = true;
                num ==1 ? this.hintNoMore = false : this.notComment = false;
                this.scrollerStatus.pullupStatus = 'disabled';
                console.log(err)
            })
        },
        //点赞
        updateLikeCount(item){
            if(this.isDianzan) return;
            this.$http.post(this.$conf.env.updateLikeCount,{'openId': this.getCookie('openid'),'postId': item.postId}).then(res =>{
                console.log(res)
                if(res.data.code == '001'){
                    this.$vux.toast.text('点赞成功');
                    this.postDetail.alreadyLikePost = true
                    item.likeNum +=1;
                }else{
                    this.$vux.toast.text('你已经点过赞了');
                }
                
            }).catch(err =>{
                this.$vux.toast.text('点赞失败');
                console.log(err)
            })
        },
        processStr(str, n) {
            var l = str.length;
            if (l <= n) return str;
            return str.slice(0, l - (l - n));
        },
        getShareInfo(){
            this.$http.post(this.$conf.env.getShareInfo,{postId:this.$route.query.id}).then( option=>{
                this.$http.get(this.$conf.env.getWxJsSdkSignature  + "?url=" +encodeURIComponent(window.location.href)).then(res =>{
                    var optionObj={
                        title: this.processStr(option.data.data.postDesc, 7),
                        link: window.location.href,
                        imgUrl: option.data.data.imageUrl,
                        desc: option.data.data.postDesc
                    }
                    
                    // alert('下面弹出来的是link')
                    // alert(optionObj.link)

                    var params ={
                        "openId":this.getCookie('openid'),
                        "postId":this.$route.query.id
                    }
                    wxapi.wxRegister(res.data.data,optionObj,this,params);//data是微信配置信息，option是分享要配置的内容
                })
            }).catch(err =>{
                console.log(err)
            })
        },

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
    .weui-dialog__hd{
        padding: 0;
    }
    .weui-dialog__btn_primary{
        color: #119dfc;
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
          //点赞
           //点赞
          
          
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
                    // padding-bottom: .6rem;
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
                margin: -.3rem;
                font-size: .32rem;
                color: #999;
                text-align: center;
                line-height: 1rem;
                background: #fff;
            }
        }
    }
   footer{
       position: fixed;
        width: 100%;
        height: 1rem;
        background: #fff;
        bottom: 0;
        left: 0;
        // align-items: center;
        display: flex;
        justify-content: space-between;
        padding: 0.1rem .34rem;
        textarea, .textarea{
            font-size: .3rem;
            // border: 1px solid #ddd;
            line-height: .35rem;
            border-radius: .5rem;
            width: 5.2rem;
            background: #f5f5f5;
            padding: 0.15rem .25rem;

        }
        .textarea{
            width:3rem;
            font-size: .3rem;
            flex: 1;
            color: #999;
        }
        button{
            padding: .17rem .2rem;
            background:#119dfc ;
            font-size: .3rem;
            color:#fff;
            width: 1.3rem;
            border-radius: .06rem;
        }
   }
//    .popover-content{
//         position: fixed;
//         right: .4rem;
//         bottom: 2.4rem;
//         display: flex;
//         background: #fff;
//         border-radius: .5rem;
//         overflow: hidden;
//         height: 1rem;
//        button{
//            width: 1rem;
//             border:0;
//             height: 1rem;
//             border-radius: 50%;
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             background: #119dfc;
           
//             img{
//                 width:80%;
//                 height: 80%;
//             }
//        }
        .interaction{
            margin: 0 0 0 .34rem;
            font-size: .24rem;
            // width: 2.7rem;
            
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
            .item{
                color: #666;
                margin-right: .2rem;
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
        
//    }
}

</style>
