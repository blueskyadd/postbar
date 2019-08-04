//配置参数
// let env = process.env.NODE_ENV.replace(/(\s*$)|(^\s*)/ig, '');// 获取环境命令，并去除首尾空格
let env_conf;

// 根据环境变量引用相关的配置文件
// if (env === 'production') {
//     env_conf = 'prod'
// } else if (env === 'preannouncement') {
//     env_conf = 'pre'
// } else if (env === 'qualityAssurance') {
//     env_conf = 'qa'
// } else if (env === 'development') {
//     env_conf = 'dev'
// } else if (env === 'localhost') {
//     env_conf = 'local'
// }
/**
 * 暂时未定开发环境
 */
export default {
    env: require('./env/dev')
};