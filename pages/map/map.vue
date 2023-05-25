<template>
	<div class="map-contianer">
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
		data() {
			return {
				eventChannel: null,
				longitude: 104.065681, // 经度
				latitude: 30.653442, // 纬度
				height: 500,
				covers: [],
				name: '',
				address: '',
				detail: {} // 详情
			}
		},
		onLoad: function() {
			console.log('onload')
			const eventChannel = this.getOpenerEventChannel()
			this.eventChannel = eventChannel
			// 监听postMessage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('postMap', ({ detail }) => {
				console.log(detail)
				this.name = detail.name
				this.address = detail.addr
				this.detail = detail

				this.covers = [{
					id: 'endPoint',
					latitude: Number(detail.latitude),
					longitude: Number(detail.longitude),
					iconPath: '../../static/location.png',
					width: 10,
					height: 10
				}]

				uni.getStorage({
					key: 'location',
					success: res => {
						console.log(res.data)
						const location = res.data
						this.longitude = location.longitude
						this.latitude = location.latitude
					}
				})
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
						longitude: Number(this.detail.longitude),
						latitude: Number(this.detail.latitude),
						destination: this.name,
						fail: res => {
							console.log('失败', res)
							if (res.indexOf('cancel') > -1) {
								uni.showToast({
									icon: 'fail',
									title: '取消导航'
								})
							} else {
								uni.showToast({
									icon: 'error',
									title: '经纬度错误'
								})
							}
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
		height: 100%;

		.map {
			width: 100%;
			height: 100%;
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

<style lang="scss">
	page {
		height: 100%;
	}
</style>