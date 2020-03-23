<template>
	<view>
		<text class="title">{{echoName != '' ? echoName : (values.length === 0 ? "请选择" : valuesStr.name)}}</text>
		<uni-popup ref="popup" type="bottom" maskClick="false" animation="false">
			<checkbox-group @change="checkboxChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="item in items" :key="item.value">
					<view>
						<checkbox :value="item.value" :checked="item.checked" />
					</view>
					<view class="uni-list-text">{{item.name}}</view>
				</label>
			</checkbox-group>
			<button type="primary" @click="closePopup">确定</button>
		</uni-popup>
	</view>
</template>

<script>
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				values: [], // 选中的value
			}
		},
		computed: {
			valuesStr() {
				const str = {
					value: '',
					name: ''
				}
				if (this.values.length !== 0) {
					for (const i of this.values) {
						str.value += i + ','
						for (const [index, value] of this.items.entries()) {
							if (value.value == i) {
								str.name += value.name + ','
							}
						}
					}
					str.value = str.value.slice(0, str.value.length - 1)
					str.name = str.name.slice(0, str.name.length - 1)
				}
				return str
			},
		},
		props: {
			items: {
				type: Array,
				required: true
			},
			echoName: String
		},
		methods: {
			// 每次 check 都会执行
			checkboxChange: function(e) {
				this.values = e.detail.value
			},
			// 打开弹窗
			open() {
				this.$refs.popup.open()
			},
			// 关闭弹窗, 传值到父组件
			closePopup() {
				this.$refs.popup.close()
				this.$emit('getCheckboxData', this.valuesStr)
			}
		}
	}
</script>

<style lang="scss" scoped>
	checkbox-group {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 10rpx 10rpx 0 0;
	}
	
	.title {
		padding-right: 40rpx;
		font-size: 28rpx;
		text-align: right;
	}

	.uni-list-cell {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		padding: 20rpx;
		align-items: center;
		border-bottom: 1px solid #eee;

		.uni-list-text {
			flex: 1;
			text-align: center;
		}
	}
</style>
