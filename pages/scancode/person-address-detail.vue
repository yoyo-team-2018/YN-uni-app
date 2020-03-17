<template>
	<view class="container">
		<scroll-view class="examine-box" scroll-y style="height:100vh;">
			<view class="content">
				<block v-for="(items,index) in dataArr" :key="items.id">
					<view class="row-list">
						<view class="left">
							<view class="title">
								<view class="dot-box">
									<view class="iconfont icon-dizhi" :class="items.addressType == '居住地址' ? 'dot-bg1' : items.addressType == '工作地址' ? 'dot-bg2' : items.addressType == '来访地址' ? 'dot-bg3' : 'dot-bg4'"></view>
								</view>
								<text class="title-label">{{items.addressType}}: </text>
								<text class="title-address">{{items.address}}</text>
							</view>
							<view class="remark" v-if="items.checkStatus === '0'">说明: 待审核，请耐心等待审核！</view>
							<view class="remark" v-else-if="items.checkStatus === '1'">说明: 审核不通过（需要重新审核）！</view>
							<view class="remark" v-else-if="items.checkStatus === '2'">说明: 有效期至 {{items.endTime}} ！</view>
						</view>
						<view class="right">
							<i class="iconfont right-icon" :class="items.checkStatus === '2' ? 'right-gouxuan' : 'right-gantanhao'"></i>
						</view>

					</view>
				</block>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				dataArr: []
			};
		},
		onLoad() {
			this.dataArr = this.$store.state.registerData
		},
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;

		font-size: $fz16;

		.person-info {
			border-bottom: 1px solid $b-t;
		}

		// 列表
		.row-list {
			display: flex;
			padding: 20rpx 20rpx;
			align-items: center;
			flex-direction: row;
			box-sizing: border-box;
			border-bottom: 1px solid #E4E4E4;

			.left {
				display: flex;
				flex-direction: column;

				.title {
					display: flex;

					.title-label {
						min-width: calc(4em + 15px);
						color: $color6;
					}

					.title-address {
						flex: 1
					}
				}

				.dot-box {

					box-sizing: border-box;
					padding: 5rpx 10rpx 5rpx 5rpx;
					
					.iconfont {
						font-size: 32rpx;
					}

					.dot {
						width: 30rpx;
						height: 30rpx;
						border-radius: 50%;
					}

					.dot-bg1 {
						/* 居住 */
						color: rgb(43, 212, 111);
					}

					.dot-bg2 {
						/* 工作 */
						color: rgb(82, 139, 243);
					}

					.dot-bg3 {
						/* 来访 */
						color: rgb(255, 112, 112);
					}

					.dot-bg4 {
						/* 其他 */
						color: rgb(255, 162, 63);
					}
				}
			}

			.right {
				margin: 0 20rpx;
				.right-icon {
					width: 50rpx;
					height: 50rpx;
				}
				.right-gouxuan {
					background: url(../../static/icon_yx.png) 100%/100% no-repeat;
				}
				.right-gantanhao {
					background: url(../../static/icon_wx.png) 100%/100% no-repeat;
				}
			}

			.remark {
				font-size: $fz14;
				padding: 30rpx 0 10rpx 70rpx;
				color: #7f7f7f;
			}
		}

		.row-list:last-of-type {
			border-bottom: unset;
		}
	}
</style>
