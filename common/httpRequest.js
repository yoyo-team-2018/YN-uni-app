// +------------------------------
// http请求工具方法
// +------------------------------

// 引入配置文件
import configdata from './config'
// 引入缓存工具方法
import system from './system'

import Json from './Json' //---------------------测试用数据-------------

module.exports = {
	// 获取配置参数
	config: name => {
		var info = null;
		if (name) {
			var name2 = name.split("."); //字符分割
			if (name2.length > 1) {
				info = configdata[name2[0]][name2[1]] || null;
			} else {
				info = configdata[name] || null;
			}
			if (info == null) {
				let web_config = system.get("web_config");
				if (web_config) {
					if (name2.length > 1) {
						info = web_config[name2[0]][name2[1]] || null;
					} else {
						info = web_config[name] || null;
					}
				}
			}
		}
		return info;
	},
	/*
	 *静态函数方法
	 * @type  对应静态数据key
	 */ 
	getJson : type => {
		//模拟异步请求数据
		return new Promise(resolve=>{
			setTimeout(()=>{
				resolve(Json[type]);
			}, 500)
		})
	},
	// post请求
	post: (url, data, header) => {
		header = header || "application/x-www-form-urlencoded";
		url = module.exports.config("APIHOST")+url;
		return new Promise((resolve, reject) => {
			uni.request({
				url: url,
				data: data,
				method: "POST",
				header: {
					"content-type": header
				},
				success: (result) => {
					// if (result.appCode == '-1') {
					   resolve(result.data);
					// } else {
					//    reject(result);
					// }
				},
				fail: (result) => {
					reject(result);
				}
			})
		})
	},
	// get请求
	get: (url, data, header) => {
		header = header || "application/x-www-form-urlencoded";
		url = this.config("APIHOST")+url;
		return new Promise((succ, error) => {
			uni.request({
				url: url,
				data: data,
				method: "GET",
				header: {
					"content-type": header
				},
				success: (result) => {
					// if (res.statusCode == 200) {
					  resolve(result);
					// } else {
					//   reject(result);
					// }
				},
				fail: (result) => {
					reject(result);
				}
			})
		})
	}
}
