<template>
	<!-- confirm modal -->
	<view class="cu-modal" :class="modal" catch:touchmove="return" @touchmove.prevent>
		<view class="cu-dialog cu-dialog-content">
			<view class="content-box bg-white">
				<input v-model="text" @input="monitorInput" placeholder="姓名/身份证号" />
			</view>
			<view class="bottom-footer flex" @click.stop="sure">
				<view class="cancel" @click.stop="hide">取消</view>
				<view class="submit" @click.stop="submit">确定提交</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// modal默认不显示
				modal:null,
				// 加载显示内容
				title:"审核不通过",
				// 提交内容
				content: "",
				// 初始空
				text:"",
			}
		},
		methods: {
			show(data){
				if (typeof data === 'object' && data) {
					this.title = data.title;
				}
				this.text = "";
				this.modal = "show";
			},
			hide(){
				this.modal = null;
				this.setFoucs = true;
			},
			//确定
			submit(){
				// 触发父页面v-on:pouple方法
				let content = this.content;
				this.$emit("poupleInput",content);
			},
			// 监听输入
			monitorInput(e){
				this.content = e.detail.value;
			}
		}
	}
</script>
<style  lang="scss" scoped>
	.cu-dialog{
		top: -100px;
	}
	// 顶部
	.top-header{
		view{
			width: 100%;
		}
	}
	// 内容
	.content-box{
		padding: 60rpx 40rpx;
		text-align:left;
		background:#fff;
		input{
			background:#eee;
			height: 40px;
			line-height: 40px;
			padding: 0 10px;
		}
	}
	// 底部
	.bottom-footer{
		height: 50px;
		view{
			width: 50%;
			line-height: 50px;
			background: #fff;
			border-top:1px solid $b-t;
		}
		.submit{
			color: rgb(12,104,255);
			border-left:1px solid $b-t;
		}
	}
</style>

