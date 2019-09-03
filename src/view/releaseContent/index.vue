<template>


    <div class="releaseContent">
        <div class="Content-header">
            <div class="blue_kit_left" @click="$router.go(-1)">
            </div>
            <div class="title">
                发帖
            </div>
            <button @click="updataPost()">发布</button>
         </div>
        <div class="content_main">
            <div class="infocontent">
                <div class="contents">
                    <div class="textarea">
                        <textarea ref="textareass" id="textareass"  v-model="contents" class="uinputs" placeholder="来吧，尽情发挥吧" ></textarea>
                    </div>
                    <span class="fontNum"><i :style="{'color':contents.length > 500 ? '#fb3d3d' : '#999999'}">{{contents.length}}</i>/500</span>
                </div>
            </div>
            <div class="detailphoto">
                <div v-for="(item, index) in detailphone" :key="index" class="dragpic">
                    <i class="iconfont icon-close delete" @click.stop="deleteDataPic(item,index)"></i>
                    <img @click="show(index)" class="previewer-demo-img"  :src="item.src"  alt="">
                </div>
                <div class="btn_upload" v-if="detailphone.length<9"><span  @click="onPickFile"><input ref="fileInput"  accept="image/*"  @change="getFile"   style="display: none" type="file" ></span></div>
            </div>
        </div>
         <!-- //大图展 -->
        <div v-transfer-dom v-if="detailphone">
            <previewer :list="detailphone" ref="previewer" :options="options"></previewer>
        </div>
        <div v-transfer-dom>
            <popup v-model="showAccounts" height="4rem" is-transparent>
                <div style="width: 95%;background-color:#fff;height:3.7rem;margin:0 auto;border-radius:5px;padding-top:10px;">
                    关注公众号
                </div>
            </popup>
        </div>
    </div>

</template>
<script>
import { Previewer, TransferDom, Popup} from 'vux';
export default {
    name:'releaseContent',
    directives: {TransferDom},
    components: { Previewer,Popup},
    data(){
        return{
            contents:'',
            detailphone:[],
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
            showAccounts:false,
            isshowAccounts:false
        }
    },
    created(){
        this.$emit('showheader',false)
    },
    destroyed(){
        this.$emit('showheader',true)
    },
    mounted(){
        this.hasSubscribeWxMp()
    },
    methods:{
        onPickFile(){
            this.$refs.fileInput.click()
        },
        getFile (event) {
            this.$vux.loading.show()
          console.log(event.target.files[0])
          var params = new FormData();
            params.append('file_data', event.target.files[0] )
            this.$http.post(this.$conf.env.uploadImg,params,true).then(res =>{
                this.$vux.loading.hide()
                this.$vux.toast.text('上传成功')
                var obj ={src: res.data.data.fileName}
                this.detailphone.push(obj)
            }).catch(err =>{
                this.$vux.loading.hide()
                console.log(err)
            })
        },
        updataPost(){
            if(!this.monitoring()) return
            var mediaUrlarr = []; var mediaUrl = ''
            if(this.detailphone.length){
                this.detailphone.forEach(Element =>{
                    mediaUrlarr.push(Element.src)
                })
                mediaUrl = mediaUrlarr.toString()
            }
             this.$vux.loading.show()
            var params = {
                "mediaUrl": mediaUrl,//图片/视频地址 多个以英文逗号分隔
                "openId": this.getCookie('openid'),//微信用户openID
                "postChannel": 0,//帖子频道 0 二手
                "postDesc": this.contents//帖子内容
            }
            this.$http.post(this.$conf.env.savePost, params).then(res =>{
                this.$vux.loading.hide()
                this.$vux.toast.text('帖子发布成功')
                this.$router.go(-1);
            }).catch(err =>{
                console.log(err)
            })
        },
        hasSubscribeWxMp(){
            this.$http.get(this.$conf.env.hasSubscribeWxMp+'?openId=' + this.getCookie('openid')).then(res =>{
                    this.isshowAccounts = res.data.data
            }).catch(err =>{
                return false
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
        monitoring(){
            if(this.detailphone.length == 0){
                this.$vux.toast.text('您还没有传图片哦')
                return false;
            }else if(!this.contents){
                this.$vux.toast.text('您还没有输入内容哦')
                return false;
            }else{
                console.log('res.data.data',this.isshowAccounts)
                if(!this.isshowAccounts){
                //    this.$vux.toast.text('请先关注公众号')
                   this.showAccounts = true;
                    return false; 
                }else{
                    return true;
                }
                
            }
        },
        deleteDataPic(item, index){
            this.detailphone.splice(index, 1);
        },
        show (index) {
            this.$refs.previewer.show(index)
        },
    }
}
</script>
<style lang="scss" scoped>
.releaseContent{
    height: 100%;
    background:#fff;
    .Content-header{
        height: .88rem;
        color: #000;
        background: #fff;
        padding: 0 .34rem;
        margin-bottom: .34rem;
        display: flex;
        align-items: center;
        // position: relative;
        // justify-content: space-around;
        justify-content: space-between;
        .blue_kit_left{
            height: .24rem;
            width: .24rem;
            transform:rotate(135deg);
            border-bottom: 1px solid #000;
            border-right: 1px solid #000;
            // position: absolute;
            // left: .34rem;
            // top: 40%;
        }
        .title{
            padding-left: 1rem;
            width: 100%;
            font-size: .34rem;
            text-align: center;
            line-height: .88rem;
        }
         button{
            padding: .1rem .2rem;
            background:#119dfc ;
            font-size: .3rem;
            color:#fff;
            width: 1.3rem;
            border-radius: .06rem;
        }
    }
    .content_main{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .infocontent {
            background: #fff;
        }
        .contents {
            width: 100%;
            height: 4rem;
            background: #fff;
            position: relative;
            overflow: hidden;
        }
        .textarea, textarea {
            width: 100%;
            height: 3rem;
            margin: 0 auto;

        }
        textarea{
            border: 0;
        }
        .textarea {
            padding: .334rem 0 0 0;
            border: none;
            height: 4rem;
            margin-left: .42rem;
            padding-right: .84rem;
        }
        .fontNum {
            position: absolute;
            bottom: 0.38rem;
            right: .4rem;
            font-size: .32rem;
            color: #b6b6b6
        }
        // .updataPost{
        //     line-height: .88rem;
        //     height: .88rem;
        //     display: flex;
        //     justify-content: flex-end;
        //     align-items: center;
        //     padding-right: .4rem;
        //     border-top: 1px solid #e3e3e3;
        //     border-bottom: 1px solid #e3e3e3;
           
        // }
    }
    .detailphoto {
        background: #fff;
        padding: .3rem .42rem;
        display: flex;
        flex-wrap: wrap;
        .dragpic{
            width: 2rem;
            margin-right: .22rem;
            margin-bottom: .22rem;
            height: 2rem;
            position: relative;
            img{
                width: 100%;
                height: 100%;
            }
            .delete{
                position: absolute;
                top: -.15rem;
                right: -.2rem;
                background: #119dfc;
                color: #fff;
                width: .4rem;
                border-radius: 50%;
                height: .4rem;
                line-height: .4rem;
                text-align: center;
            }
        }
        .dragpic:nth-child(3n){
            margin: 0;
        }
        .btn_upload {
            width: 2rem;
            height: 2rem;
            padding: 0.1rem .1rem;
            box-sizing: border-box;
            display: inline-block;
            border: 1px dashed #e3e3e3;
            margin-left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: .666667rem;
            color: #999;
            position: relative;
            span {
                width: 100%;
                height: 100%;
                background: url("../../assets/img/addLu.png") no-repeat center;
                background-size: .9rem .9rem;
                display: block;
            }
        }
    }
    
    
}
</style>


