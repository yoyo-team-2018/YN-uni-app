/**
 * 路由跳转
 */
module.exports = {
    /**
     * 保留当前页面，跳转到应用内的某个页面
     * @param path [路径]
     */
	navTo : path => {
		return new Promise(resolve=>{
			uni.navigateTo({
				url: path,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		})
	},
    /**
     * 关闭当前页面，返回上一页面或多级页面
     * @param path [路径]
     */
    navBack : (level=1) => {
    	return new Promise(resolve=>{
    		uni.navigateBack({
    			delta: level
    		});
    	})
    },
	/**
	 * 关闭当前页面，跳转到应用内的某个页面-非tabBar页面 
	 * @param path [路径]
	 */
	redTo : path => {
		return new Promise(resolve=>{
			uni.redirectTo({
				url: path,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		})
	},
	/**
	 * 关闭当前页面，跳转到应用内的tabBar页面 
	 * @param path [路径]
	 */
	swbTo : path => {
		return new Promise(resolve=>{
			uni.switchTab({
				url: path,
				success: res => {},
				fail: () => {},
				complete: () => {}
			});
		})
	}
}