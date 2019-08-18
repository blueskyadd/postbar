// const winchaingroupApi = "https://www.bmeauto.cn";
const winchaingroupApi = "http://forum.vxiangwang.com/";
// const sellUrl = 'http://forum.vxiangwang.com'
const sellUrl = 'http://192.168.123.22:8080'


module.exports = {
    sellUrl: sellUrl,
    //wx
    wxLogin: winchaingroupApi + 'api/wx/getWxAuthorizeInfo',//微信授权页面
    getPostList: winchaingroupApi + 'api/post/getPostList',//获取帖子列表
    getPostDetail: winchaingroupApi + 'api/post/getPostDetail/?detailId=',//获取帖子详情
    uploadImg: winchaingroupApi + 'api/image/upload',//上传图片
    savePost: winchaingroupApi + 'api/post/savePost',//发帖
    getPostCommentDetail: winchaingroupApi + 'api/comment/getPostCommentDetail',//获取帖子留言详情
}