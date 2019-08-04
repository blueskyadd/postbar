<template>
    <div class="releaseContent">
        <div class="Content-header">
            <div class="blue_kit_left" @click="$router.go(-1)">
            </div>
         </div>
         <div class="content_main">
             <div class="infocontent">
                <div class="contents">
                    <div class="textarea">
                        <textarea ref="textareass" id="textareass"  v-model="contents" class="uinputs" placeholder="在这里写精彩内容" ></textarea>
                    </div>
                    <span class="fontNum"><i :style="{'color':contents.length > 200 ? '#fb3d3d' : '#999999'}">{{contents.length}}</i>/200</span>
                </div>
            </div>
            <div class="detailphoto">
                <div>
                    <div>
                        <!-- <div v-for="(item, index) in detailpho" :key="index" class="dragpic">
                            <i class="iconfont icon-close delete" @click.stop="deleteDataPic(item,index)"></i>
                            <img v-if="item.type == 0" @click="viewLargerImages(detailpho, index, 2 )"  alt="">
                            <img v-else @click="viewLargerImages(detailpho, index, 2 )"  alt="">
                        </div> -->
                        <div class="btn_upload" ><span  @click="onPickFile"><input ref="fileInput"  accept="image/*"  @change="getFile"   style="display: none" type="file" ></span></div>
                    </div>
                </div>
            </div>  
         </div>
    </div>
</template>
<script>
export default {
    name:'releaseContent',
    data(){
        return{
            contents:'',
        }
    },
    created(){
        this.$emit('showheader',false)
    },
    destroyed(){
        this.$emit('showheader',true)
    },
    mounted(){
        
    },
    methods:{
        onPickFile(){
            this.$refs.fileInput.click()
        },
        getFile (event) {
          console.log(event.target.files)  
        }
    }
}
</script>
<style lang="scss" scoped>
.releaseContent{
    .Content-header{
        height: .88rem;
        line-height: .88rem;
        color: #000;
        background: #fff;
        padding: 0 .34rem;
        margin-bottom: .34rem;
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
    .content_main{
        .infocontent {
            background: #fff;
        }
        .contents {
            width: 100%;
            height: 4.333333rem;
            background: #fff;
            position: relative;
            overflow: hidden;
        }
        .textarea, textarea {
            width: 100%;
            height: 3.4rem;
            margin: 0 auto;

        }
        textarea{
            border: 0;
        }
        .textarea {
            padding: .334rem 0 0 0;
            border: none;
            height: 4.333333rem;
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
    }
    .detailphoto {
        background: #fff;
        padding: .3rem .42rem 0;
        .btn_upload {
            width: 3rem;
            height: 3rem;
            padding: 0.1rem .1rem;
            box-sizing: border-box;
            display: inline-block;
            border: 1px dashed #e3e3e3;
            border: 1px dashed red;
            margin-left: 0;
            margin-bottom: 1.5rem;
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
                // display: flex;
                // justify-content: center;
                // align-items: center;
            }
        }
    }
    
}
</style>


