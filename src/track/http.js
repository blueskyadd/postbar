import axios from 'axios';


export default {    
    /**
     * POST请求
     * @param {string} url 接口地址
     * @param {object} request 请求参数
     */
    post(url, request, headerFlag) {
        const headers = {
            headers: {
                'Content-Type': headerFlag ? 'multipart/form-data' : "application/json;charset=UTF-8",
                "Authorization":sessionStorage.getItem('jp_token') ?  'JWT ' +  sessionStorage.getItem('jp_token') : '',
            }
        }
        return new Promise((resolve, reject) => {
            axios.post(url , request, headers).then((response) => {
                resolve(response)
            }, (error) => {
                reject(error)
            });
        });
    },
    /**
     * GET请求
     * @param {string} url 接口地址
     * @param {object} request 请求参数
     */
    get(url, request) {
        const headers = {
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "Authorization": sessionStorage.getItem('jp_token') ?  'JWT ' +  sessionStorage.getItem('jp_token') : '',
            }
        }
        return new Promise((resolve, reject) => {
            axios.get(url, headers, {
                params: request
            }).then((response) => {
                resolve(response)
            }, (error) => {
                reject(error)
            });
        });
    },
    /**
     * DELETE 请求
     * @param {*} Vue 
     */
    delete(url, request) {
        const headers = {
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "Authorization": sessionStorage.getItem('jp_token') ?  'JWT ' +  sessionStorage.getItem('jp_token') : '',
            }
        }
        return new Promise((resolve, reject) => {
            axios.delete(url, headers, {
                params: request
            }).then((response) => {
                resolve(response)
            }, (error) => {
                reject(error)
            });
        });
    },
    put(url, request, headerFlag) {
        const headers = {
            headers: {
                "content-type":  headerFlag ? 'multipart/form-data' : "application/json;charset=UTF-8",
                "Authorization":sessionStorage.getItem('jp_token') ?  'JWT ' +  sessionStorage.getItem('jp_token') : '',
            }
        }
        return new Promise((resolve, reject) => {
            axios.put(url , request, headers).then((response) => {
                resolve(response)
            }, (error) => {
                reject(error)
            });
        });
    },
    /**
     * PUT请求
     * @param {*} Vue 
     */

    install(Vue) {
        Object.defineProperty(Vue.prototype, '$http', {
            value: {
                post: this.post,
                get: this.get,
                delete: this.delete,
                put: this.put
            }
        })
    }
}