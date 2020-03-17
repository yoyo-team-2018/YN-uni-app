<template>
	<view class="content">
		<image class="bg-img" src="../../static/code-bg.png" mode=""></image>

		<!-- 人员信息 -->
		<scroll-view class="top-box" scroll-y style="height:100%;">
			<swiper class="card-swiper swiper-centent" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true"
			 indicator-active-color="#0081ff" :circular="true" indicator-color="#8799a3" duration="500" @change="cardSwiper">
				<swiper-item v-for="(item,index) in data" :key="index" :class="cardCur==index?'cur':''">
					<view class="swiper-item">
						<image class="code-img" :src="'data:image/png;base64,' + item.QRcode"></image>
						<!-- 文字说明 -->
						<view v-if="item.status== 1" class="btn-green btn-box">
							<view class="btn">通行证有效</view>
							<view>有效期至{{item.data.endTime | tp}}</view>
						</view>
						<view v-else-if="item.status == 2" class="btn-red btn-box">
							<view class="btn">通行证无效</view>
							<view class="btn-explain">
								<text class="btn-explain-title">无效说明:</text>
								<text class="btn-explain-text">{{item.msg | tp}}</text>
							</view>
						</view>
						<view v-else-if="item.status == 3" class="btn-orange btn-box">
							<view class="btn">通行证无效</view>
							<view class="btn-explain">
								<text class="btn-explain-title">无效说明:</text>
								<text class="btn-explain-text">{{item.msg | tp}}</text>
							</view>
						</view>
						<view class="btn-explain">
							<text class="btn-explain-title" style="color: #000;">出入地址:</text>
							<text class="btn-explain-text" style="color: #000;">{{item.data.address | tp}}</text>
						</view>
						<button class="reload-btn" :data-id="item.data.id" @click="reloadEPass">重新申请</button>
					</view>
				</swiper-item>
			</swiper>
			<!-- 个人信息 -->
			<view class="bottom-item">
				<view class="input-box">
					<view class="label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名:</view>
					<view class="text">{{data[0].data.xm | tp}}</view>
				</view>
				<view class="input-box">
					<view class="label">电话号码:</view>
					<view class="text">{{data[0].data.lxdh | tp}}</view>
				</view>
				<view class="input-box">
					<view class="label">身份证号:</view>
					<view class="text">{{data[0].data.zjhm | tp}}</view>
				</view>
				<view class="input-box">
					<view class="label">居委会:</view>
					<view class="text">{{data[0].data.jwhName | tp}}</view>
				</view>
			</view>
		</scroll-view>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	import uQRCode from '@/common/uqrcode.js'
	import req from '@/common/req.js'
	export default {
		data() {
			return {
				// 通行证状态
				status: 1,
				// 数据信息
				data: "",
				//二维码
				qrcode: "",

				cardCur: 0
			};
		},
		onLoad() {
			// 初始二维码
			this.loadQrcode();
		},
		filters: {
		  tp: function (value) {
		    if (value == null || typeof value == undefined) return ''
			return value
		  }
		},
		methods: {
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// 初始二维码
			async loadQrcode() {
				uni.showLoading({
					mask: true,
					title: "正在加载中",
				});
				const {
					appCode,
					appMsg,
					dataList
				} = await this.$request.post(this.$api.getQCcode, {
					"openId": this.$store.state.openId
				});

				if (appCode == 1) {
					if (dataList.length == 0) {
						this.$refs['Message'].error('未登记人员信息');
						this.navBack()
						return
					}
					this.data = dataList;
				} else {
					let _this = this;
					this.$refs['Message'].error(result.appMsg);
					let timeout = setTimeout(function() {
						_this.$routes.navBack();
						clearTimeout(timeout);
					}, 3000);
				}
				uni.hideLoading();

			},
			// 返回上一页
			navBack() {
				const _this = this;
				const timeout = setTimeout(function() {
					_this.$routes.navBack();
					clearTimeout(timeout);
				}, 3000);
			},
			// 生成二维码
			make(text) {
				uQRCode.make({
					canvasId: 'qrcode',
					componentInstance: this,
					text: text,
					size: 215,
					margin: 10,
					backgroundColor: '#ffffff',
					foregroundColor: '#000000',
					fileType: 'jpg',
					correctLevel: uQRCode.defaults.correctLevel,
					success: res => {
						// console.log(res)
					}
				})
			},
			// 个人信息
			navPerson() {
				// 保存数据到状态
				this.$store.dispatch('refreshPersonData', this.data);
				// 
				this.$routes.navTo('/pages/scancode/person-info');
			},
			// 通行记录
			navRecord() {
				this.$routes.navTo('/pages/scancode/current-record');
			},
			// 跳转重新申请出入证
			reloadEPass(e) {
				this.$routes.navTo('/pages/EPass/EPassIndex?id=' + e.target.dataset.id);
			}
		}
	}
</script>

<style lang="scss">
	.content {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: -2;
		background: #fff;

		// 二维码
		.bg-img {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: -1;
			width: 100%;
			height: 100%;
		}

		// 扫码人员信息
		.top-box {
			display: flex;
			flex-direction: column;
			text-align: center;
			justify-content: space-around;

			.swiper-centent {
				box-sizing: border-box;
				height: 850rpx !important;
				padding: 25rpx 0;

				swiper-item {
					padding: unset;
				}
			}
			
			.bottom-item {
				flex: 1;
				display: flex;
				flex-direction: column;
			}

			.swiper-item {
				background: #fff;
				box-sizing: border-box;
				padding: 20rpx 10rpx 50rpx;
				display: flex;
				flex-direction: column;
				justify-content: space-around;
				.code-img {
					width: 430rpx;
					height: 430rpx;
					margin: 0 auto;
				}
			}

			// 按钮盒子
			.btn-box {
				text-align: center;

				view.btn {
					display: inline-block;
					width: 430rpx;
					height: 80rpx;
					line-height: 80rpx;
					border-radius: 140rpx;
					color: #fff;
				}
			}

			.btn-green {
				view.btn {
					background-color: rgb(135, 245, 10);
				}
			}

			.btn-red {
				view.btn {
					background-color: rgb(251, 54, 6);
				}
			}
			
			.btn-orange {
				view.btn {
					background-color: orange;
				}
			}

			// 说明
			.btn-explain {
				color: rgb(252, 86, 54);
				display: flex;
				&-title {
					width: 145rpx;
				}
				&-text {
					flex: 1;
					text-align: left;
				}
			}

			// 个人信息区域
			.input-box {
				display: flex;
				background: #fff;
				margin: 0 60rpx 18rpx;
				padding: 0 20rpx;
				border-radius: 10rpx;
				align-items: center;
				view {
					margin-bottom: 0;
					padding: 16rpx 0;
				}

				// 两边对齐处理
				.label {
					color: rgb(53, 96, 202);
					width: calc(4em + 5px);
					text-align: justify;
					margin-right: 20rpx;
				}

				.text {
					flex: 1;
					text-align: left;
				}
			}
			
			.reload-btn {
				line-height: 65rpx;
				background-color: #FBBD08;
				height: 65rpx;
				color: #FFFFFF;
				font-weight: 400;
				font-size: 24rpx;
			}
		}


	}
</style>
