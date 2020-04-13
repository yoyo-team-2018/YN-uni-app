<template>
	<view class="container">
		<scroll-view class="examine-box" scroll-y style="height:100vh;">
			<!-- 个人信息 -->
			<view class="person-info info">
				<view class="title">个人信息</view>
				<!-- 信息 -->
				<view class="content">
					<view class="row-list">
						<text class="label">姓名:</text>
						<text>{{personnelInfo.xm}}</text>
					</view>
					<view class="row-list">
						<text class="label">证件类型:</text>
						<text>{{personnelInfo.zjlx_dict}}</text>
					</view>
					<view class="row-list">
						<text class="label">证件号码:</text>
						<text>{{personnelInfo.zjhm | rp}}</text>
					</view>
					<view class="row-list">
						<text class="label">籍贯:</text>
						<text>{{personnelInfo.jg}}</text>
					</view>
					<view class="row-list">
						<text class="label">联系电话:</text>
						<text>{{personnelInfo.lxdh}}</text>
					</view>
					<view class="row-list">
						<text class="label">出入村社:</text>
						<text>{{personnelInfo.jwhName}}</text>
					</view>
					<view class="row-list">
						<text class="label">地址类型:</text>
						<text>{{personnelInfo.addressType}}</text>
					</view>
					<view class="row-list">
						<text class="label">出入地址:</text>
						<text>{{personnelInfo.address}}</text>
					</view>
					<view class="row-list reverse" v-if="data.length > 0">
						<view class="more" @click="showAddressDetail">更多出入地址 >></view>
					</view>
					<view class="row-list">
						<text class="label">工作地址:</text>
						<text>{{personnelInfo.workAddress}}</text>
					</view>
					<view class="row-list">
						<text class="label">授权角色:</text>
						<text>{{personnelInfo.sqdx_dict || ''}}</text>
					</view>
					<view class="row-list" v-if="personnelInfo.renterName">
						<text class="label">房东姓名:</text>
						<text>{{personnelInfo.renterName}}</text>
					</view>
					<view class="row-list" v-if="personnelInfo.renterPhone" v-on:click="copyPhone">
						<text class="label">房东电话:</text>
						<text>{{personnelInfo.renterPhone}}</text>
						<text class="iconfont icon-fuzhi fuzhi"></text>
					</view>
					<view class="row-list">
						<text class="label">授权照片:</text>
						<view class="view-img">
							<image :src="imgSrc" mode="aspectFill" @click="previewImg"></image>
						</view>
					</view>
				</view>
			</view>
			<!-- 返穗情况 -->
			<view class="person-info info">
				<view class="title">返穗情况</view>
				<view v-if="personnelInfo.alwaysInGz==1" class="content">
					<view class="row-list">一直在穗</view>
				</view>
				<!-- 信息 -->
				<view v-else class="content">
					<view class="row-list">
						<text class="label">返穗日期:</text>
						<text>{{personnelInfo.returnTime}}</text>
					</view>
					<view class="row-list">
						<text class="label">出发地:</text>
						<text>{{personnelInfo.departAddress}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">返穗交通工具:</text>
						<text>{{personnelInfo.vehicle_dict}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">车牌/车次/航班号:</text>
						<text>{{personnelInfo.vehicleNum}}</text>
					</view>
				</view>
			</view>
			<!-- 近期状况 -->
			<view class="info">
				<view class="title">近期状况</view>
				<view class="content">
					<view class="row-list">
						<text class="label">个人健康状况:</text>
						<text>{{personnelInfo.symptomsName}}</text>
					</view>
					<view class="row-list">
						<text class="label">是否常住广州:</text>
						<text>{{personnelInfo.residentFlagName}}</text>
					</view>
					<view class="row-list">
						<text class="label">近期旅居史:</text>
						<view><text>{{personnelInfo.travelRegionClassName}}</text></view>
					</view>
				</view>
			</view>
			<!--  -->
			<!-- <view class="padding">
				<button class="cu-btn block bg-blue margin-tb-sm lg" @click.stop="navPerson">修改个人信息</button>
			</view> -->
		</scroll-view>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	import {
		IMAGE_PATH
	} from '../../common/config.js'
	export default {
		data() {
			return {
				// 获取保存的个人通行数据
				data: [],
				personnelInfo: "",
				imgSrc: ''
			};
		},
		onLoad() {
			//初始加载个人信息
			this.lodaPersonInfo();
		},
		methods: {
			//初始加载个人信息
			async lodaPersonInfo() {
				uni.showLoading({
					mask: true,
					title: "正在加载中"
				});
				let result = await this.$request.post(this.$api.getMyInfo, {
					"openId": this.$store.state.openId
				});
				// 
				if (result.appCode == 1) {
					this.data = result.data;
					this.personnelInfo = this.data[0]
					this.imgSrc = IMAGE_PATH + this.personnelInfo.fid
					// 保存用户登记数据到状态用户数据回显
					this.$store.dispatch('refreshRegisterData', result.data);
				} else {
					this.$refs['Message'].error(result.appMsg);
				}
				uni.hideLoading();
			},
			// 跳转到登记页面
			navPerson() {
				this.$routes.navTo('/pages/EPass/EPassIndex');
			},
			// 复制房东手机号码
			copyPhone() {
				wx.setClipboardData({
					data: this.personnelInfo.renterPhone
				})
			},
			// 跳转页面 -- 查看全部出入地址信息
			showAddressDetail() {
				this.$routes.navTo('/pages/scancode/person-address-detail');
			},
			// 查看图片详情
			previewImg() {
				uni.previewImage({
					urls: [this.imgSrc],
				})
			}

		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;

		.person-info {
			border-bottom: 1px solid $b-t;
		}

		.info {
			padding: 40rpx 30rpx;

			.title {
				font-size: $fz18;
			}

			// 列表
			.row-list {
				display: flex;
				padding-top: 10px;
				align-items: center;

				.label {
					min-width: calc(4em + 20px);
					color: #aaa;
					margin-right: 20rpx;
				}

				.more {
					color: #699ef9;
				}

				.view-img {
					padding: 10rpx;

					image {
						width: 100rpx;
						height: 100rpx;
						border: 2rpx solid #eee;
					}
				}
			}

			.reverse {
				flex-direction: row-reverse;
			}
		}

		.fuzhi {
			font-size: 30rpx;
			margin-left: 15rpx;
		}
	}
</style>
