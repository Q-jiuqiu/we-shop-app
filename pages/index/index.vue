<template>
	<view class="content">
		<header class="seacher">
			<view class="locate" @click="handleLocate">
				<u-icon name="map-fill" color="#f3950c" size="19"></u-icon>
				<view>{{locateCity}}</view>
			</view>
			<view class="input-content">
				<u-input prefixIcon="search" prefixIconStyle="color: #909399" placeholder="请输入内容" border="surround"
					@change="$u.debounce(handleInputChange, 500)" v-model="keyWord" clearable shape="circle"></u-input>
			</view>
		</header>
		<section class="map-content">
			<map class="map" id="map" :longitude="longitude" :latitude="latitude" :covers="covers"
				:show-location="true"></map>
			<view class="scroll" :class="[( swiperData.length === 1) && 'scroll_center']">
				<u-scroll-list :indicatorWidth="0">
					<view class="scroll-list" style="flex-direction: row;">
						<view class="scroll-list_shops" v-for="(item, index) in swiperData" :key="index">
							<view class="scroll-list_shops_item" @click="openMapApp(item)">
								<image class="scroll-list_shops_item_image" :src="getImageSrc(item)"></image>
								<view class="scroll-list_shops_item_title">{{ item.name }}</view>
								<view class="scroll-list_shops_item_des">{{ item.remark }}</view>
							</view>
						</view>
					</view>
				</u-scroll-list>
			</view>
		</section>

	</view>
</template>

<script>
	import { ref } from 'vue'

	const QQMapWX = require('../../static/qqmap-wx-jssdk.min.js')
	let mapContext = null

	// 位置信息
	const location = {
		longitude: 104.065681,
		latitude: 30.653442,
		province: '', // 省份
		city: '', // 城市
		district: '', // 地区
		street: '', // 街道
		address: '', // 地址
	}
	let allData = []

	export default {
		name: 'IndexPage',
		setup() {
			const longitude = ref(0) // 当前经度
			const latitude = ref(0) // 当前纬度
			const locateCity = ref('定位中…') // 当前城市名
			const covers = ref([])
			const swiperData = ref([]) // 滑块数据
			const isLocate = ref(false) // 是否授权位置
			const keyWord = ref('')

			return {
				longitude,
				latitude,
				locateCity,
				covers,
				swiperData,
				isLocate,
				keyWord
			}
		},

		onLoad: async function() {
			await this.getLocationInfo()
			this.longitude = location.longitude
			this.latitude = location.latitude
			this.locateCity = location.city || '未授权'
			// 所有数据
			allData = await this.getData()
			if (location.district) {
				// 当前区域数据
				const regionData = await this.getData({ region: location.district })
				this.setCovers(regionData)
				this.swiperData = this.handleDataSort(regionData)
			} else {
				this.swiperData = allData
			}
		},

		methods: {
			//获取位置信息
			getLocationInfo() {
				const this_ = this
				return new Promise(resolve => {
					//位置信息默认数据
					uni.getLocation({
						type: 'gcj02',
						success(res) {
							console.log(res, '==')
							location.longitude = res.longitude
							location.latitude = res.latitude
							this_.isLocate = true
							// 腾讯地图Api
							const qqmapsdk =
								new QQMapWX({ key: 'NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7' })
							qqmapsdk.reverseGeocoder({
								location,
								success(response) {
									let info = response.result
									console.log(info)
									location.province = info.address_component.province
									location.city = info.address_component.city
									location.district = info.address_component.district
									location.street = info.address_component.street
									location.address = info.address
									resolve(location)
								},
							})
						},
						fail(err) {
							this_.isLocate = false
							console.log(err)
							resolve(location)
						},
					})
				})
			},

			// 获取筛选数据
			getData(params = {}) {
				return new Promise(resolve => {
					uni.request({
						url: 'http://8.137.19.141/pro/rest/dbs/find',
						data: params,
						method: 'GET',
						success: function(res) {
							const data = res.data.data
							resolve(data)
						},
						fail: function(err) {
							console.log(err)
							resolve([])
						}
					})
				})
			},

			// 设置markArray
			setCovers(points) {
				this.covers = points.map((point, index) => {
					return {
						id: index,
						latitude: Number(point.latitude),
						longitude: Number(point.longitude),
						iconPath: '../../static/location.png',
						width: 10,
						height: 10
					}
				})
			},

			// 数据排序-优先展示当前区域数据
			handleDataSort(regionData) {
				if (regionData.length === 0) {
					return allData
				}
				const concatData = allData.concat(regionData)

				// 去重
				const res = new Map()
				return concatData.filter(item => !res.has(item.id) && res.set(item.id, 1))
			},

			// 输入改变
			async handleInputChange() {
				const regionData = await this.getData({ name: this.keyWord })
				this.setCovers(regionData)
				this.swiperData = regionData
			},

			// 打开地图导航app
			openMapApp(item) {
				// 通过eventChannel向被打开页面传送数据
				uni.navigateTo({
					url: '/pages/detail/detail',
					success: res => {
						console.log(res)
						res.eventChannel.emit('postMessage', {
							detail: item,
							longitude: location.longitude,
							latitude: location.latitude
						})
					}
				})
			},

			handleMoveTo() {
				// 已授权
				if (mapContext === null) {
					mapContext = wx.createMapContext('map', this)
					console.log(mapContext)
				}
				mapContext.moveToLocation({
					latitude: Number(location.latitude),
					longitude: Number(location.longitude)
				})
			},

			// 获取当前
			handleLocate() {
				if (this.isLocate) {
					this.handleMoveTo()
				} else {
					// 未授权位置
					uni.showModal({
						title: '您未开启地理位置授权',
						content: '为了您更好的体验， 请确认获取您的位置',
						confirmText: '确认',
						cancelText: '取消',
						success: ({ confirm }) => {
							// 确认重新获取位置
							if (confirm) {
								wx.openSetting({
									success: async ({ authSetting }) => {
										const isLocation = authSetting && authSetting[
											'scope.userLocation']
										if (isLocation) {
											this.locateCity = '定位中…'
											await this.getLocationInfo()
											this.longitude = location.longitude
											this.latitude = location.latitude
											this.locateCity = location.city
											this.handleMoveTo()
											// 当前区域数据
											const regionData = await this.getData({
												region: location
													.district
											})
											this.setCovers(regionData)
											this.swiperData = this.handleDataSort(
												regionData)
										}
									},
									fail: () => {
										uni.showToast({
											icon: 'fail',
											title: '弹出设置面板出错'
										})
									}
								})
							}
						},
						fail: () => {
							console.log('展示modal框失败')
						}
					})
				}
			},

			getImageSrc(item) {
				return item.image || 'https://cdn.uviewui.com/uview/goods/1.jpg'
			}
		}

	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.seacher {
			height: 60rpx;
			padding: 10px 0;
			width: 100%;
			display: flex;
			align-items: center;

			.locate {
				display: flex;
				align-items: center;
				margin: 0 20rpx;
				font-size: $uni-font-size-sm;
				white-space: nowrap;
			}

			.input-content {
				flex: 1;
				margin-right: 30rpx;

				::v-deep .u-input {
					height: 30rpx;
				}
			}
		}

		.map-content {
			height: calc(100% - 80rpx);
			width: 100%;
			position: relative;

			.map {
				width: 100%;
				height: 100%;
			}

			.scroll {
				width: 100%;
				position: absolute;
				bottom: 10rpx;
				left: 0;
			}
		}
	}

	.scroll_center {
		::v-deep .u-scroll-list__scroll-view__content {
			justify-content: center;
		}
	}

	.scroll-list {
		@include flex(column);


		&_shops {
			margin-right: 20rpx;
			padding: 20rpx 0;
			width: 480rpx;
			min-height: 375rpx;

			&_item {
				background-color: $uni-bg-color;
				border-radius: 20rpx;
				box-shadow: 5rpx 5rpx 20rpx $uni-bg-color-mask ;
				height: 100%;

				&_image {
					height: 310rpx;
					width: 100%;
					border-radius: 20rpx 20rpx 0 0;
				}

				&_title {
					text-align: center;
					font-size: $uni-font-size-base;
					font-weight: bold;
					border-radius: 20rpx;
				}

				&_des {
					padding: 10rpx;
					font-size: $uni-font-size-sm;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
</style>

<style lang="scss">
	page {
		height: 100%;
	}
</style>