<template>
	<div class="map-contianer">
		<CustomNavBack></CustomNavBack>
		<map class="map" id="map" :style="{ height: height }" :longitude="longitude" :latitude="latitude" :markers="covers" :show-location="true" scale="12"></map>
		<div class="info">
			<div class="left">
				<div class="name">{{ name }}</div>
				<div class="address">{{ address }}</div>
			</div>
			<div class="right">
				<view class="iconfont icon-daohang locate" @click="handleMapOpen"></view>
			</div>
		</div>
	</div>
</template>

<script>
import CustomNavBack from '@/compnnents/customNavBack/customNavBack.vue'
let mapContext = null

export default {
	name: 'MapIndex',
	components: { CustomNavBack },
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
	onLoad: function () {
		const eventChannel = this.getOpenerEventChannel()
		this.eventChannel = eventChannel
		// 监听postMessage事件，获取上一页面通过eventChannel传送到当前页面的数据
		eventChannel.on('postMap', ({ detail }) => {
			this.name = detail.name
			this.address = detail.addr
			this.detail = detail
			this.longitude = Number(detail.longitude)
			this.latitude = Number(detail.latitude)

			this.covers = [
				{
					id: detail.id,
					latitude: Number(detail.latitude),
					longitude: Number(detail.longitude),
					iconPath: '../../static/location.png',
					width: 15,
					height: 15,
					callout: { content: detail.name, display: 'ALWAYS', padding: 6, borderRadius: 4, bgColor: '#fdc307' }
				}
			]
		})
		this.height = uni.getSystemInfoSync().waindowHeight + 'px'
	},
	onUnload() {
		this.eventChannel.off('postLocation')
	},
	methods: {
		handleMapOpen() {
			try {
				if (mapContext === null) {
					mapContext = wx.createMapContext('map', this)
				}
				mapContext.openMapApp({
					longitude: Number(this.detail.longitude),
					latitude: Number(this.detail.latitude),
					destination: this.name,
					fail: res => {
						if (res.errMsg.indexOf('cancel') > -1) {
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
	height: 100vh;
	width: 100%;
	position: relative;

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
		box-sizing: border-box;

		.left {
			width: calc(100% - 150rpx);

			.name {
				font-size: 60rpx;
				color: $uni-text-color;
				margin-bottom: 10rpx;
				@include ellipsis();
			}

			.address {
				color: $uni-text-color-grey;
				font: 40rpx;
				@include ellipsis();
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
