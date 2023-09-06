<!--
 * @Author: 何元鹏
 * @Date: 2023-08-28 21:18:38
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-06 20:43:00
-->
<template>
	<div :style="{ paddingTop: statusBarHeight, height: '44px' }">
		<div class="custom-nav" :style="{ paddingTop: statusBarHeight, height: '44px' }">
			<div class="container" :style="{ width: surplusWidth }">
				<div class="back" @click="handleNavigateBack">
					<span class="iconfont icon-fanhui1"></span><span style="margin-left: 5rpx;">后退</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import authorize from '@/utils/authorize.js'

export default {
	name: 'customNav',
	props: {
		custom: {
			type: Boolean,
			default: () => false
		}
	},
	data() {
		return {
			//状态栏的高度（可以设置为顶部导航条的padding-top）
			statusBarHeight: uni.getStorageSync('menuInfo').statusBarHeight, //状态栏的高度（可以设置为顶部导航条的padding-top）
			menuHeight: uni.getStorageSync('menuInfo').menuHeight,
			surplusWidth: uni.getStorageSync('menuInfo').surplusWidth,
			menuBorderRadius: uni.getStorageSync('menuInfo').menuBorderRadius,
			menuRight: uni.getStorageSync('menuInfo').menuRight,
			menuTop: uni.getStorageSync('menuInfo').menuTop,
			contentTop: uni.getStorageSync('menuInfo').contentTop
		}
	},
	methods: {
		// 返回上一路由
		handleNavigateBack() {
			if (this.custom) {
				this.$emit('customBack')
			} else {
				uni.navigateBack(1)
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.custom-nav {
	background: #fdc307;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 11111;
	width: 100%;

	.container {
		padding: 0 7px 0 9px;
		box-sizing: border-box;
		height: 100%;
		display: flex;
		align-items: center;

		.back {
			display: flex;
			align-items: center;
			.iconfont {
				font-size: 50rpx;
				font-weight: 500;
			}
		}
	}
}
</style>
