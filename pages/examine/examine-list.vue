<template>
	<view class="container">
		<scroll-view scroll-y style="height:100vh;">
			<!-- input搜索框 -->
			<view class="search-box flex justify-between">
				<input type="text" @input="updateInputChange" value="" placeholder="姓名/身份证号" />
				<button class="cu-btn bg-blue shadow" @click.stop="formSubmit">查询</button>
			</view>
			<view class="page-box">
				<uni-pagination v-if="examineList.length>0" @change="jumpPage" title="标题文字" :pageSize="pageSize" :total="total" :current="currentPage" :canClick="canFetch"></uni-pagination>
			</view>
			<!-- examine审核列表 -->
			<scroll-view class="examine-box" scroll-y style="height:calc(100vh - 93px);">
				<view  v-if="examineList.length>0">
					<view  class="examine-list" 
						v-for="(items,index) in examineList" 
						:key="items.id"
						@click="navToPage('examine/examine-list-detail?id='+items.id+'&flag=false')">
						<view class="title">
							<text class="name">{{items.xm}} <text v-if="items.zjhmRed" :class="items.zjhmRed?'red':''">(湖北籍)</text></text>
							<view>
								<text>{{items.createTime | tp}}</text>
							</view>
						</view>
						<text class="text" :class="items.zjhmRed?'red':''">{{items.zjhm | rp}}</text>
					</view>
				</view>
				<!-- 无数据 -->
				<view v-else class="none-data">无数据</view>
			</scroll-view>
			<!-- 扫码审核按钮 -->
			<view class="scan-box bg-blue">
				<view @click.stop="scanInfo" ><image src="../../static/sancode.png" mode=""></image>扫码审核</view>
			</view>
		</scroll-view>
		<!-- 消息提示组件 -->
		<message ref="Message" :duration="2000" background></message>
	</view>
</template>

<script>
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'//分页组件
	export default {
		components: {uniPagination},
		data() {
			return {
				// 审核记录
				examineList:[],
				// 姓名身份证
				content:"",
				pageSize:20,//每页显示的数据量
				total:1,//总页数
				currentPage:1,//当前页数
				canFetch:false,// 判断是否有数据，点击下一页时会判断
			};
		},
		onLoad() {
			this.loadExamineList();
		},
		methods: {
			// 初始加载审核数据
			async loadExamineList(){
				this.loading();
				// 增加分页参数
				let data = {
					adminOpenId:this.$store.state.openId,
					info:this.content,
					limit : this.pageSize,
					page : this.currentPage,
					checkStatus: '0'
				}
				
				let result = await this.$request.post(this.$api.checkList,data);
				if(result.code == 0){
					result.data.forEach(data=>{
						let str = data.zjhm.slice(0,2);
						data.zjhmRed = str == "42"?true:false;
					});
					this.total = result.count;
					this.examineList = result.data;
					this.canFetch = true;
				}
				wx.hideLoading();
			},
			// 监听输入
			updateInputChange(e){
				this.content = e.detail.value;
			},
			// 根据姓名查询证件号码
			async formSubmit(){
				if(this.$custom.isEmpty(this.content)){
					this.$refs['Message'].error("查询不能为空");
					return false;
				}
				this.loadExamineList();
			},
			// 显示load
			loading(){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
			},
			// 扫二维码信息
			scanInfo(){
				let _this = this;
				this.$system.scanCode((res)=>{
					_this.loadScanInfo(res.result);
				});
			},
			// 扫码审核
			async loadScanInfo(code){
				let result = await this.$request.post(this.$api.isAdmittance,{id:code,"openId":this.$store.state.openId});
				if(result.appCode == 1 || result.appCode == 0 || result.appCode == -4 || result.appCode == -5){
					result.data.appMsg = result.appMsg;
					// 保存数据到状态
					this.$store.dispatch('refreshScanPersonData',result.data);
					// 1有效  0无效
					this.navToPage("scancode/person?status="+result.appCode);
				}else if(result.appCode == -1){
					this.navToPage("examine/examine-list-detail?id="+result.data.id+"&flag=true");
				}else if(result.appCode == -3){
					this.showConfirm(result.appMsg);
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
			},
			// 点击分页
			jumpPage(e){
				// 如果有数据
				if(this.canFetch){
					this.canFetch = false;
					// 当前页码
					this.currentPage = e.current;
					// 分页加载
					this.loadExamineList();
				}
			},
			//详情页
			navToPage(url) {
				this.$routes.navTo('/pages/'+url);
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
		// 搜索框
		.search-box{
			padding: 10px 15px;
			background: #EFEFEF;
			input{
				height: 32px;
				flex:1;
				background: #E0E0E0;
				border-radius: 6rpx;
				padding:0 10px;
				margin-right: 5px;
			}
		}
		// 审核盒子
		.examine-box{
			padding-bottom:60px;
			// 审核列表
			.examine-list{
				padding:20rpx 40rpx;
				border-bottom:1px solid $b-t;
				&:active{
					background: $b-t;
				}
				&:last-child{
					margin-bottom: 100px;
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
				}
				.text{
					color: $color9;
				}
				.red{
					color: #e4393c;
					font-weight: bold;
				}
			}
		}
		// 扫码审核按钮
		.scan-box{
			position: fixed;
			bottom: 0;
			left:0;
			right: 0;
			line-height: 50px;
			// padding-bottom: 10px;
			color: #fff;
			box-shadow: 3px 3px 4px rgba(0, 102, 204, 0.2);
			view{
				height: 100%;
				width:100%;
				text-align:center;
				font-size:$fz16;
				image{
					width: 20px;
					height: 20px;
					position: relative;
					top: 4px;
					left: -10px;

				}
			}
		}
		.none-data{
			text-align: center;
			margin-top: 100px;
		}
	}
</style>
