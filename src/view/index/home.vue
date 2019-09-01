<template>
    <div class="homeIndex">
        <div class="detail-header border-bottom">
            <div class="blue_kit_left"  @click="goBack"></div>
         </div>
       <div class="homeIndex_postList">
            <ul class="titleList">
                <li v-for="item in listTab" :key="item" class=" vux-1px-b" @click="goBack(item)"><span>{{item}}</span></li>
            </ul>
        </div>
    </div>
   
</template>
<script>
const list = () => ['精选', '美食', '电影', '酒店', '外卖']
export default {
    name:'homeIndex',
    components:{},
    data(){
        return{
             listTab: list(),
             index: 0,
             demo2: '精选',
             isShowTitle: true
        }
    },
    created(){
        this.$emit('showheader',false);
    },
    destroyed(){
        this.$emit('showheader',true)
    },
    methods:{
        goBack(item){
            this.$bus.$emit('changeTab', item);
            this.$router.go(-1)
        }
    },
    wacth:{
        isShowTitle(){
            console.log(this.isShowTitle)
        }
    }
}
</script>
<style lang="scss" scoped>
.homeIndex{
    height:100%;
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
    .titleList{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin: .4rem .2rem .2rem;
        // padding-top: .2rem;
        border-radius: .3rem;
        overflow: hidden;
        background: #000 url('https://img.tukuppt.com/bg_grid/00/03/57/pEfqIMlZvO.jpg!/fh/350') 0 0 /100% 100%;

        li{
            width: 24.9%;
            margin-bottom: 0;
            height: 1rem;
            background: transparent;
            font-size: .3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            padding: .2rem;
        }
    }
}
</style>


