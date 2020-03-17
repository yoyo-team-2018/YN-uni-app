<template>
	<view class="container">
		<scroll-view class="examine-box" scroll-y style="height:calc(100vh - 100px);">
			<!-- 个人信息 -->
			<view class="person-info info">
				<view class="title">个人信息</view>
				<!-- 信息 -->
				<view class="content">
					<view class="row-list">
						<text class="label">姓名:</text>
						<text>{{data.xm | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">身份证号:</text>
						<text>{{data.zjhm | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">籍贯:</text>
						<text>{{data.jg | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">联系电话:</text>
						<text>{{data.lxdh | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">出入村社:</text>
						<text>{{data.jwhName | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">地址类型:</text>
						<text>{{data.addressType | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">出入地址:</text>
						<text>{{data.address | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">工作地址:</text>
						<text>{{data.workAddress | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">身份:</text>
						<text>{{data.isTenant == 0? "业主" : (data.isTenant == 1 ? "租客" : "") | tp}}</text>
					</view>
					<view class="row-list" v-if="data.renterName">
						<text class="label">房东姓名:</text>
						<text>{{data.renterName | tp}}</text>
					</view>
					<view class="row-list" v-if="data.renterPhone" v-on:click="copyPhone">
						<text class="label">房东电话:</text>
						<text>{{data.renterPhone | tp}}</text>
						<text class="iconfont icon-fuzhi fuzhi"></text>
					</view>
				</view>
			</view>
			<!-- 居住证情况 -->
			<view class="person-info info">
				<view class="title">居住登记信息</view>
				<!-- 信息 -->
				<view class="content">
					<view class="row-list">
						<text class="label">联系电话:</text>
						<text>{{lslxdh | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">来穗登记地址:</text>
						<text>{{lsAddress | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">来穗比对结果:</text>
						<text :style="'color:' + lsVSdj.color ">{{lsVSdj.value | tp}}</text>
					</view>
				</view>
			</view>
			<!-- 反穗情况 -->
			<view class="info">
				<view class="title">返穗情况</view>
				<view v-if="data.alwaysInGz==1" class="content">
					<view class="row-list">一直在穗</view>
				</view>
				<!-- 信息 -->
				<view class="content">
					<view class="row-list">
						<text class="label">返穗日期:</text>
						<text>{{data.returnTime | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label">出发地:</text>
						<text>{{data.departAddress | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">返穗交通工具:</text>
						<text>{{data.vehicle_dict | tp}}</text>
					</view>
					<view class="row-list">
						<text class="label" style="padding-right:8px;">车牌/车次/航班号:</text>
						<text>{{data.vehicleNum | tp}}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 审核区域 -->
		<view class="btn-box">
			<button class="cu-btn bg-white shadow" @click.stop="submitNoPass">不通过</button>
			<button class="cu-btn bg-blue shadow" @click.stop="submitPass">通过</button>
		</view>
		<!-- pouple模块 -->
		<pouple v-on:pouple="pouple" ref="pouple"></pouple>
		<!-- confirm模块 -->
		<confirm v-on:confirm="confirm" ref="confirm"></confirm>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	import pouple from "@/components/pouple";//输入确定框
	import confirm from "@/components/confirm";//确定框
	export default {
		components: {
			pouple,
			confirm
		},
		data() {
			return {
				// 个人信息数据
				data:"",
				// 居住证电话
				lslxdh:"",
				// 来穗登记地址
				lsAddress:"",
				// 来穗比对结果提示
				// vsStatus:["未在来穗系统登记","来穗登记地址与用户提交地址不一致","来穗登记地址与用户申请地址一致"],
				vsStatus:[{
					color: 'red',
					value: '未在来穗系统登记'
				}, {
					color: 'red',
					value: '来穗登记地址与用户提交地址不一致'
				}, {
					color: 'green',
					value: '来穗登记地址与用户申请地址一致'
				}],
				// 来穗比对结果
				lsVSdj:"",
				// 默认审核列表页面跳过来
				flag:false
			};
		},
		onLoad(option) {
			this.loading();
			this.flag = option.flag;
			this.isIdToPersonData(option.id);
		},
		methods: {
			// 根据id初始个人信息
			async isIdToPersonData(id){
				let result = await this.$request.post(this.$api.edit,{"id":id});
				if(result.appCode == 1){
					// 登记信息
					this.data = result.data;
					// 居住证信息
					this.lsData = result.lsdata;
					// 如果地址为空
					if(this.$custom.isEmpty(this.lsData)){
						// 未在来穗登记
						this.lsVSdj = this.vsStatus[0];
						this.lslxdh = "";
					}else{
						// 拼接居住证地址
						this.lsAddress = this.lsData.xzq_dict+this.lsData.jz_dict+this.lsData.jwh_dict+this.lsData.jddm_dict+this.lsData.mpmc+this.lsData.dy;
						this.lslxdh = this.lsData.lxdh
						//比对登记信息 和 居住证信息
						if(this.data.fhid == this.lsData.fhid){
							// 来穗登记地址与用户申请地址一致
							this.lsVSdj = this.vsStatus[2];
						}else{
							// 来穗登记地址与用户提交地址不一致
							this.lsVSdj = this.vsStatus[1];
						}
						
					}
					
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				wx.hideLoading();
			},
			// 不通过
			submitNoPass(){
				this.$refs.pouple.show();
			},
			// 确认提交(不通过审核)
			async pouple(content){
				this.loading();
				let result = await this.$request.post(this.$api.passInApplet,{"openId":this.$store.state.openId,"status":1,"remark":content,id:this.data.id});
				if(result.appCode == 1){
					this.jumpPage();
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				this.$refs.pouple.hide();
				wx.hideLoading();
			},
			// 通过
			submitPass(){
				this.$refs.confirm.show();
			},
			// 确认提交输入框(通过审核)
			async confirm(){
				this.loading();
				let result = await this.$request.post(this.$api.passInApplet,{"openId":this.$store.state.openId,"status":2,id:this.data.id});
				if(result.appCode == 1){
					this.jumpPage();
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				this.$refs.confirm.hide();
				wx.hideLoading();
			},
			// 判断跳转页面
			jumpPage(){
				if(this.flag){
					//如果是管理员
					if(this.$store.state.userType == 1){
						this.$routes.redTo('/pages/index/manager');
					}else{
						this.$routes.redTo('/pages/index/index');
					}
					// this.$system.getBackPage().loadExamineList();
				
				}else{
				 	this.$routes.navBack();
				}
			},
			// 显示load
			loading(){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
			},
			copyPhone() {
				wx.setClipboardData({
				  data: this.data.renterPhone
				})
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
				// &.left-border{
				// 	position:relative;
				// 	padding-left:5px;
				// 	&:after{
				// 		content: "";
				// 		display: inline-block;
				// 		position:absolute;
				// 		height: 80%;
				// 		left:0;
				// 		top:10%;
				// 		border-left:4px solid #0081ff;
				// 	}
				// }
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
			}
		}
		// 按钮区域
		.btn-box{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 56px;
			background: $b-t;
			padding: 0 10%;
			button{
				width: 40%;
			}
		}
		
		.fuzhi {
			font-size: 30rpx;
			margin-left: 15rpx;
		}
	}
	/* em代表当前一个字号的宽度 */
	/* min-width: calc(4em + 15px); */
</style>
