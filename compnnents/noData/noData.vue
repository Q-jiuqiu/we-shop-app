<template>
	<div>
		<div class="content">
			<div class="content-icon">
				<span class="iconfont icon-wushuju"></span>
			</div>
			<text class="content-tips">暂无数据</text>
		</div>
	</div>
</template>

<script>
	export default { name: 'NoData', }
</script>

<style lang="scss" scoped>
	.content {
		padding: 50rpx 60rpx 0;
		background: white;
		@include flex(column);
		align-items: center;
		justify-content: center;

		&-icon {
			color: $uni-text-color-grey;

			.iconfont {
				font-size: 100rpx;
			}
		}

		&-tips {
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			margin-top: 15rpx;
		}
	}
</style>