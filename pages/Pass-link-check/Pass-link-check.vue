<template>
	<scroll-view scroll-y>


		<uni-search-bar :radius="100" @confirm="search" @cancel="cancelSearch" placeholder="请输入姓名或身份证号"></uni-search-bar>
		<uni-pagination :total="total" :current="form.page" :pageSize="form.limit" @change="switchPage"></uni-pagination>
		<view class="tips" v-if="listLength">暂无数据</view>
		<view v-else>
			<block v-for="(item, index) in list" :key="index">
				<uni-card mode="title" :title="item.xm" thumbnail="false" :extra="item.checkStatus_dict" :item-id="index" @click="showDetail">
					<view class="card-container-item">
						<text>{{item.zjhm}}</text>
						<text>{{item.updateTime}}</text>
					</view>
					<view class="card-container-item">
						<view class="card-address">
							<view class="card-address-title">
								{{item.addressType}}:
							</view>
							<view class="card-address-container">
								{{ item.address }}
							</view>
						</view>
					</view>
				</uni-card>
			</block>
		</view>
	</scroll-view>
</template>

<script>
	import uniCard from '@/components/uni-card/uni-card.vue'
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import uniPagination from '@/components/uni-pagination/uni-pagination.vue'
	let Page = 0
	const limit = 20
	export default {
		components: {
			uniCard,
			uniSearchBar,
			uniPagination
		},
		data() {
			return {
				list: [],
				form: {
					info: '',
					page: 1,
					limit: 20,
				},
				total: 0, // 数据总量
			}
		},
		computed: {
			listLength() {
				if (this.list.length === 0) return true
				return false
			}
		},
		onShow() {
			this.loadData(this.form)
		},
		methods: {
			search(e) {
				this.form.info = e.value
				this.form.page = 1
				this.loadData(this.form)
			},
			cancelSearch() {
				this.form.page = 1
				this.form.info = ''
				this.loadData(this.form)
			},
			// 切换页码
			switchPage(e) {
				this.form.page = e.current
				this.loadData(this.form)
			},
			// 跳转修改页
			showDetail(id) {
				const data = this.list[id]
				// 缓存点击项的数据, 用于修改页数据回显
				this.$store.dispatch('refreshAuthorOtherData', data)
				// 跳转
				this.$routes.navTo('/pages/author-other/author-other')
			},
			loadData(form = this.form) {
				uni.showLoading({
					title: '数据加载中!'
				})
				this.loadAllCheckList(form)
			},
			// 获取列表信息
			async loadAllCheckList(form) {
				const {
					appCode,
					data,
					appMsg,
					count
				} = await this.$request.post(
					this.$api.getAllCheckList, form
				)
				uni.hideLoading()
				if (appCode == 1) {
					this.list = data
					this.total = count
				} else {
					this.$refs['Message'].error(appMsg)
				}
			}
		}
	}
</script>

<style lang="scss">
	uni-pagination {
		display: flex;
		justify-content: center;
		padding: 10rpx 0;
		background-color: #fff;
	}

	.tips {
		text-align: center;
		color: $font-color-light;
		font-size: $font-lg;
		margin-top: 30rpx;
	}

	.card-container-item {
		display: flex;
		justify-content: space-between;
		padding: 20rpx 10rpx;
		color: $font-color-disabled;

		.card-address {
			display: flex;
			align-items: center;

			.card-address-title {
				width: 130rpx;
			}

			.card-address-container {
				flex: 1;
			}
		}
	}
</style>
