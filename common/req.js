// uni-app请求封装
import url from './config.js'
module.exports = {
    http :(router,data={},method)=> {
        // 基础地址
        let path = url.APIHOST + 'passLink/';
        // 返回promise
        return new Promise((resolve,reject) => {
            // 请求
            uni.request({
                url: `${path}${router}`,
                data: data,
                method:method,
				header:{
					'content-type':'application/x-www-form-urlencoded'
				},
                success: (res) => {
                    // 将结果抛出
                    resolve(res.data)
                }
            })
        })    
    }
}