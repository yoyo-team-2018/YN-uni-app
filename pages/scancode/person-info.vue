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
						<text>{{personnelInfo.xm | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">身份证号:</text>
						<text>{{personnelInfo.zjhm | rp}}</text>
					</view>
					<view class="row-list">
						<text class="label">籍贯:</text>
						<text>{{personnelInfo.jg | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">联系电话:</text>
						<text>{{personnelInfo.lxdh | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">出入村社:</text>
						<text>{{personnelInfo.jwhName | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">地址类型:</text>
						<text>{{personnelInfo.addressType | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">出入地址:</text>
						<text>{{personnelInfo.address | tp}}</text>
					</view>
					<view class="row-list reverse" v-if="data.length > 0">
						<view class="more" @click="showAddressDetail">更多出入地址 >></view>
					</view>
					<view class="row-list">
						<text class="label">工作地址:</text>
						<text>{{personnelInfo.workAddress | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">身份:</text>
						<text>{{personnelInfo.isTenant == 0 ? "业主" : (personnelInfo.isTenant == 1 ? "租客" : "") | tp}}</text>
					</view>
					<view class="row-list" v-if="personnelInfo.renterName">
						<text class="label">房东姓名:</text>
						<text>{{personnelInfo.renterName | tp}}</text>
					</view>
					<view class="row-list" v-if="personnelInfo.renterPhone" v-on:click="copyPhone">
						<text class="label">房东电话:</text>
						<text>{{personnelInfo.renterPhone | tp}}</text>
						<text class="iconfont icon-fuzhi fuzhi"></text>
					</view>
				</view>
			</view>
			<!-- 反穗情况 -->
			<view class="info">
				<view class="title">返穗情况</view>
				<view v-if="personnelInfo.alwaysInGz==1" class="content">
					<view class="row-list">一直在穗</view>
				</view>
				<!-- 信息 -->
				<view v-else class="content">
					<view class="row-list">
						<text class="label">返穗日期:</text>
						<text>{{personnelInfo.returnTime | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">出发地:</text>
						<text>{{personnelInfo.departAddress | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">返穗交通工具:</text>
						<text>{{personnelInfo.vehicle_dict | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">车牌/车次/航班号:</text>
						<text>{{personnelInfo.vehicleNum | tp}}</text>
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
	export default {
		data() {
			return {
				// 获取保存的个人通行数据
				data : [],
				personnelInfo: ""
			};
		},
		onLoad() {
			//初始加载个人信息
			this.lodaPersonInfo();
		},
		methods: {
			//初始加载个人信息
			async lodaPersonInfo(){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
				let result = await this.$request.post(this.$api.getMyInfo,{"openId":this.$store.state.openId});
				// 
				if(result.appCode == 1){
					this.data = result.data;
					console.log()
					this.personnelInfo = this.data[0]
					console.log(this.personnelInfo)
					// 保存用户登记数据到状态用户数据回显
					this.$store.dispatch('refreshRegisterData',result.data);
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				uni.hideLoading();
			},
			// 跳转到登记页面
			navPerson(){
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
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
		.person-info{
			border-bottom:1px solid $b-t;
		}

		.info{
			padding: 40rpx 30rpx;
			.title{
				font-size: $fz18;
			}
			// 列表
			.row-list{
				display: flex;
				padding-top: 10px;
				align-items:baseline;
				.label{
					min-width: calc(4em + 15px);
					color: $color6;
				}
				.more {
					color: blue;
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
