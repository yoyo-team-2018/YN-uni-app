<template>
	<view class="view">
		<image :src="hasFid ? echoFid : 'data:image/png;base64,' + imgSrcBase64" mode="aspectFill" @click="handleClick"></image>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	import {
		IMAGE_PATH
	} from '../common/config.js'
	export default {
		data() {
			return {
				imgSrcBase64: '',
				hasFid: false
			}
		},
		props: {
			echo: String
		},
		computed: {
			echoFid: {
				get() {
					const _this = this
					if (this.echo != '') {
						_this.hasFid = true
						return IMAGE_PATH + this.echo
					}
					return ''
				}
			}
		},
		methods: {
			async handleClick() {
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: res => {
						uni.showLoading({
							title: '检测照片中!',
							mask: true
						});
						uni.getFileSystemManager().readFile({
							filePath: res.tempFilePaths[0],
							encoding: 'base64',
							success: res => {
								this.imgSrcBase64 = res.data;
								this.checkPhoto(this.imgSrcBase64)
								this.hasFid = false
								this.$emit('imgSrcBase64', this.imgSrcBase64)
							}
						})
					}
				})
			},
			async checkPhoto(photoBase64) {
				const {
					appCode,
					appMsg
				} = await this.$request.post(this.$api.isCheckPhoto, {
					photoBase64
				})
				uni.hideLoading()
				if (appCode == 1) {
					this.$refs['Message'].success('检测照片通过')
				} else {
					uni.showModal({
						title: '检测不通过',
						content: `${appMsg}, 请重新选择照片!`,
						showCancel: false
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.view {
		padding: 10rpx;
	}

	image {
		width: 100rpx;
		height: 100rpx;
		border: 2rpx solid #eee;
	}
</style>
