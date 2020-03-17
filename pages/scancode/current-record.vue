<template>
	<view class="container">
		<view class="page-box">
			<uni-pagination v-if="dataList.length>0" @change="jumpPage" title="标题文字" :pageSize="pageSize" :total="total" :current="currentPage" :canClick="canFetch"></uni-pagination>
		</view>
		<scroll-view scroll-y style="height:calc(100vh - 41px);">
			<!-- record-list -->
			<view  v-if="dataList.length>0" class="record-box">
				<view class="record-list" 
						v-for="(data,index) in dataList" 
						:key="data.id">
					<view class="title">
						<text class="name">{{data.xm | tp}}</text>
						<view>
							<text>{{data.createTime | tp}}</text>
						</view>
					</view>
					<view class="title">
						<text class="text">{{data.zjhm | rp}}</text>
						<view>
							<text class="mr">体温:</text>
							<text>{{data.temp}}°C</text>
						</view>
					</view>
					<view class="title">
						<text class="text">{{data.address | tp}}</text>
						<view>
							<text class="mr">通行:</text>
							<text v-if="data.isPass == 1">是</text>
							<text v-else>否</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 无数据 -->
			<view v-else class="none-data">无数据</view>
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
				// 通行记录集合
				dataList:"",
				pageSize:20,//每页显示的数据量
				total:1,//总页数
				currentPage:1,//当前页数
				canFetch:false,// 判断是否有数据，点击下一页时会判断
			};
		},
		onLoad() {
			// 初始加载通行记录
			this.lodaRecord();
		},
		methods: {
			//初始加载通行记录
			async lodaRecord(){
				uni.showLoading({
					mask:true,
				    title: "正在加载中"
				});
				// 增加分页参数
				let data = {
					openId:this.$store.state.openId,
					limit : this.pageSize,
					page : this.currentPage
				}
				let result = await this.$request.post(this.$api.getMyRegisterLog,data);
				// 
				if(result.appCode == 1){
					this.dataList = result.data.records;
					this.total = result.data.total;
					this.canFetch = true;
				}else{
					this.$refs['Message'].error(result.appMsg);
				}
				uni.hideLoading();
			},
			// 点击分页
			jumpPage(e){
				// 如果有数据
				if(this.canFetch){
					this.canFetch = false;
					// 当前页码
					this.currentPage = e.current;
					// 初始加载通行记录
					this.lodaRecord();
				}
			}
			
		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
		height: 100%;
		.container{
			height: 100%;
		}
		.record-box{
			padding-bottom:60px;
		}
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
			}
		}
		.none-data{
			text-align: center;
			margin-top: 100px;
		}
	}
</style>
