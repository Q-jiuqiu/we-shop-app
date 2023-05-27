<template>
	<div class="content">
		<header class="seacher">
			<div class="locate" @click="handleLocate">
				<u-icon name="map-fill" color="#f3950c" size="19"></u-icon>
				<div>{{locateCity}}</div>
			</div>
			<div class="input-content">
				<u-input prefixIcon="search" prefixIconStyle="color: #909399" placeholder="请输入店铺名称" border="surround"
					@change="$u.debounce(handleInputChange, 500)" v-model="keyWord" clearable shape="circle"></u-input>
			</div>
		</header>
		<section class="map-content">
			<map class="map" id="map" :longitude="longitude" :latitude="latitude" :markers="markers"
				:show-location="true" @tap="handleMapClick" @markertap="handleMarkerClick"
				@labeltap="handleLabeltap"></map>
		</section>


	</div>
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
		data() {
			return {
				longitude: 0, // 当前经度
				latitude: 0, // 当前纬度
				locateCity: '定位中…', // 当前城市名
				markers: [], // marker点信息
				swiperData: [], // 滑块数据
				isLocate: false, // 是否授权位置
				keyWord: '', // 搜索关键字
			}
		},


		onLoad: async function() {
			uni.getStorage({
				key: 'location',
				success: async ({ data: storage }) => {
					console.log(storage)
					// 需获取坐标及位置信息
					if (!storage.longitude || !storage.latitude || !storage.city) {
						await this.getLocationInfo()
						this.longitude = location.longitude
						this.latitude = location.latitude
						this.locateCity = location.city || '未授权'

						// 将当前位置存储至storage中
						uni.setStorage({
							key: 'location',
							data: location,
						})
					} else {
						this.longitude = storage.longitude
						this.latitude = storage.latitude
						this.locateCity = storage.city || '未授权'
					}
				},
				fail: async ({ errMsg }) => {
					console.log('fail', errMsg)
					// 没有存储location
					if (errMsg === 'getStorage:fail data not found') {
						await this.getLocationInfo()
						this.longitude = location.longitude
						this.latitude = location.latitude
						this.locateCity = location.city || '未授权'

						// 将当前位置存储至storage中
						uni.setStorage({
							key: 'location',
							data: location,
						})
					}
				},
				complete: async () => {
					console.log('all')
					// 所有数据
					// const cityData = await this.getData({ city: this.locateCity })
					const cityData = await this.getData({ city: '成都市' })
					this.setMarkers(cityData)
				}
			})
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
				console.log('筛选条件:', params)
				return new Promise(resolve => {
					uni.request({
						url: 'http://8.137.19.141/pro/rest/dbs/find',
						data: params,
						method: 'GET',
						success: function(res) {
							const data = res.data.data
							console.log('结果:', data)
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
			setMarkers(points) {
				this.markers = points.map((point, index) => {
					return {
						id: index,
						latitude: Number(point.latitude),
						longitude: Number(point.longitude),
						iconPath: '../../static/location.png',
						width: 35,
						height: 35
					}
				})
				console.log(this.markers)
			},

			// 数据排序-优先展示当前区域数据
			handleDataSort(regionData) {
				if (regionData.length === 0) {
					return allData
				}
				const concatData = regionData.concat(allData)

				// 去重
				const res = new Map()
				return concatData.filter(item => !res.has(item.id) && res.set(item.id, 1))
			},

			// 输入改变
			async handleInputChange() {
				// const regionData = await this.getData({ name: this.keyWord })
				// if (regionData.length > 0) {
				// 	this.handleMoveTo(regionData[0])
				// }
				// this.setMarkers(regionData)
				// this.swiperData = regionData
			},

			// 打开地图导航app
			handleDetailShow(item) {
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

			handleMoveTo(location) {
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
					this.handleMoveTo(location)
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
											this.setMarkers(regionData)
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

			// marker点击事件
			handleMarkerClick(event) {
				console.log(1111)
				console.log(event)
			},

			// marker点击事件
			handleMapClick(event) {
				console.log(222)
				console.log(event)
			},

			handleLabeltap(event) {
				console.log(333)
				console.log(event)
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
		}

	}
</style>

<style lang="scss">
	page {
		height: 100%;
	}
</style>