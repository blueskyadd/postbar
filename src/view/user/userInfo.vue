<template>
<div class="user">
    <div class="user-info-login">
        <span class="user-pic"><img :src="userInfo.headImg" alt=""></span>
        <div class="user-desc">
            <p class="user-name">
                <span class="user-name-text">{{userInfo.nickName}}</span> 
                <svg class="user-sex" style="display: none;">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon_mine_girl_n"></use>
                </svg> 
                <svg class="user-sex" style="display: none;">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon_mine_boy_n"></use>
                </svg>
            </p>
            <p class="user-means">查看个人主页和资料编辑</p>
        </div>
    </div>
    <div data-v-b373f9d2="" @click="$router.push({name:'myPostbar'})" class="user-select">
        <span data-v-b373f9d2="" class="user-select-title">我的帖子</span>
    </div>
</div>
    
</template>
<script>
export default {
  name: "userInfo",
  data(){
      return{
          userInfo:{}
      }
  },
  mounted(){
      this.getWxUserInfo()
  },
  methods:{
      getWxUserInfo(){
          this.$http.get(this.$conf.env.getWxUserInfo + '?openId=' +  this.getCookie("openid")).then(res =>{
              console.log(res)
              this.userInfo = res.data.data.userInfo
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
  }
};
</script>
<style lang="scss" scoped>
.user{
.user-info-login{
        padding: .34rem;
        border: .5px solid #f5f5f5;
        background: #fff;
    .user-pic{
        float: left;
        width: 1.36rem;
        height: 1.36rem;
        -webkit-border-radius: .73rem;
        border-radius: .69rem;
        margin-right: .32rem;
        -webkit-background-size: cover;
        background-size: cover;
        background-position: 50%;
        border: .5px solid rgba(0,0,0,.15);
        overflow: hidden;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .user-desc{
        height: 1.4rem;
        .user-name{
            height: .84rem;
            line-height: .84rem;
            color: #000;
            font-size: .4rem;
            font-weight: 700;
            text-align: left;
            padding: 0;
            margin: 0;
            overflow: hidden;
            .user-name-text{
                float: left;
                max-width: 90%;
                overflow: hidden;
                -o-text-overflow: ellipsis;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

        }
        
        .user-means{
            height: .4rem;
            line-height: .4rem;
            color: #666;
            font-size: .28rem;
            text-align: left;
            padding: 0;
            margin: 0;
            max-width: 65%;
            overflow: hidden;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}

    .user-select{
        margin-top: .17rem;
        background: #fff;

        padding: .36rem .34rem;
        text-align: left;
        color: #000;
        font-size: .32rem;
    }
}


</style>
