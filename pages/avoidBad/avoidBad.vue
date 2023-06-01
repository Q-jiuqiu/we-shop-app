<template>
	<div class="avoid-bad">
		<div class="header">
			<u-subsection :list="list" :current="curNow" @change="sectionChange"></u-subsection>
		</div>
		<div class="content" v-if="data.length > 0">
			<div class="content-item" v-for="(item,index) in data" :key="index">
				{{item.content}}
			</div>
		</div>
		<NoData v-else></NoData>
	</div>
</template>

<script>
	import NoData from '@/compnnents/noData/noData.vue'

	export default {
		name: 'avoidBad',
		components: { NoData },
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
		onReady: () => {
			let title = '避坑指南'

			uni.getStorage({
				key: 'location',
				success: async ({ data: storage }) => {
					title = storage.city + title
				},
				fail: async ({ errMsg }) => {
					console.log(errMsg)
				},
				complete: async () => {
					console.log('complete', title)
					uni.setNavigationBarTitle({ title })
				}
			})
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
		padding: 0 20rpx;
	}
</style>