<template>
	<view class="container">
		<view class="bg-img-box">
			<image src="../../static/bg.png"></image>
		</view>
		<!-- 按钮区域 -->
		<view class="btn-box">
			<!-- 循环按钮 -->
			<view class="list-box" 
				v-for="(items,index) in btnList" 
				:key="items.menuId" 
				@click.stop="clickItem(items.menuCode)">
				<image :src="imgPrefix+items.menuCode+imgSuffix"></image>
				<view>
					<view class="title">{{items.menuName}}</view>
					<view class="grey">{{items.remark}}</view>
				</view>
			</view>
			<!-- 固定按钮 -->
			<view v-if="register" class="list-box"  @click="navRegister">
			<!-- <view class="list-box"  @click="navRegister"> -->
				<image src="../../static/register.png"></image>
				<view>
					<view class="title">{{registerBtnName}}</view>
					<view class="grey">填写个人相关信息</view>
				</view>
			</view>
			
			<view class="list-box" @click="navPersonInfo">
				<image  src="../../static/person.png"></image>
				<view>
					<view class="title">个人信息</view>
					<view class="grey">查看个人的详细信息</view>
				</view>
			</view>
			<view class="list-box"  @click="navPersonZJ">
				<image src="../../static/wd.png"></image>
				<view>
					<view class="title">我的穗康码（海珠）</view>
					<view class="grey">查询我的穗康码（海珠）</view>
				</view>
			</view>
			<view class="list-box" @click.stop="navExitRecord">
				<image src="../../static/txjl.png"></image>
				<view>
					<view class="title">通行记录</view>
					<view class="grey">查看个人的通行记录</view>
				</view>
			</view>
			
			<!-- <view class="list-box" @click="navTongxing">
				<image  src="../../static/sh.png"></image>
				<view>
					<view class="title">通行证审核</view>
					<view class="grey">审核初次办理的通行证</view>
				</view>
			</view>
			<view class="list-box" @click="navCaozuo">
				<image src="../../static/czls.png"></image>
				<view>
					<view class="title">操作历史</view>
					<view class="grey">查看我的放行、审核记录</view>
				</view>
			</view> -->
			
		</view>
		<!-- confirm模块 -->
		<confirm v-on:confirm="confirm" ref="confirm"></confirm>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>
<script>
	import confirm from "@/components/confirm";//确定框
	export default {
		components: {
			confirm
		},
		data() {
			return {
				// 默认不显示登记按钮 false => 2.0 开放一人多地址, 需开放一直注册, 修改为 true
				register:true,
				// 申请通行证
				registerBtnName:"申请穗康码（海珠）",
				btnList:[],//按钮数据集合
				imgSuffix:".png",//后缀
				imgPrefix:"../../static/" //前缀
			};
		},
		onLoad() {
			uni.showLoading({
				mask:true,
			    title: "正在加载中"
			});
			// 初始判断是否登记
			this.isRegister();
		},
 		methods: {
			async isRegister(){
				// 请求判断是否登记过
				let result = await this.$request.post(this.$api.getMyInfo,{"openId":this.$store.state.openId});
				console.log(result)
				// 1登记
				if(result.appCode == 1){
					// 保存用户登记数据到状态
					this.$store.dispatch('refreshRegisterData',result.data);
					
					// 2.0
					// 一人多证
					if (result.data.length >= 1) {
						this.registerBtnName = "申请多个穗康码（海珠）";
					} else {
						this.registerBtnName = "申请穗康码（海珠）";
					}
					
					// 1.0
					//checkStatus  1代表登记过，但是审核不通过，需要重新登记
					// if(result.data.checkStatus == 1){
					// 	this.registerBtnName = "重新申请通行证";
					// 	this.register = true;
					// }else{
					// 	this.registerBtnName = "申请通行证";
					// 	this.register = false;
					// }
				}else{
					/// -1未登记
					// this.register = true;
					this.registerBtnName = "申请穗康码（海珠）";
					// 保存用户登记数据到状态
					this.$store.dispatch('refreshRegisterData',"");
				}
				// 请求按钮组
				this.getBtnList();
			},
			// 按钮权限
			async getBtnList(){
				let res = await this.$request.post(this.$api.isAdmin,{"openId":this.$store.state.openId});
				if(res.appCode == 1){
					this.btnList = res.data;
				}else{
					this.btnList = [];
				}
				wx.hideLoading();
				
			},
			// 根据图标判断调用方法
			clickItem(index){
				let _this = this;
				switch(index){
					case "smfx":
						_this.scanInfo();//扫码
						break;
					case "sh":
						_this.navTongxing();//通行证审核
						break;
					case "czls":
						_this.navCaozuo();//操作历史
						break;
				}
			},
			// 登记
			navRegister(){
				this.navToPage('EPass/EPassIndex');
			},
			// 扫二维码信息
			scanInfo(){
				let _this = this;
				this.$system.scanCode((res)=>{
					_this.loadScanInfo(res.result);
				});
				
			},
			// 通行审核
			navTongxing(){
				this.navToPage('examine/examine-list');
			},
			// 操作历史
			navCaozuo(){
				this.navToPage('operation-history/operation-history');
			},
			// 我的通行证
			navPersonZJ(){
				this.navToPage('EPass/qrcode');
			},
			// 通行记录
			navExitRecord(){
				this.navToPage('scancode/current-record');
			},
			// 个人信息
			 navPersonInfo(){
				 this.navToPage('scancode/person-info');
			 },
			// 加载扫码准入信息
			async loadScanInfo(code){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
				let result = await this.$request.post(this.$api.isAdmittance,{id:code,"openId":this.$store.state.openId});
				// 如果信息正常跳转到放行页面
				if(result.appCode == 1 || result.appCode == 0 || result.appCode == -4 || result.appCode == -5){
					result.data.appMsg = result.appMsg;
					// 保存数据到状态
					this.$store.dispatch('refreshScanPersonData',result.data);
					// 1有效  0无效
					this.navToPage("scancode/person?status="+result.appCode);
				// 未审核跳转到审核页面
				}else if(result.appCode == -1){
					
					this.navToPage("examine/examine-list-detail?id="+result.data.id+"&flag=true");
				// 提示注意信息(该人员审核未通过，请谨慎放行)
				}else if(result.appCode == -3){
					this.showConfirm(result.appMsg);
				// 提示信息
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				wx.hideLoading();
			},
			//详情页
			navToPage(url) {
				this.$routes.navTo('/pages/'+url);
			},
			// 显示提示
			showConfirm(content){
				this.$refs.confirm.show({title:"注意",content:content,sure:"确定"});
			},
			// 确认提交输入框(通过审核)
			confirm(){
				this.$refs.confirm.hide();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: rgb(249,249,249);
		height: 100%;
	}
	.bg-img-box{
		image{
			width: 100%;
			height: 240px;
		}
	}
	// 按钮box
	.btn-box{
		padding: 50rpx 60rpx;
		position: absolute;
		left: 0;
		right: 0;
		top:150px;
		// transform: translateY(-50%);
		.list-box{
			display:flex;
			padding: 30rpx 40rpx;
			background-color: #fff;
			box-shadow: 3px 3px 8px 3px rgba(210, 210, 210, 0.7);
			border-radius: 10rpx;
			margin-bottom:40rpx;
			color:#333;
			align-items:center;
			&:active{
				background-color: rgba(240, 240, 240, 0.7);		
			}
			image{
				width:100rpx;
				height:100rpx;
				margin-right: 30rpx;
			}
			.title{
				font-size: $fz18;
				margin-bottom:5px;
			}
			.grey{
				color: #666;
			}
		}
		
	}
	
</style>
