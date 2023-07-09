const QQMapWX = require('../static/qqmap-wx-jssdk.min.js')

/**
 * @description 再次授权
 * @return {null}
 */
function authorizeAgain(callBack) {
	uni.getSetting({ //先查看授权情况
		success: function(res) {
			var statu = res.authSetting
			if (!statu['scope.userLocation']) { //判断是否授权，没有授权就提示下面的信息
				uni.showModal({
					title: '需要获取您的地理位置，请确认授权，否则小程序功能将无法使用',
					cancelColor: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
					success: function(tip) {
						if (tip.confirm) { //查看是否点击确定
							uni.openSetting({
								success: async ({ authSetting }) => {
									console.log('authSetting', authSetting)
									const isLocation = authSetting && authSetting[
										'scope.userLocation']
									if (isLocation) {
										await getLocationInfo()
										callBack()
									} else {
										uni.showToast({
											icon: 'none',
											title: '未授权'
										})
									}
								},
								fail: () => {
									uni.showToast({
										icon: 'none',
										title: '弹出设置面板出错'
									})
								}
							})
						} else {
							uni.showToast({
								title: '授权失败',
								icon: 'none',
								duration: 1000
							})
						}
					}
				})
			}
		}
	})
}

/**
 * @description 授权获取位置信息
 * @return {null}
 */
function getLocationInfo(callBack) {
	const location = {
		longitude: 104.065681,
		latitude: 30.653442,
		province: '', // 省份
		city: '', // 城市
		district: '', // 地区
		street: '', // 街道
		address: '', // 地址
	}

	return new Promise(resolve => {
		//位置信息默认数据
		uni.getLocation({
			type: 'gcj02',
			success(res) {
				console.log(res, '==')
				uni.showLoading({ title: '获取位置信息' })
				location.longitude = res.longitude
				location.latitude = res.latitude
				// 腾讯地图Api
				const qqmapsdk =
					new QQMapWX({ key: 'NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7' })
				qqmapsdk.reverseGeocoder({
					location,
					success(response) {
						let info = response.result
						console.log(info)
						location.province = info.address_component.province
						if (info.address_component.district.includes('区')) {
							location.city = info.address_component.city
						} else {
							location.city = info.address_component.district

						}
						location.district = info.address_component.district
						location.street = info.address_component.street
						location.address = info.address

						// 将当前位置存储至storage中
						uni.setStorageSync('location', location)
						uni.$emit('locationSave')
						uni.hideLoading()
						resolve(location)
					},
				})
			},
			fail(err) {
				// 将当前位置存储至storage中
				uni.setStorageSync('location', 'noData')
				console.log(err)
				resolve('noData')
			},
		})
	})
}

export default {
	authorizeAgain,
	getLocationInfo
}