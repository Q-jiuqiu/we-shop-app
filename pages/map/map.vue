<template>
	<div class="map-contianer">
		<!-- <div class="back"></div> -->
		<map class="map" id="map" :style="{height: height}" :longitude="longitude" :latitude="latitude" :covers="covers"
			:show-location="true"></map>
		<div class="info">
			<div class="left">
				<div class="name">{{name}}</div>
				<div class="address">{{address}}</div>
			</div>
			<div class="right">
				<view class="iconfont icon-daohang locate" @click="handleMapOpen"></view>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref } from 'vue'

	let mapContext = null

	export default {
		name: 'MapIndex',
		setup() {
			const eventChannel = ref(null)
			const longitude = ref(104.065681) // 经度
			const latitude = ref(30.653442) // 纬度
			const height = ref(500)
			const covers = ref([])
			const name = ref('')
			const address = ref('')
			const to = ref({})

			return {
				eventChannel,
				longitude,
				latitude,
				height,
				covers,
				name,
				address,
				to
			}
		},
		onLoad: function() {
			console.log('onload')
			const eventChannel = this.getOpenerEventChannel()
			this.eventChannel = eventChannel
			// 监听postMessage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('postLocation', ({ from, to, info }) => {
				console.log(from, to)
				this.longitude = from.longitude
				this.latitude = from.latitude
				this.name = info.name
				this.address = info.address
				this.to = to
				console.log(this)
				this.covers = [{
					id: 'endPoint',
					latitude: Number(to.latitude),
					longitude: Number(to.longitude),
					iconPath: '../../static/location.png',
					width: 10,
					height: 10
				}]
			})
			this.height = uni.getSystemInfoSync().windowHeight + 'px'
		},
		onUnload() {
			this.eventChannel.off('postLocation')
		},
		methods: {
			handleMapOpen() {

				try {
					if (mapContext === null) {
						console.log('获取地图实例')
						mapContext = wx.createMapContext('map', this)
						console.log('地图实例:', mapContext)
					}

					console.log(mapContext)

					mapContext.openMapApp({
						longitude: Number(this.to.longitude),
						latitude: Number(this.to.latitude),
						destination: this.name,
						fail: res => {
							uni.showToast({
								icon: 'error',
								title: '经纬度错误'
							})
						}
					})
				} catch (e) {
					console.log(e)
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.map-contianer {
		width: 100%;
		position: relative;

		.map {
			width: 100%;
		}

		.info {
			background-color: rgba(255, 255, 255, 0.8);
			position: absolute;
			bottom: 0;
			left: 0;
			display: flex;
			min-height: 250rpx;
			width: 100%;
			padding: 30rpx 15rpx 0 15rpx;

			.left {
				flex: 1;

				.name {
					font-size: 60rpx;
					color: $uni-text-color;
					margin-bottom: 10rpx;
				}

				.address {
					color: $uni-text-color-grey;
					font: 40rpx;
				}
			}

			.right {
				width: 150rpx;

				.iconfont {
					text-align: center;
					font-size: 100rpx;
					color: #05c160;
				}
			}
		}
	}
</style>