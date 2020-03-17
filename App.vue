<script>
	/**
	 * vuex管理登陆状态，具体可以参考官方登陆模板示例
	 */
	import {
		mapMutations
	} from 'vuex';
	export default {
		methods: {
			...mapMutations(['login'])
		},
		onLaunch: function() {
			let userInfo = uni.getStorageSync('userInfo') || '';
			if(userInfo.id){
				//更新登陆状态
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.login(res.data);
					}
				});
			}
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
	}
</script>

<style lang='scss'>
	/*
	 *	全局公共样式和字体图标
	 */
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import 'iconfont.css';
	
	/* 图片载入替代方案 */
	.image-wrapper {
		font-size: 0;
		background: #f3f3f3;
		border-radius: 4px;

		image {
			width: 100%;
			height: 100%;
			transition: .6s;
			opacity: 0;

			&.loaded {
				opacity: 1;
			}
		}
	}
	/* button样式改写 */
	uni-button,
	button {
		height: 80rpx;
		line-height: 80rpx;
		font-size: $font-lg + 2rpx;
		font-weight: normal;

		&.no-border:before,
		&.no-border:after {
			border: 0;
		}
	}
	/* input 样式 */
	.input-placeholder {
		color: #999999;
	}
	.placeholder {
		color: #999999;
	}
	.page-box{
		background: #fff;
		text-align: center;
		border-bottom:1px solid $b-t;
		padding:5px 0;
		.uni-pagination{
			width: 100%!important;
			padding-right: 15px;
		}
	}
</style>
