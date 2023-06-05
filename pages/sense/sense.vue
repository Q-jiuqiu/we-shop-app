<template>
	<div class="foods" v-if="contentList.length > 0">
		<div class="image-container">
			<div class="image-list">
				<u-swiper :list="imageList"></u-swiper>
			</div>
			<div class="describe">
				成都，又名芙蓉城、锦官城，四川省省会，联合国教科文组织授予“世界美食之都”称号，中国人民解放军西部战区机关驻地，中国超大城市，国家中心城市。
			</div>
		</div>

		<div class="option">
			<div class="map-button">进入地图模式</div>
		</div>

		<div class="type-content"></div>

		<div class="detail-content">
			<div class="detail-content-item" v-for="(item,index) in contentList" :key="index"
				@click="handleDetailShow(item)">
				<img class="image" :src="item.image">
				<div class="text">
					<div class="text-item name">
						<div class="value">{{item.name}}</div>
						<div class="location"></div>
					</div>
					<div class="text-item dis">
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
	page {
		height: 100%;
	}

	.foods {
		height: 100%;
		background: $background;

		.image-container {
			background-color: white;

			.describe {
				letter-spacing: 10rpx;
				line-height: 55rpx;
				padding: 20rpx;
				text-indent: 80rpx;
			}
		}

		.option {
			padding: 25rpx 20rpx $uni-spacing-row-base 20rpx;
			display: flex;
			justify-content: flex-end;

			.map-button {
				background-color: white;
				padding: 8rpx;
				border-radius: 10rpx;
			}
		}

		.detail-content {
			padding: 0 $uni-spacing-row-base;

			&-item {
				display: flex;
				align-items: center;
				border-radius: 30rpx;
				@include defaultContainer();
				margin: 20rpx;
				padding: 20rpx;
				height: 200rpx;
				letter-spacing: $letter-spacing-base;

				.image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 20rpx;
				}

				.text {
					width: calc(100% - 200rpx);
					padding-left: $uni-spacing-row-base;
					height: 100%;

					&-item {
						display: flex;
						margin-bottom: $uni-spacing-row-base;
					}

					.dis {
						.value {
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							word-wrap: break-word;
							white-space: normal !important;
							-webkit-line-clamp: 4;
							-webkit-box-orient: vertical;
						}
					}

					.name {
						font-size: 40rpx;
						color: #b50a0e;
						font-weight: bold;

						.value {
							@include ellipsis()
						}
					}
				}
			}
		}
	}
</style>