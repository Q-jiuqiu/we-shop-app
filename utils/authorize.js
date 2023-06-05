// const QQMapWX = require('@/static/qqmap-wx-jssdk.min.js')

function authorize(callBack) {
	wx.getSetting({ //先查看授权情况
		success: function(res) {
			var statu = res.authSetting
			if (!statu['scope.userLocation']) { //判断是否授权，没有授权就提示下面的信息
				wx.showModal({
					title: '需要获取您的地理位置，请确认授权，否则小程序功能将无法使用',
					cancelColor: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
					success: function(tip) {
						if (tip.confirm) { //查看是否点击确定
							wx.authorize({
								scope: 'scope.userLocation',
								success: function(data) {
									if (data.authSetting[
											'scope.userLocation'] ===
										true) { //到这一步表示打开了位置授权
										wx.showToast({
											title: '授权成功',
											icon: 'success',
											duration: 1000
										})
										callBack()
									} else {
										wx.showToast({
											title: '授权失败',
											icon: 'none',
											duration: 1000
										})
									}

								},
								fail: function() {

								}
							})
						} else {
							wx.showToast({
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

// 授权获取位置信息
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
				location.longitude = res.longitude
				location.latitude = res.latitude
				// 腾讯地图Api
				// const qqmapsdk =
				// 	new QQMapWX({ key: 'NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7' })
				// qqmapsdk.reverseGeocoder({
				// 	location,
				// 	success(response) {
				// 		let info = response.result
				// 		console.log(info)
				// 		location.province = info.address_component.province
				// 		location.city = info.address_component.city
				// 		location.district = info.address_component.district
				// 		location.street = info.address_component.street
				// 		location.address = info.address
				// 		resolve(location)
				// 	},
				// })
			},
			fail(err) {
				console.log(err)
				resolve(location)
			},
		})
	})
}

export default { authorize }