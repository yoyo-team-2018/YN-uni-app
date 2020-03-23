<template>
	<view class="view">
		<image :src="hasFid ? echoFid : 'data:image/png;base64,' + imgSrcBase64" mode="aspectFill" @click="handleClick"></image>
	</view>
</template>

<script>
	import { IMAGE_PATH } from '../common/config.js'
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
			handleClick() {
				wx.chooseImage({
					count: 1,
					success: res => {
						wx.getFileSystemManager().readFile({
							filePath: res.tempFilePaths[0],
							encoding: 'base64',
							success: res => {
								this.imgSrcBase64 = res.data
								this.hasFid = false
								this.$emit('imgSrcBase64', this.imgSrcBase64)
							}
						})
					}
				})
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
