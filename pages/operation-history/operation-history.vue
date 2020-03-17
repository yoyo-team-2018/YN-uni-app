<template>
	<view class="container">
		<!-- tab -->
		<view class="tab-box flex">
			<view :class="index == 1?'active':''" @click.stop="tabClick(1)">放行记录</view>
			<view :class="index == 2?'active':''" @click.stop="tabClick(2)">审核记录</view>
		</view>
		<!-- search -->
		<view class="search-box flex">
			<view class="input-box" @click.stop="clickInput" placeholder="姓名/身份证号">{{info}}</view>
			<view class="time-box">
				<picker mode="date" @change="bindChange" data-name="zjrqStart">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
		</view>
		<!-- 分页 -->
		<view v-if="index == 1" class="page-box">
			<uni-pagination v-if="fxList.length>0" @change="jumpPage" title="标题文字" :pageSize="pageSize" :total="total" :current="currentPage" :canClick="canFetch"></uni-pagination>
		</view>
		<!-- 分页 -->
		<view v-else class="page-box">
			<uni-pagination v-if="shList.length>0" @change="jumpPage" title="标题文字" :pageSize="pageSize" :total="total" :current="currentPage" :canClick="canFetch"></uni-pagination>
		</view>
		<!-- 放行记录 -->
		<view v-if="index == 1" class="record-box">
			<scroll-view v-if="fxList.length>0" scroll-y style="height:calc(100vh - 143px);">
				<!-- record-list -->
				<view>
					<view v-for="(items,index) in fxList" :key="items.id" class="record-list">
						<view class="title">
							<text class="name">{{items.xm | tp}} <text v-if="data.zjhmRed" :class="data.zjhmRed?'red':''">(湖北籍)</text></text>
							<view>
								<text>{{items.createTime | tp}}</text>
							</view>
						</view>
						<view class="title">
							<text class="text" :class="data.zjhmRed?'red':''">{{items.zjhm | rp}}</text>
							<view>
								<text class="mr" :class="items.wd?'red':''">体温:</text>
								<text  :class="items.wd?'red':''">{{items.temp | tp}}°C</text>
							</view>
						</view>
						<view class="title">
							<text class="text">{{items.address | tp}}</text>
							<view>
								<text class="mr">通行:</text>
								<text v-if="items.isPass == 1">是</text>
								<text v-else>否</text>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 无数据 -->
			<view v-else class="none-data">无数据</view>
		</view>
		<!-- 审核记录 -->
		<view v-if="index == 2" class="record-box">
			<scroll-view v-if="shList.length>0" scroll-y style="height:calc(100vh - 143px);">
				<!-- record-list -->
				<view>
					<view v-for="(items,index) in shList" :key="items.id" class="record-list">
						<view class="title">
							<text class="name">{{items.xm | tp}} <text v-if="data.zjhmRed" :class="data.zjhmRed?'red':''">(湖北籍)</text></text>
							<view>
								<button v-if="items.checkResult == 2" class="cu-btn bg-green shadow" style="margin-left:30px;">通过</button>
								<button v-else class="cu-btn bg-red shadow" style="margin-left:30px;">不通过</button>
							</view>
						</view>
						<view class="title">
							<text class="text" :class="data.zjhmRed?'red':''">{{items.zjhm | rp}}</text>
							<view>
								<text>{{items.checkTime | tp}}</text>
							</view>
						</view>
						<view class="title">
							<text class="text">{{items.address | tp}}</text>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 无数据 -->
			<view v-else class="none-data">无数据</view>
		</view>
		<!-- poupleInput模块 -->
		<pouple-input v-on:poupleInput="poupleInput" ref="poupleInput"></pouple-input>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	import poupleInput from "@/components/pouple-input";//输入确定框
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'//分页组件
	export default {
		components: {
			poupleInput,uniPagination
		},
		data() {
			return {
				index:1,
				info:"姓名/身份证号",
				date:this.$custom.getYMD(),
				fxList:[],//放行记录
				shList:[],// 审核记录
				pageSize:20,//每页显示的数据量
				total:20,//总页数
				currentPage:1,//当前页数
				canFetch:false,// 判断是否有数据，点击下一页时会判断
				
				queryData:{
					info:"",
					date:"",
					adminOpenId:this.$store.state.openId,
					limit : 20,
					page : 1,//请求参数
				}
			};
		},
		onLoad() {
			this.loadHistoryRecord();
		},
		methods: {
			// 初始放行记录
			async loadHistoryRecord(){
				this.loading();
				if(this.queryData.info == '姓名/身份证号'){
					this.queryData.info = "";
				}
				let result = await this.$request.post(this.$api.getRegisterLog,this.queryData);
				if(result.appCode == 1){
					result.data.records.forEach(data=>{
						if(!this.$custom.isEmpty(data.temp) && parseFloat(data.temp)>=37.4){
							data.wd = true;
						}else{
							data.wd = false;
						}
						let str = data.zjhm.slice(0,2);
						data.zjhmRed = str == "42"?true:false;
					});
					this.canFetch = true;
					this.total = result.data.total;
					this.fxList = result.data.records;
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				wx.hideLoading();
			},
			// 审核记录
			async loadHistoryExamine(){
				this.loading();
				if(this.queryData.info == '姓名/身份证号'){
					this.queryData.info = "";
				}
				let result = await this.$request.post(this.$api.getCheckLog,this.queryData);
				if(result.appCode == 1){
					result.data.records.forEach(data=>{
						let str = data.zjhm.slice(0,2);
						data.zjhmRed = str == "42"?true:false;
					});
					this.canFetch = true;
					this.total = result.data.total;
					this.shList = result.data.records;
				}else{
					this.$refs['Message'].error(result.data.appMsg);
				}
				wx.hideLoading();
			},
			// tab切换
			tabClick(index){
				this.index = index;
				// 切换时清除输入框数据
				this.info = "姓名/身份证号"; 
				// 清除分页为起始页
				this.currentPage = 1;
				this.queryData = {
					info:this.info,
					date:this.date,
					adminOpenId:this.$store.state.openId,
					limit : this.pageSize,
					page : this.currentPage
				}
				
				// 发起请求
				this.queryRecord();
			},
			// 选择时间事件
			bindChange(e){
				this.date = e.detail.value;
				// 清除分页为起始页
				this.currentPage = 1;
				// 请求数据
				this.queryData = {
					info:this.info,
					date:this.date,
					adminOpenId:this.$store.state.openId,
					limit : this.pageSize,
					page : this.currentPage
				}
				// 发起请求
				this.queryRecord();
			},
			// 点击弹出panel输入框
			clickInput(){
				this.$refs.poupleInput.show();
			},
			// 子组件传值确认按钮
			poupleInput(info){
				this.$refs.poupleInput.hide();
				this.info = info;
				// 清除分页为起始页
				this.currentPage = 1;
				this.queryData = {
					info:info,
					date:this.date,
					adminOpenId:this.$store.state.openId,
					limit : this.pageSize,
					page : this.currentPage
				}
				// 发起请求
				this.queryRecord();
			},
			// 区分请求
			queryRecord(){
				if(this.index == 1){
					// 加载放行记录
					this.loadHistoryRecord();
				}else{
					// 加载审核记录
					this.loadHistoryExamine();
				}
			},
			// 点击分页
			jumpPage(e){
				// 如果有数据
				if(this.canFetch){
					this.canFetch = false;
					// 当前页码
					this.currentPage = e.current;
					this.queryData.page = this.currentPage;
					// 区分审核记录
					if(this.index == 1){
						// 加载放行记录
						this.loadHistoryRecord();
					}else{
						// 加载审核记录
						this.loadHistoryExamine();
					}
				}
			},
			// 显示load
			loading(){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
			}
			
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
		height: 100%;
		.container{
			height: 100%;
		}
		// tab
		.tab-box{
			height: 50px;
			line-height: 50px;
			text-align:center;
			view{
				width: 50%;
				position:relative;
			}
			.active{
				&::after{
					content: "";
					display: inline-block;
					position:absolute;
					width: 50%;
					height: 3px;
					bottom: 0;
					left:25%;
					margin: auto;
					background: #0079FE;
				}
			}
		}
		// 搜索区域
		.search-box{
			padding: 10px 15px;
			background: #EFEFEF;
			// input{
			// 	height: 32px;
			// 	width: 60%;
			// 	background: rgb(224,224,224);
			// 	border-radius: 6rpx;
			// 	padding:0 10px;
			// }
			.input-box{
				line-height: 32px;
				font-size: 14px;
				background: rgb(224,224,224);
				padding: 0 10px;
				width: 200px;
				color: $color6;
			}
			.time-box{
				height: 32px;
				line-height: 32px;
				flex: 1;
				padding-left:10px;
				background: #fff;
				margin-left:30px;
				background: rgb(224,224,224);
				color: $color6;
			}
		}
		.record-box{
			padding-bottom:60px;
		}
		// 审核列表
		.record-list{
			padding:20rpx 40rpx;
			border-bottom:1px solid $b-t;
			&:active{
				background: $b-t;
			}
			&:last-child{
				margin-bottom: 200px;
			}
			// 头
			.title{
				display: flex;
				justify-content: space-between;
				align-items:flex-end;
				margin-bottom:10px;
				.name{
					font-size: $fz18;
				}
				view{
					color: $color9;
				}
				.text{
					color: $color9;
				}
				.mr{
					margin-right:5px;
				}
				.red{
					color: #e4393c;
					font-weight: bold;
				}
			}
		}
		.none-data{
			text-align: center;
			margin-top: 100px;
		}
	}
</style>
