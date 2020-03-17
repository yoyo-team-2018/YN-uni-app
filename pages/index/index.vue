<template>
	<view class="container">
		<view class="bg-img-box">
			<image class="bg-box" src="../../static/bg.png"></image>
			<!-- <view class="title">前进邻好&nbsp;&nbsp;&nbsp;一码回家</view>
			<view class="info">
				<view class="left-box">
					<image src="../../static/icon.jpg" mode=""></image>
				</view>
				<view class="right-box">
					<view class="top-item">
						<text class="left">前进街道防控办</text>
						<text class="right">群防群治齐心协力</text>
					</view>
					<view class="bottom-item">
						<text>咨询电话:&nbsp;&nbsp;前进街道办事处:<text class="phone">020-82564801</text></text>
					</view>
				</view>
			</view> -->
		</view>
		<!-- 按钮区域 -->
		<view class="btn-box">
			<view v-if="register" class="list-box" @click="navRegister">
				<image src="../../static/register.png"></image>
				<view>
					<view class="title">{{registerBtnName}}</view>
					<view class="grey">填写个人相关信息</view>
				</view>
			</view>
			<view class="list-box" @click="navPersonZJ">
				<image src="../../static/wd.png"></image>
				<view>
					<view class="title">我的穗康码（海珠）</view>
					<view class="grey">查看我的穗康码（海珠）</view>
				</view>
			</view>
			<view class="list-box" @click="navPersonInfo">
				<image src="../../static/person.png"></image>
				<view>
					<view class="title">个人信息</view>
					<view class="grey">查看个人的详细信息</view>
				</view>
			</view>
			<view class="list-box" @click.stop="navExitRecord">
				<image src="../../static/txjl.png"></image>
				<view>
					<view class="title">通行记录</view>
					<view class="grey">查看个人的通行记录</view>
				</view>
			</view>
		</view>
		<!-- confirm模块 -->
		<confirm v-on:confirm="confirm" ref="confirm"></confirm>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
		<!-- 授权弹窗 -->
		<bottom-top-panel ref="bottomTopPanel">
			<view slot="bottom-top-panel" class="b-t-panel">
				<view class="auth-title-box">
					<view class="left-box">
						<!-- <image src="../../static/icon.jpg" mode="aspectFill"></image> -->
						<text class="title">海珠防疫通行证</text>
						<text class="info">申请使用</text>
					</view>
					<view class="right-box"></view>
				</view>
				<view class="auth-content-box">
					<view>你的微信绑定的手机号信息,为你提供相关的服务</view>
				</view>
				<view>
					<checkbox-group @change="setIsConsent" style="display: flex;align-items: flex-end;">
						<label>
							<checkbox value="isConsent" :checked="isConsentAgreements" style="transform:scale(0.9);margin-right: 10rpx;"/> 是否同意<text class="tz-text" data-name="yhffxy" @click="goToNav">《用户服务协议》</text>及<text class="tz-text" data-name="yszc" @click="goToNav">《隐私政策》</text>
						</label>
					</checkbox-group>
				</view>
				<view class="auth-btn-box flex justify-between">
					<view class="btn-cancel" @click="cancelButton">拒绝</view>
					<view class="btn-sure" @click="sureButton">允许</view>
				</view>
			</view>
		</bottom-top-panel>
	</view>
</template>
<script>
	import confirm from "@/components/confirm"; //确定框
	import bottomTopPanel from '@/components/bottom-top-panel'; //授权弹窗
	export default {
		components: {
			confirm,
			bottomTopPanel,
		},
		data() {
			return {
				openId: "",
				// 默认不显示登记按钮
				register: false,
				// 申请通行证
				registerBtnName: "申请穗康码（海珠）",
				// 是否同意用户协议
				isConsentAgreements: false
			};
		},
		onLoad() {
			this.isConsentAgreements = uni.getStorageSync('isConsentAgreements')
			// 如果登录过,直接获取openid
			if (!this.$custom.isEmpty(this.$store.state.openId)) {
				this.loadJsCode();
			}
			// this.showCustomPopupClick();
		},
		methods: {
			// 登记
			navRegister() {
				if (this.$custom.isEmpty(this.$store.state.openId)) {
					this.showCustomPopupClick();
					return false;
				}
				this.navToPage('EPass/EPassIndex');
			},
			// 个人信息
			navPersonInfo() {
				if (this.$custom.isEmpty(this.$store.state.openId)) {
					this.showCustomPopupClick();
					return false;
				}
				this.navToPage('scancode/person-info');
			},
			// 通行记录
			navExitRecord() {
				if (this.$custom.isEmpty(this.$store.state.openId)) {
					this.showCustomPopupClick();
					return false;
				}
				this.navToPage('scancode/current-record');
			},
			// 我的通行证
			navPersonZJ() {
				if (this.$custom.isEmpty(this.$store.state.openId)) {
					this.showCustomPopupClick();
					return false;
				}
				this.navToPage('EPass/qrcode');
			},

			// 加载小程序code
			loadJsCode() {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(res) {
						_this.setOpenid(res.code);
					}
				});
			},
			// 设置openid 供全局调用
			async setOpenid(code) {
				let res = await this.$request.post(this.$api.getOpenID, {
					code: code
				});
				if (res.appCode === 1) {
					this.openId = res.data.openid;
					// 保存openid到状态
					this.$store.dispatch('refreshOpenId', this.openId);
					if (this.$custom.isEmpty(res.data.openid)) {
						wx.hideLoading();
						// 如果没有登录 提示
						if (this.$store.state.registerStatus == 0) {
							this.$refs['Message'].error("授权登录失败");
						}
					} else {
						// 如果没有登录 提示
						if (this.$store.state.registerStatus == 0) {
							this.$refs['Message'].success("授权登录成功");
							// 跳转页面
							this.navDistPage(res.data.openid);
						}

					}
				}
			},
			// 跳转页面(区分管理员和用户)
			async navDistPage(openId) {
				let res = await this.$request.post(this.$api.isAdmin, {
					"openId": openId
				});
				// 1是管理员  0普通住户
				// 保存用户权限到状态
				this.$store.dispatch('refreshUserType', res.appCode);
				if (res.appCode === 1) {
					// 跳转页面
					this.$routes.redTo("/pages/index/manager");
				} else {
					// 请求判断是否登记过
					let result = await this.$request.post(this.$api.getMyInfo, {
						"openId": this.$store.state.openId
					});
					// 1登记
					if (result.appCode == 1) {
						// 保存用户登记数据到状态
						this.$store.dispatch('refreshRegisterData', result.data);

						//checkStatus  1代表登记过，但是审核不通过，需要重新登记
						if (result.data.checkStatus == 1) {
							this.registerBtnName = "申请多个穗康码（海珠）";
							this.register = true;
						} else {
							this.registerBtnName = "申请穗康码（海珠）";
							this.register = false;
						}
					} else {
						/// -1未登记
						this.register = true;
						this.registerBtnName = "申请穗康码（海珠）";
						// 保存用户登记数据到状态
						this.$store.dispatch('refreshRegisterData', "");
					}
				}
				wx.hideLoading();
			},
			//详情页
			navToPage(url) {
				this.$routes.navTo('/pages/' + url);
			},
			// 显示提示
			showConfirm(content) {
				this.$refs.confirm.show({
					title: "注意",
					content: content,
					sure: "确定"
				});
			},
			// 确认提交输入框(通过审核)
			confirm() {
				this.$refs.confirm.hide();
			},
			// 显示授权窗口
			showCustomPopupClick() {
				this.$refs.bottomTopPanel.showCustom();
			},
			// 隐藏授权窗口
			cancelButton() {
				this.$refs.bottomTopPanel.maskClick();
			},
			// 允许授权
			sureButton() {
				if (!this.isConsentAgreements) {
					this.$refs['Message'].error("同意《用户服务协议》及《隐私政策》!")
					return
				}
				uni.showLoading({
					mask: true,
					title: "正在加载中"
				})
				// 缓存是否同意用户协议
				uni.setStorageSync('isConsentAgreements', true)
				// 获取openid
				this.loadJsCode();
				// 隐藏panel
				this.$refs.bottomTopPanel.maskClick();
			},
			setIsConsent(e) {
				if (e.detail.value.length !== 0) {
					this.isConsentAgreements = true
				} else {
					this.isConsentAgreements = false
				}
			},
			goToNav(e) {
				console.log(e.target.dataset.name)
				const name = e.target.dataset.name
				if(name === 'yhffxy') {
					this.$routes.navTo('/pages/agreement/user-service-agreement');
				} else if (name === 'yszc') {
					this.$routes.navTo('/pages/agreement/privacy-policy');
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: rgb(249, 249, 249);
		height: 100%;
		.tz-text {
			// color: blue;
			text-decoration: underline blue;
		}
	}

	.bg-img-box {
		.bg-box {
			width: 100%;
			height: 240px;
		}
	}

	// 按钮box
	.btn-box {
		padding: 50rpx 60rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 150px;

		// transform: translateY(-50%);
		.list-box {
			display: flex;
			padding: 30rpx 40rpx;
			background-color: #fff;
			box-shadow: 3px 3px 8px 3px rgba(210, 210, 210, 0.7);
			border-radius: 10rpx;
			margin-bottom: 40rpx;
			color: #333;
			align-items: center;

			&:active {
				background-color: rgba(240, 240, 240, 0.7);
			}

			image {
				width: 100rpx;
				height: 100rpx;
				margin-right: 30rpx;
			}

			.title {
				font-size: $fz18;
				margin-bottom: 5px;
			}

			.grey {
				color: #666;
			}
		}

	}

	//
	.b-t-panel {

		//头部信息
		.auth-title-box {
			height: 50px;
			line-height: 50px;

			.left-box {
				image {
					width: 20px;
					height: 20px;
					position: relative;
					top: 3px;
				}

				.title {
					font-size: $fz16;
					font-weight: 500;
					margin: 0 10px;
				}
			}
		}

		//内容
		.auth-content-box {
			padding: 20px 0;
		}

		// 按钮信息
		.auth-btn-box {
			margin-top: 20px;

			view {
				width: 47%;
				height: 40px;
				line-height: 40px;
				text-align: center;
				border-radius: 5px;
				font-size: 16px;
			}

			.btn-cancel {
				background-color: rgba(230, 230, 230, 0.7);
				color: #39B54A;

				&:active {
					background-color: rgba(210, 210, 210, 0.7);
				}
			}

			.btn-sure {
				background-color: #39B54A;
				color: #fff;

				&:active {
					background-color: rgba(50, 150, 57, 0.7);
				}
			}
		}
	}
</style>
