<template>
	<view class="container">
		<picker @change="bindPickerChange" :value="ChangeArray" :mode="mode">
			<view v-if="textFlag" class="picker">
				{{ChangeArray[0]}}{{ChangeArray[1]}}{{ChangeArray[2]}}
			</view>
			<view v-else class="picker">请选择</view>
		</picker>
		<view class="btn-box" v-if="ClearBtnFlag">
			<button @click.stop="clearCFDAddress" class="cu-btn  bg-blue">清空</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				textFlag: false,
				initArray: ['北京市', '北京市', '东城区'],
				ChangeArray: [],
				index: 0,
				nowDate: this.$custom.getYMD()
			};
		},
		props: {
			mode: String, // picker 的类型
			name: String, // 调用的类型
			ClearBtnFlag: Boolean, // 显隐清空按钮
			echo: String, // 数据回显
		},
		watch: {
			echo(val) {
				// val => 北京市, 北京市, 朝阳区 <String>
				// 传入值, 用于回显
				if (val.length !== 0) {
					this.textFlag = true
					this.ChangeArray = val.split(',')
				}
			}
		},
		methods: {
			bindPickerChange(e) {
				this.textFlag = true
				this.ChangeArray = e.detail.value,
					this.changePicker()
			},
			clearCFDAddress() {
				// 切换隐藏内容
				this.textFlag = false
				this.ChangeArray = []
				this.changePicker()
			},
			changePicker() {
				this.$emit('changePicker', {
					ChangeArray: this.ChangeArray,
					name: this.name
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;

		button {
			margin-top: 19rpx;
			margin-left: 5rpx;
		}
	}
</style>
