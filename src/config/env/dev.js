// const winchaingroupApi = "https://www.bmeauto.cn";
const winchaingroupApi = "http://forum.vxiangwang.com/";
const sellUrl = 'http://192.168.123.22:8080'

module.exports = {
    sellUrl: sellUrl,
    //wx
    wxLogin: winchaingroupApi + 'api/wx/getWxAuthorizeInfo',//微信授权页面
    getPostList: winchaingroupApi + 'api/post/getPostList',//获取帖子列表
    getPostDetail: winchaingroupApi + 'api/post/getPostDetail/?detailId=',//获取帖子详情
}