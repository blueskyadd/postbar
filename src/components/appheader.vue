<template>
    <header>
        <router-link tag="div" to="/">
            <div>进吧</div> 
        </router-link>
        <router-link tag="div" to="/userinfo">
            <div>我的</div> 
        </router-link>
    </header>
</template> 
<script>
export default {
    name: 'header'
}
</script>
<style lang="scss" scoped>
header{
    font-size: .34rem;
    text-align: center;
    line-height: .88rem;
    height: .88rem;
    color:#666;
    background: #fff;
    display: flex;
    
    .router-link-exact-active,.router-link-active{
        div{
            height: .88rem;
            line-height: .88rem;
            width: 1rem;
            color: #000;
            border-bottom: 1px solid #333;
        }
    }
}
header>div{
        flex: 1;
        display: flex;
        justify-content: center;
    }
</style>

