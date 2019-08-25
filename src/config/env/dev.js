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
    savePostComment: winchaingroupApi + 'api/comment/savePostComment',//保存评价
    getShareInfo: winchaingroupApi + 'api/post/getShareInfo',//分享
    updateLikeCount: winchaingroupApi + 'api/post/updateLikeCount',//更新帖子点赞数
    getWxJsSdkSignature:winchaingroupApi + 'api/wx/getWxJsSdkSignature',//微信分享
    getWxUserInfo: winchaingroupApi + 'api/wx/getWxUserInfo',//获取用户信息
    getMyPostList: winchaingroupApi + 'api/post/getMyPostList',//获取用户个人中心帖子列表(支持分页)
    deleteMyPost: winchaingroupApi + 'api/post/deleteMyPost',//删除我的帖子
    updateShareCount: winchaingroupApi + 'api/post/updateShareCount',//更新帖子分享数
}