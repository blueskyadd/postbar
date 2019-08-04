<template>
<div class="user-info-login">
    <span class="user-pic"><img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1901600690,2735789840&fm=26&gp=0.jpg" alt=""></span>
    <div class="user-desc">
        <p class="user-name">
            <span class="user-name-text">冰镇西瓜40</span> 
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
    
</template>
<script>
export default {
  name: "userInfo"
};
</script>
<style lang="scss" scoped>
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
                max-width: 65%;
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


</style>
