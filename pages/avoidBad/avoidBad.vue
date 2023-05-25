<template>
	<div class="avoid-bad">
		<div class="content-item" v-for="(item,index) in data" :key="index">
			{{item.content}}
		</div>
	</div>
</template>

<script>
	export default {
		name: 'avoidBad',
		data() {
			return { data: [{ content: 'xxzxxx' }] }
		}
	}
</script>

<style lang="scss" scoped>
	page {
		height: 100%;
	}

	.avoid-bad {
		width: 100%;
		height: 100%;
		background-color: #fcf9f0;
		font-size: $uni-font-size-base;
	}

	.content-item {
		margin-bottom: 15rpx;
	}
</style>