<template>
	<!-- confirm modal -->
	<view class="cu-modal" :class="modal" catch:touchmove="return" @touchmove.prevent>
		<view class="cu-dialog cu-dialog-content">
			<view class="top-header cu-bar bg-blue">
				<view class="action">{{title}}</view>
			</view>
			<view class="content-box bg-white">
				<textarea v-if="showElem" v-model="text" @input="monitorInput" :focus="showFocus" ></textarea>
				<view v-if="!showElem" @click="clickView" class="view-td">{{viewText}}</view>
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
				//
				viewText:"",
				// 初始空
				text:"",
				// 默认不显示textarea
				showElem:false,
				showFocus:false
			}
		},
		methods: {
			show(data){
				if (typeof data === 'object' && data) {
					this.title = data.title;
				}
				this.text = "";
				this.showFocus = false;
				this.viewText = "";
				this.modal = "show";
			},
			// 隐藏
			hide(){
				this.showFocus = false;
				this.modal = null;
				this.showElem = false;
			},
			// 确定
			submit(){
				// 触发父页面v-on:pouple方法
				let content = this.content;
				this.$emit("pouple",content);
			},
			// 监听输入
			monitorInput(e){
				this.content = e.detail.value;
				this.viewText = e.detail.value;
			},
			//点击view
			clickView(){
				this.showFocus = true;
				this.showElem = true;
			}
			
		}
	}
</script>
<style  lang="scss" scoped>
	.cu-dialog{
		top: -150px;
	}
	// 顶部
	.top-header{
		view{
			width: 100%;
		}
	}
	// 内容
	.content-box{
		padding: 20rpx;
		textarea{
			width: 100%;
			text-align: left;
			background:$b-t;
			padding: 10rpx;
		}
		.view-td{
			width: 100%;
			height: 150px;
			text-align: left;
			background:$b-t;
			padding: 10rpx;
			color: $color6;
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

