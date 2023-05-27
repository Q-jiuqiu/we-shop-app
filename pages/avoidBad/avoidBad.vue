<template>
	<div class="avoid-bad">
		<div class="header">
			<u-subsection :list="list" :current="curNow" @change="sectionChange"></u-subsection>
		</div>
		<div class="content-item" v-for="(item,index) in data" :key="index">
			{{item.content}}
		</div>
	</div>
</template>

<script>
	export default {
		name: 'avoidBad',
		data() {
			return {
				data: [
					{ content: 'xxzxxx' },
					{ content: 'xxzxxx' }
				],
				list: ['美食', '风景'],
				curNow: 0
			}
		},
		methods: {
			sectionChange(index) {
				this.curNow = index
			}
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
		background-color: $background;
		font-size: $uni-font-size-base;
	}

	.content-item {
		margin-bottom: 15rpx;
		background-color: white;
		padding: 0 $uni-spacing-row-base;
	}
</style>