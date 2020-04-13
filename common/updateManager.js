/**
 * @description 检查是否需要更新小程序
 */
export function checkUpdateApp() {
	
	const updateManager = uni.getUpdateManager();

	updateManager.onCheckForUpdate(function(res) {
		// 请求完新版本信息的回调
		// console.log('是否有新版本', res.hasUpdate);
		if (res.hasUpdate) {
			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(r) {
						if (r.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});
			});
			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
				uni.showModal({
					title: '已经有新版本了哟~',
					content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
					showCancel: false
				})
			});
		}
	});
}
