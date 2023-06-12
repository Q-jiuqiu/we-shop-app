<template>
	<div :style="{paddingTop:statusBarHeight,height:'44px',background:'#fdc307'}">
		<view class="custom-nav" :style="{ position: 'fixed',top:menuTop,left:menuRight}">
			<div class="container" @click="handleNavigateBack"
				:style="{lineHeight:menuHeight,height:menuHeight,borderRadius:menuBorderRadius}">
				<span class="iconfont icon-fanhui1"></span>
			</div>
		</view>
	</div>

</template>

<script>
	import authorize from '@/utils/authorize.js'

	export default {
		name: 'customNav',
		data() {
			return {
				//状态栏的高度（可以设置为顶部导航条的padding-top）
				statusBarHeight: uni.getStorageSync('menuInfo').statusBarHeight, //状态栏的高度（可以设置为顶部导航条的padding-top）
				menuHeight: uni.getStorageSync('menuInfo').menuHeight,
				menuBorderRadius: uni.getStorageSync('menuInfo').menuBorderRadius,
				menuRight: uni.getStorageSync('menuInfo').menuRight,
				menuTop: uni.getStorageSync('menuInfo').menuTop,
				contentTop: uni.getStorageSync('menuInfo').contentTop,
			}
		},
		methods: {
			// 返回上一路由
			handleNavigateBack() {
				uni.navigateBack(1)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-nav {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1;
		text-align: center;

		.container {
			width: 80rpx;

			.iconfont {
				font-size: 50rpx;
			}
		}
	}
</style>