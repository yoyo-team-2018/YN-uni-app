<template>
	<!-- confirm modal -->
	<view class="cu-modal" :class="modal" catch:touchmove="return" @touchmove.prevent>
		<view class="cu-dialog cu-dialog-content">
			<!-- <view class="top-header cu-bar bg-blue">
				<view class="action">{{title}}</view>
			</view> -->
			<view class="content-box bg-white">
				<view>{{content}}</view>
			</view>
			<view class="bottom-footer flex" @click.stop="sure">
				<view class="cancel" @click.stop="hide">取消</view>
				<view class="submit" @click.stop="submit">{{sure}}</view>
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
				content: "确定审核通过?",
				sure:"确定提交"
			}
		},
		methods: {
			show(data){
				if (typeof data === 'object' && data) {
					this.title = data.title;
					this.content = data.content;
					this.sure = data.sure;
				}
				this.modal = "show";
			},
			hide(){
				this.modal = null
			},
			submit(){
				// 触发父页面v-on:pouple方法
				this.$emit("confirm");
			}
		}
	}
</script>
<style  lang="scss" scoped>
	// 顶部
	.top-header{
		view{
			width: 100%;
		}
	}
	// 内容
	.content-box{
		padding: 40rpx;
		view{
			text-align: center;
			font-size: $fz18;
			align-items: center;
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

