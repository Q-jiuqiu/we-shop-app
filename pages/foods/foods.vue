<template>
	<div class="foods" v-if="contentList.length > 0">
		<div class="image-list">
			<u-swiper :list="imageList"></u-swiper>
		</div>

		<div class="content">
			<div class="content-item" v-for="(item,index) in contentList" :key="index" @click="handleDetailShow(item)">
				<img class="image" :src="item.image" mode="widthFix">
				<div class="text">
					<div class="text-item name">
						<div class="label">名称：</div>
						<div class="value">{{item.name}}</div>

					</div>
					<div class="text-item">
						<div class="label">简介：</div>
						<div class="value">{{item.remark}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<NoData v-else></NoData>
</template>

<script>
	import NoData from '@/compnnents/noData/noData.vue'

	export default {
		name: 'FoodsIndex',
		components: { NoData },
		data() {
			return {
				imageList: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],
				contentList: [{
						image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
						name: 'xxxx',
						remark: '的点点滴滴打打电话金飞达',
						value: 4,
						addr: '四川省成都市锦江区高威公园',
						longitude: 113,
						latitude: 23,
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
						name: 'xxxx',
						remark: '的点点滴滴打打电话金飞达',
						value: 4,
						addr: '四川省成都市锦江区高威公园',
						longitude: 113,
						latitude: 23,
					}
				]
			}
		},
		onReady: () => {
			let title = '美食'

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
			// 详情
			handleDetailShow(detail) {
				console.log(detail)
				uni.navigateTo({
					url: '/pages/detail/detail',
					success: res => {
						res.eventChannel.emit('foodDetail', { detail })
					}
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
	.foods {
		background: $background;

		.content {
			padding: 0 $uni-spacing-row-base;

			&-item {
				display: flex;
				align-items: center;
				padding: 20rpx 0;
				@include defaultContainer();

				.image {
					flex: 1;
					margin-right: $uni-spacing-row-base;
				}

				.text {
					width: 500rpx;

					&-item {
						display: flex;
						margin-bottom: $uni-spacing-row-base;

						.label {
							margin-right: $uni-spacing-row-base;
							white-space: nowrap;
						}

						.value {
							@include ellipsis();
						}
					}

				}
			}
		}
	}
</style>