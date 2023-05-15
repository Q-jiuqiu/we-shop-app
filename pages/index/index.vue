<template>
	<view class="content">
		<header class="seacher">
			<view class="locate">
				<u-icon name="map-fill" color="#f3950c" size="19"></u-icon>
				<view>{{locateCity}}</view>
			</view>
			<view class="input-content">
				<u-input prefixIcon="search" prefixIconStyle="color: #909399" placeholder="请输入内容" border="surround"
					@change="$u.debounce(handleInputChange, 500)" v-model="key" clearable shape="circle"></u-input>
			</view>
		</header>
		<section class="map-content">
			<map class="map" id="map" :longitude="longitude" :latitude="latitude" :covers="covers"
				@bindupdated="handleMapRender"></map>
			<view class="scroll">
				<u-scroll-list :indicatorWidth="0">
					<view class="scroll-list" style="flex-direction: row;">
						<view class="scroll-list__shops" v-for="(item, index) in swiperData" :key="index"
							:class="[(index === swiperData.length) && 'scroll-list__shops--no-margin-right']">
							<view class="scroll-list__shops_item" @click="openMapApp(item)">
								<image class="scroll-list__shops_item__image"
									src="https://cdn.uviewui.com/uview/goods/1.jpg"></image>
								<view class="scroll-list__shops_item__title">{{ item.name }}</view>
								<view class="scroll-list__shops_item__des">{{ item.remark }}</view>
							</view>
						</view>
					</view>
				</u-scroll-list>
			</view>
		</section>

	</view>
</template>

<script>
	import QQMapWX from '../../static/qqmap-wx-jssdk.js'
	import { ref, onMounted } from 'vue'

	const key = ref('')
	let mapContext = null

	// 位置信息
	const location = {
		longitude: 0,
		latitude: 0,
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
			const swiperData = ref([{
				name: '门店1',
				thumb: 'https://cdn.uviewui.com/uview/goods/1.jpg',
				longitude: 22,
				latitude: 111
			}]) // 滑块数据
			const isLocate = ref(false) // 是否授权位置

			return {
				longitude,
				latitude,
				locateCity,
				covers,
				swiperData,
				isLocate
			}
		},

		async mounted() {

			const location = await this.getLocationInfo()
			this.longitude = location.longitude
			this.latitude = location.latitude
			this.locateCity = location.city
			if (this.isLocate) {
				this.setCovers([location])
			}

			// 所有数据
			allData = await this.getData()
			// 当前区域数据
			const regionData = await this.getData({ data: { region: location.district } })
			this.swiperData = this.handleDataSort(regionData)
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
							this_.locateCity = '未授权'
							console.log(err)
							resolve(location)
						},
					})
				})
			},

			// 获取筛选数据
			getData(params = {}) {
				const this_ = this
				return new Promise(resolve => {
					wx.request({
						url: 'http://8.137.19.141/pro/rest/dbs/find',
						data: params,
						method: 'GET',
						success: function(res) {
							const data = res.data.data
							this_.setCovers(data)
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

			// 地图渲染完成
			handleMapRender() {
				console.log('handleMapRender', arguments)
			},

			// 输入改变
			async handleInputChange(value) {
				const regionData = await this.getData({ data: { name: value } })
				this.swiperData = this.handleDataSort(regionData)
			},

			// 打开地图导航app
			openMapApp(item) {
				try {
					if (mapContext === null) {
						mapContext = wx.createMapContext('map', this)
						console.log(mapContext)
					}
					mapContext.openMapApp({
						longitude: Number(item.longitude),
						latitude: Number(item.latitude),
						destination: item.name
					})
				} catch (e) {
					console.log(e)
				}

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

	::v-deep .u-scroll-list__scroll-view__content {
		justify-content: center;
	}

	.scroll-list {
		@include flex(column);


		&__shops {
			margin-right: 20rpx;
			padding: 20rpx 0;
			width: 300rpx;
			height: 400rpx;

			&_item {
				background-color: $uni-bg-color;
				border-radius: 20rpx;
				box-shadow: 5rpx 5rpx 20rpx $uni-bg-color-mask ;
				height: 100%;

				&__image {
					height: 310rpx;
					width: 100%;
					border-radius: 20rpx 20rpx 0 0;
				}

				&__title {
					text-align: center;
					font-size: $uni-font-size-base;
					font-weight: bold;
					border-radius: 20rpx;
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