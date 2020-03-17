<template>
	<view class="container">
		<!-- 人员信息 -->
		<view class="person-box">
			<view class="name">{{data.xm | tp}}</view>
			<!-- <view class="sex">
				<text>{{data.sex}}</text>
				<text>{{data.num}}</text>
			</view> -->
			<view class="cert">{{data.zjhm | rp}}</view>
			<view v-if="checkStatus == 1" class="btn-blue btn-box">
				<view>通行证有效</view>
			</view>
			<view v-else class="btn-red btn-box">
				<view>通行证无效</view>
			</view>
			<view v-if="checkStatus == 0 || checkStatus == -4" class="btn-explain">无效说明:{{data.appMsg}}</view>
			<view class="flex house-addr">
				<text class="label">居住地址</text>
				<text class="info">{{data.address | tp}}</text>
			</view>
		</view>
		<!-- 通过体温 -->
		<view v-if="checkStatus == 1" class="pass-box">
			<view class="flex house-addr  align-center">
				<text class="label">本次体温</text>
				<input type="text" class="info input-info" @value="yxtw" @input="updateYXInputChange" placeholder="请输入" />
				<text>°C</text>
			</view>
			<view class="pass-info">提醒:体温超过(37.3)为发热症状,若继续提交,系统会自动停用该人员的通行证</view>
			<button class="radius shadow submit-btn" @click.stop="formYXSubmit">提交</button>
		</view>
		<!-- 不通过数据 -->
		<view v-else class="nopass-box">
			<form @submit="formWXSubmit" @reset="formReset">
				<view class="flex house-addr align-center">
					<text class="label">本次体温</text>
					<input class="info input-info" name="tw" placeholder="请输入" />
					<text>°C</text>
				</view>
				<view class="flex house-addr align-center">
					<text class="label">备注</text>
					<input class="info input-info" name="mark" placeholder="请输入" style="flex:1;"/>
				</view>
				<view class="flex house-addr align-center">
					<checkbox-group>
						<label class="flex align-center flex-sub"  @click.stop="checkboxChange">
							<checkbox class="blue" :class="checked?'checked':''" :checked="checked?true:false" value="1"></checkbox>
							<view style="margin-left:10px;">激活通行证</view>
						</label> 
					</checkbox-group>
				</view>
				<button class="radius shadow submit-btn" form-type="submit">提交</button>
			</form>
		</view>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checked:false,
				// 数据信息
				data:"",
				// 1有效  0无效
				checkStatus:1,
				// 有效体温(提交信息)
				tw:"",
				// 有效体温(输入框信息)
				yxtw:"",
			};
		},
		onLoad(option) {
			this.loading();
			// 1有效  0无效
			this.checkStatus = option.status;
			// 获取保存的个人通行数据
			this.data = this.$store.state.personScanPersonData;
			uni.hideLoading();
		},
		methods: {
			// 通行证有效提交
			async formYXSubmit(){
				let _this = this;
				if(this.$custom.isEmpty(this.tw)){
					this.$refs['Message'].error("请输入体温");
					return false;
				}
				if(this.tw < 35 || this.tw > 45){
					this.$refs['Message'].error("体温输入超出范围,请重新输入");
					return false;
				}
				// 提交
				this.loading();
				let result = await this.$request.post(this.$api.register,{"openId":this.$store.state.openId,"temp":this.tw,"id":this.data.id});
				if(result.appCode == 1){
					this.$refs['Message'].success("登记成功");
					let timeout = setTimeout(function() {
						_this.$routes.navBack();
						clearTimeout(timeout)
					}, 2000);
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				wx.hideLoading();
			},
			// 通行证无效提交
			async formWXSubmit(e){
				let _this = this;
				let data = e.detail.value;
				if(this.$custom.isEmpty(data.tw)){
					this.$refs['Message'].error("请输入体温");
					return false;
				}
				if(data.tw < 35 || data.tw > 45){
					this.$refs['Message'].error("体温输入超出范围,请重新输入");
					return false;
				}
				if(!this.checked){
					this.$refs['Message'].error("请勾选激活通行证");
					return false;
				}
				// 提交
				this.loading();
				let result = await this.$request.post(this.$api.register,{"openId":this.$store.state.openId,"temp":data.tw,"mark":data.mark,"id":this.data.id});
				if(result.appCode == 1){
					this.$refs['Message'].success("登记激活成功");
					
					let timeout = setTimeout(function() {
						_this.$routes.navBack();
						clearTimeout(timeout)
					}, 2000);
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				wx.hideLoading();
				
			},
			// 复选框
			checkboxChange(e){
				this.checked = !this.checked;
			},
			// 监听体温输入(有效)
			updateYXInputChange(e){
				this.tw = e.detail.value;
			},
			// 显示load
			loading(){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
			},
		}
	}
</script>

<style lang="scss">
	page{
		background: rgb(239,239,239);
		height: 100%;
		// 扫码人员信息
		.person-box{
			border-bottom:1px solid $b-t;
			padding-top:20px;
			text-align: center;
			background: #fff;
			view{
				margin-bottom:15px;
			}
			.name{
				font-size: $fz18;
				font-weight: 500;
			}
			.sex,.cert{
				color: $color9;
				text:first-child{
					margin-right:10px;
				}
			}
			// 按钮盒子
			.btn-box{
				text-align: center;
				margin-bottom:0;
				view{
					display: inline-block;
					width: 140px;
					height: 40px;
					line-height: 40px;
					border-radius: 70px;
					color: #fff;
				}
			}
			.btn-blue{
				view{
					background-color: rgb(135,245,10);
				}
			}
			.btn-red{
				view{
					background-color: rgb(251,54,6);
				}
			}
			.btn-explain{
				color: rgb(252,86,54);
			}
		}
		// 居住地址
		.house-addr{
			padding:0 20px;
			height: 40px;
			line-height: 40px;
			margin-bottom:0;
			background: #fff;
			border-top:1px solid $b-t;
			.label{
				text-align: left;
				min-width: calc(4em + 15px);
			}
			.info{
				margin-right:10px;
				color: $color6;
			}
			.input-info{
				width: 50px;
			}
		}
		// 通过体温
		.pass-box{
			margin-top:20px;
			.pass-info{
				padding:10px 20px;
				color:rgb(246,118,80);
			}
		}
		// 不通过体温
		.nopass-box{
			margin-top:20px;
			.pass-info{
				padding:10px 20px;
				color:rgb(246,118,80);
			}
		}
		.submit-btn{
			height: 50px;
			margin: 50px 20px;
			line-height: 50px;
			text-align: center;
			background: rgb(26,136,203);
			color: #fff;
		}
	}
</style>
