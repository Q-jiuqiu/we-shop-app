<template>
	<div class="foods">
		<div class="image-container">
			<div class="image-list">
				<u-swiper :list="imageList"></u-swiper>
			</div>
			<div class="describe">
				成都，又名芙蓉城、锦官城，四川省省会，联合国教科文组织授予“世界美食之都”称号，中国人民解放军西部战区机关驻地，中国超大城市，国家中心城市。
			</div>
		</div>

		<div class="option">
			<div class="map-button" @click="handleShowMap">进入地图模式</div>
		</div>

		<div class="content" v-if="contentList.length > 0">
			<div class="content-item" v-for="(item,index) in contentList" :key="index" @click="handleDetailShow(item)">
				<img class="image" :src="item.image">
				<!-- <img class="image" src="https://cdn.uviewui.com/uview/swiper/swiper1.png"> -->
				<div class="text">
					<div class="text-item name">
						<div class="value">{{item.name}}</div>
						<div class="location" v-if="showTypeDetail">
							<div class="icon iconfont icon-dingwei1"></div>
							<div class="distance">{{item.distance}}km</div>
						</div>
					</div>
					<div class="text-item dis">
						<div class="value">{{item.remark}}</div>
					</div>
				</div>
			</div>
		</div>

		<NoData v-else></NoData>
	</div>
</template>

<script>
	const QQMapWX = require('../../static/qqmap-wx-jssdk.min.js')
	import NoData from '@/compnnents/noData/noData.vue'

	import authorize from '@/utils/authorize.js'

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
				contentList: [],
				showTypeDetail: false, // 是否展示类型详情
				isLastPage: false, // 是否是最后一页
				curPage: 1 // 当前的页数
			}
		},

		// 监听页面加载
		onLoad: async function() {
			await this.initData()
		},

		// 页面上拉触底事件
		onReachBottom: async function() {
			console.log('到底部啦', this)
			if (!this.isLastPage) {
				await this.initData()
			} else {
				uni.showToast({
					icon: 'none',
					title: '没更多数据啦'
				})
			}
		},
		methods: {
			// 获取页面数据
			async initData() {
				// let title = '美食'
				uni.showLoading({ title: '获取数据中' })
				const data = await this.getFoodsTypeDatas()
				if (data.length > 0) {
					const res = await this.getFoodsData({ secondType: data[0] })
					console.log('res', res)
					this.contentList.push(...res.content)
					this.isLastPage = res.last
				} else {
					this.contentList = []
				}
				uni.getStorage({
					key: 'location',
					success: async ({ data: storage }) => {
						// title = storage.city + title

						if (!this.showTypeDetail) {
							await this.getDistance({
								longitude: storage.longitude,
								latitude: storage.latitude
							})
							uni.hideLoading()
						}
					},
					fail: async ({ errMsg }) => {
						console.log(errMsg)
					},
					complete: () => {
						// uni.setNavigationBarTitle({ title })
					}
				})
			},
			// 详情
			handleDetailShow(detail) {
				console.log(detail)
				uni.navigateTo({
					url: '/pages/detail/detail',
					success: res => {
						res.eventChannel.emit('foodDetail', { detail })
					}
				})
			},
			// 进入地图
			handleShowMap() {
				uni.navigateTo({
					url: '/pages/index/index',
					success: res => {
						res.eventChannel.emit('foodMap', { datas: this.contentList })
					}
				})
			},
			// 获取美食一级分类数据
			getFoodsTypeDatas() {
				return new Promise(resolve => {
					uni.request({
						url: 'http://8.137.19.141/pro/rest/dbs/find/type/v2/美食',
						method: 'GET',
						success: res => {
							const data = res.data.data
							resolve(data)
						},
						fail: err => {
							this.contentList = []
							resolve([])
						}
					})
				})

			},
			// 获取美食数据
			getFoodsData(params = {}) {
				return new Promise(resolve => {
					uni.request({
						url: `http://8.137.19.141/pro/rest/dbs/find/${this.curPage}/10`,
						data: params,
						method: 'GET',
						success: res => {
							const data = res.data.data
							resolve(data)
						},
						fail: err => {
							console.log(err)
							resolve([])
						}
					})
				})
			},
			// 获取距离
			getDistance({ longitude, latitude }) {
				if (this.contentList.length > 0) {
					const toList = []
					for (let item in this.contentList) {
						if (item.longitude && item.latitude) {
							toList.push({
								longitude: item.longitude,
								latitude: item.latitude
							})
						}
					}
					if (toList.length > 0) { // 腾讯地图Api
						const qqmapsdk =
							new QQMapWX({ key: 'NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7' })
						qqmapsdk.calculateDistance({
							from: {
								longitude, // 经度
								latitude // 纬度
							},
							to: toList,
							success: ({ result }) => { //成功后的回调
								const distanceInfo = result.elements
								this.contentList.forEach((item, index) => {
									const distance = distanceInfo[index].distance
									if (distance === -1) {
										item.distance = '--'
									} else {
										item.distance = (distanceInfo[index].distance / 1000).toFixed(
											1)
									}
								})
							},
							fail: function(error) {
								console.error(error)
							},
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
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

		.content {
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
						justify-content: space-between;
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

						.location {
							display: flex;
							color: $uni-text-color-grey;
							font-size: $uni-font-size-sm;
							font-weight: normal;
							align-items: center;
						}
					}
				}
			}
		}
	}
</style>

<style>
	page {
		min-height: 100%;
	}
</style>