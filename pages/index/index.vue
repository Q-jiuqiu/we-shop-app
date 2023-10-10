<template>
	<div class="content">
		<CustomNavBack></CustomNavBack>
		<section class="map-content">
			<map class="map" id="map" scale="12" :longitude="longitude" :latitude="latitude" :markers="markers" show-location="true"  @callouttap="handleMarkerClick2" @markertap="handleMarkerClick"
			:enable-building="true"></map>
		</section>
	</div>
</template>

<script> 
import CustomNavBack from '@/compnnents/customNavBack/customNavBack.vue'
let mapContext = null

export default {
	name: 'IndexPage',
	components: { CustomNavBack },
	data() {
		return {
			longitude: uni.getStorageSync('location').longitude, // 当前经度
			latitude: uni.getStorageSync('location').latitude, // 当前纬度
			locateCity: '定位中…', // 当前城市名
			markers: [], // marker点信息
			foodsDatas: [], // 美食数据
			isLocate: false, // 是否授权位置
			keyWord: '', // 搜索关键字
			dataList: []
		}
	},

	onLoad: function () {
		const eventChannel = this.getOpenerEventChannel()
		this.eventChannel = eventChannel
		eventChannel.on('foodMap', ({ data,threeType,city,index,type }) => {
			console.log('跳转数据',threeType,city,index,type);
			let params={}
			if (type === '美食') {
				params = {
					threeType,
					city,
					type
				}
			} else {
				params = { 
					secondType:threeType,
					city,type
				}
			}
			
			uni.showLoading({ title: '获取数据中',mask:true })
				uni.request({
					url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/1/${index}`,
					data: params,
					method: 'GET',
					success: async res => {
						const data = res.data.data
						const { content } = data  
						this.dataList = content
						this.setMarkers(content)
						uni.hideLoading()
					},
					fail: err => {
						console.log(err)
					}
				})
			
		})
	},

	methods: {
		// 获取美食筛选数据
		getFoodsDatas(params = {}) {
			return new Promise(resolve => {
				uni.request({
					url: 'https://www.aomue.cn/dbs/pro/rest/dbs/find',
					data: params,
					method: 'GET',
					success: function (res) {
						const data = res.data.data
						resolve(data)
					},
					fail: function (err) {
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
					width: 25,
					height: 25,
					callout: { content: point.name, display: 'ALWAYS', padding: 6, borderRadius: 4, bgColor: '#fdc307' }
				}
			})
		},

		// 移动到指定坐标为止
		handleMoveTo(location) {
			// 已授权
			if (mapContext === null) {
				mapContext = wx.createMapContext('map', this)
			}
			mapContext.moveToLocation({
				latitude: Number(location.latitude),
				longitude: Number(location.longitude)
			})
		},

		// marker中title点击事件
		handleMarkerClick2(event) {
			const detail = event.detail 
			if (detail && !isNaN(detail.markerId)) {
				const detailInfo = this.dataList[detail.markerId] 
				uni.navigateTo({
					url: '/pages/detail/detail',
					success: res => {
						res.eventChannel.emit('detailPage', { detail: detailInfo })
					}
				})
			}
		},

		// marker点击事件
		handleMarkerClick(event) {
			const detail = event.detail 
			if (detail && !isNaN(detail.markerId)) {
				const detailInfo = this.dataList[detail.markerId]
				uni.navigateTo({
					url: '/pages/detail/detail',
					success: res => {
						res.eventChannel.emit('detailPage', { detail: detailInfo })
					}
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.content {
	height: 100vh;
	width: 100%;

	.map-content {
		height: 100%;
		width: 100%;
		position: relative;

		.map {
			width: 100%;
			height: 100%;
		}
	}
}
</style>
