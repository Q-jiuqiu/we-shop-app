<script>
	export default {

		onShow: function() {
			uni.getSystemInfo({
				success: result => {
					console.log('result', result)

					// 获取手机系统的状态栏高度（不同手机的状态栏高度不同
					let statusBarHeight = result.statusBarHeight + 'px'
					// 获取手机系统下边距离顶部
					let safeAreaBottom = result.safeArea.bottom + 'px'

					// 获取右侧胶囊的信息 单位px
					const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
					//bottom: 胶囊底部距离屏幕顶部的距离
					//height: 胶囊高度
					//left:   胶囊左侧距离屏幕左侧的距离
					//right:  胶囊右侧距离屏幕左侧的距离
					//top:    胶囊顶部距离屏幕顶部的距离
					//width:  胶囊宽度
					// console.log('计算胶囊右侧距离屏幕右边距离', result.screenWidth - menuButtonInfo.right)
					let menuWidth = menuButtonInfo.width + 'px'
					let menuHeight = menuButtonInfo.height + 'px'
					let menuBorderRadius = menuButtonInfo.height / 2 + 'px'
					let menuRight = result.screenWidth - menuButtonInfo.right + 'px'
					let menuTop = menuButtonInfo.top + 'px'
					let contentTop = result.statusBarHeight + 44 + 'px'
					let surplusWidth = menuButtonInfo.left + 'px'

					let menuInfo = {
						statusBarHeight: statusBarHeight, //状态栏高度----用来给自定义导航条页面的顶部导航条设计padding-top使用：目的留出系统的状态栏区域
						menuWidth: menuWidth, //右侧的胶囊宽度--用来给自定义导航条页面的左侧胶囊设置使用
						menuHeight: menuHeight, //右侧的胶囊高度--用来给自定义导航条页面的左侧胶囊设置使用
						menuBorderRadius: menuBorderRadius, //一半的圆角--用来给自定义导航条页面的左侧胶囊设置使用
						menuRight: menuRight, //右侧的胶囊距离右侧屏幕距离--用来给自定义导航条页面的左侧胶囊设置使用
						menuTop: menuTop, //右侧的胶囊顶部距离屏幕顶部的距离--用来给自定义导航条页面的左侧胶囊设置使用
						contentTop: contentTop, //内容区距离页面最上方的高度--用来给自定义导航条页面的内容区定位距离使用
						surplusWidth: surplusWidth, // 剩余宽度
						safeAreaBottom,
						model: result.model,
						screenHeight: result.screenHeight, // 屏幕高度
						windowHeight: result.windowHeight, // 窗口高度
						pixelRatio: result.pixelRatio // 设备像素比
					}

					uni.setStorageSync('menuInfo', menuInfo)
				},
				fail: error => {
					console.log(error)
				}
			})
		},
	}
</script>




<style lang="scss">
	@import "@/uni_modules/uview-plus/index.scss";

	@import url("/static/iconfont/iconfont.css");

	view {
		font-size: $uni-font-size-base;
	}

	.more {
		text-align: center;
		color: $uni-text-color-grey;
	}
</style>