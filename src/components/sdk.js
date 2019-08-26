import wx from 'weixin-js-sdk'
const wxApi = {
    /**
     * [wxRegister 微信Api初始化]
     * @param  {Function} callback [ready回调函数]
     */
   
    wxRegister(data, option, _this, params) { //data是微信配置信息，option是分享的配置内容
        wx.config({
            debug: true, // 开启调试模式
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: [
                'updateTimelineShareData',
                'updateAppMessageShareData',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ] // 必填
        })
        wx.ready(function(){
            wx.updateTimelineShareData({
                title: option.title, // 分享标题
                link: option.link, // 分享链接
                imgUrl: option.imgUrl, // 分享图标
                desc: option.desc, // 分享描述
                success() {
                    // 用户成功分享后执行的回调函数
                    _this.$http.http(_this.$conf.env.updateShareCount, params).then(res =>{
                        _this.$vux.toast.text('成功到朋友圈');
                    }).catch(err =>{    
                        _this.$vux.toast.text('分享失败')
                    })
                }
            });
            wx.updateAppMessageShareData({
                title: option.title, // 分享标题
                desc: option.desc, // 分享描述
                link: option.link, // 分享链接
                imgUrl: option.imgUrl, // 分享图标
                success() {
                    // 用户成功分享后执行的回调函数
                    _this.$http.http(_this.$conf.env.updateShareCount, params).then(res =>{
                        _this.$vux.toast.text('成功分享给好友');
                    }).catch(err =>{
                        _this.$vux.toast.text('分享失败')
                    })
                }
            })
        })
    }
}
export default wxApi