<template>
	<div>
		<!-- 半透明遮罩 -->
		<div :class="{'CustomPopup':showCustomPopup}" @click="maskClick"></div>
		<div class="CustomPopupContent" :class="{'CustomPopupContentShow':showCustomPopup}">
			<!--  <view slot="bottom-top-panel" >插槽内容</view> -->
			<slot name="bottom-top-panel"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showCustomPopup: false,
			};
		},
		methods: {
			// 显示
			showCustom() {
				this.showCustomPopup = true;
			},
			// 点击遮罩
			maskClick() {
				this.showCustomPopup = false;
			}
		}
	}
</script>

<style scoped>
	/* 半透明遮罩 */
	.CustomPopup {
		height: 100%;
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}

	/* 隐藏 */
	.CustomPopupContent {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		min-height: 50px;
		background: #fff;
		transition: all 0.3s ease;
		border-radius: 10px 10px 0 0;
		padding: 20px 20px 50px;
		box-sizing: border-box;
		transform: translateY(100%);
		z-index: 3000;
	}

	/* 显示 */
	.CustomPopupContentShow {
		transform: translateY(0);
	}
</style>
