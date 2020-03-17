/**
 * 缓存数据优化
 * var system = require('common/system.js');
 * import system from '../common/system'
 * 使用方法 【
 *     一、设置缓存
 *         string    cache.set('k', 'string你好啊');
 *         json      cache.set('k', { "b": "3" }, 2);
 *         array     cache.set('k', [1, 2, 3]);
 *         boolean   cache.set('k', true);
 *     二、读取缓存
 *         默认值    cache.get('k')
 *         string    cache.get('k', '你好')
 *         json      cache.get('k', { "a": "1" })
 *     三、移除/清理  
 *         移除: cache.remove('k');
 *         清理：cache.clear(); 
 * 】
 * @type {String}
 */
const postfix = '_cache'; // 缓存后缀 

// 引入工具方法
import custom from './custom';

module.exports = {
    /**
     * 设置缓存 
     * @param k [键名]
     * @param v [键值]
     * @param t [时间、单位秒]
     */
    set : function (k, v, t) {
        uni.setStorageSync(k, v) 
        var seconds = parseInt(t);
        if (seconds > 0) {
            var timestamp = Date.parse(new Date());
            timestamp = timestamp / 1000 + seconds;
            uni.setStorageSync(k + postfix, timestamp + "")
        } else {
            uni.removeStorageSync(k + postfix)
        }
    },
	/**
	 * 获取缓存 
	 * @param k  [键名]
	 * @param v  [获取为空时默认]
	 */
	get : function (k, v) {
	    var deadtime = parseInt(uni.getStorageSync(k + postfix)) 
	    if (deadtime) {
	        if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
	            if (v) {
	                return v;
	            } else {
	                return false;
	            }
	        }
	    }
	    var res = uni.getStorageSync(k);
	    if (res) {
	        return res;
	    } else {
	        if (v == undefined  || v == "") {
	            v = false; 
	        }
	        return v;
	    }
	},
	/**
	 * 删除指定缓存 
	 * @param k  [键名]
	 */
    remove : function (k) {
        uni.removeStorageSync(k);
        uni.removeStorageSync(k + postfix);
    },
	// 清理所有缓存
	clear : function() {
	    uni.clearStorageSync();
	},
	// +-------------------------------------
	// |上传图片
	// |@oldImgList 已上传的图片数据
	// |@maxImgTotal 最大上传图片总数
	// |@cb 回调函数
	// +-------------------------------------
	chooseImage: function (oldImgList,maxImgTotal,cb) {
		uni.chooseImage({
		  // count: _this.data.imagesCount,
		  count: 1,//每次允许选择图片的数量
		  sizeType: ['compressed'],
		  sourceType: ['album', 'camera'],
		  success: (res) => {
			 // 判断图片是否大于2M
			 let size = parseInt(res.tempFiles[0].size)/1024/1024;
			 if(size >= 2){
				 cb([], []);
				 return false;
			 }
			// 新上传的图片数据
			const newImgList = res.tempFilePaths;
			// 新上传的图片数量
			let nowLenght = newImgList.length;
			// 已上传的图片数量
			let imageLenght = oldImgList.length;
			// 如果已上传的图片数量小于允许上传图片数量
			if (imageLenght <= maxImgTotal) {
			  let images = [];
			  // 获取缺少的图片张数
			  let residue = maxImgTotal - imageLenght;
			  // 如果缺少的张数大于当前的的张数  
			  if (residue >= nowLenght) {
				// 直接将两个数组合并为一个  
				images = oldImgList.concat(newImgList);
			  } else {
				// 否则截取当前的数组一部分  
				images = oldImgList.concat(newImgList.slice(0, residue));
			  }
			  // 如果存在回调函数执行（用于图片上传到服务器接口）
			  if (typeof (cb) == 'function') {
				// newImgList返回选中的那张图片（用于对当前选择的图片进行上传操作）
				// images 图片集合（用于上传成功后更新图片）
				cb(newImgList, images);
			  }
			}
		  }
		});
	},
	// +-------------------------------------
	// |扫码
	// |@cb 回调函数
	// +------------------------------------- 
	scanCode:function(cb){
		uni.scanCode({
			success: function (res) {
				cb(res);
			}
		});
	},
	// +-------------------------------------
	// |查询登录状态
	// |true登录  false  退出登录
	// +------------------------------------- 
	checkSession:function(){
		uni.checkSession({
		  success() {
			return true;
		  },
		  fail() {
			return false;
		  }
		})
	},
	getSetting:function(){
		uni.getSetting({
			success(res) {
				if (!res.authSetting['scope.userInfo']) {
				  uni.authorize({
					scope: 'scope.userInfo',
					success () {
						// 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
						wx.startRecord()
					}
				  })
				}
			}
		})
	},
	// +-------------------------------------
	// |加载动画
	// |@title 文字说明
	// +------------------------------------- 
	showLoad(title){
		if(custom.isEmpty(title)) title = '加载中';
		console.log("231123");
		uni.showLoading({
			mask:true,
		    title: title
		});
	},
	// +-------------------------------------
	// |隐藏加载动画
	// +------------------------------------- 
	showLoad(title){
		uni.hideLoading();
	},
	// +-------------------------------------
	// |返回上一页对象
	// +------------------------------------- 
	 getBackPage() {
	    const that = this;
	    const pages = getCurrentPages();//获取页面栈
	    const beforePage = pages[pages.length - 2];  //前一个页面
		return beforePage;
	}
	
}