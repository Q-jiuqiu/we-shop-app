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

export default { authorize }