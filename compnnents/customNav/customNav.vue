<template>
	<div :style="{paddingTop:statusBarHeight,height:'44px'}">
		<u-picker :show="show" :columns="columns" @confirm="handleConfirm" @cancel="handleCancel"
			:closeOnClickOverlay='true' @close="show = false"></u-picker>
		<div class="custom-nav" :style="{paddingTop:statusBarHeight,height:'44px'}">
			<div class="container" :style="{width:surplusWidth}">
				<div class="locate" @click="handlePickerShow">
					<span class="city">{{city}}</span>
					<span class="iconfont icon-xiangxia"></span>
				</div>
				<div class="input-container">
					<u-input v-if="showInput" prefixIcon="search" prefixIconStyle="color: #909399"
						placeholder="请输入搜索关键词" border="surround" v-model="keyWord"
						@confirm="handleInputChange"></u-input>
					<!-- @change="$u.debounce(handleInputChange, 500)" -->
				</div>
			</div>
		</div>
	</div>

</template>

<script>
	import authorize from '@/utils/authorize.js'

	export default {
		name: 'customNav',
		props: {
			showInput: {
				type: Boolean,
				default: () => true
			}
		},
		data() {
			return {
				//状态栏的高度（可以设置为顶部导航条的padding-top）
				statusBarHeight: uni.getStorageSync('menuInfo').statusBarHeight,
				surplusWidth: uni.getStorageSync('menuInfo').surplusWidth,
				keyWord: '',
				city: uni.getStorageSync('location').city || '未授权',
				columns: [],
				show: false
			}
		},
		created() {
			uni.$on('locationSave', this.setCity)
			uni.$on('locationChange', this.handleCityChange)
			const cityList = uni.getStorageSync('cityList')
			console.log('cityList:', cityList)
			if (cityList) {
				this.columns = cityList
			} else {
				uni.request({
					url: 'http://8.137.19.141/pro/rest/dbs/find/type/v2',
					method: 'GET',
					success: res => {
						this.columns = [res.data.data]
						console.log('this.columns', this.columns)
						uni.setStorageSync('cityList', this.columns)
					},
					fail: err => {
						console.log(err)
					}
				})
			}

		},
		beforeDestroy() {
			uni.$off('locationSave', this.setCity)
			uni.$off('locationChange', this.handleCityChange)
		},
		methods: {
			// 城市改变
			async handleCityChange({ city }) {
				if (this.city === city) {
					return
				}
				// 清空胶囊处输入框
				this.handleInputClear()
				this.city = city
			},
			// 设置城市名称
			setCity() {
				this.city = uni.getStorageSync('location').city
			},
			// 输入改变
			handleInputChange() {
				console.log(uni.getStorageSync('location'))
				this.$emit('search', this.keyWord)
			},
			// 清空输入框
			handleInputClear() {
				this.keyWord = ''
			},
			handlePickerShow() {
				if (this.city === '未授权') {
					authorize.authorizeAgain(this.showPicker)
				} else {
					this.showPicker()
				}

			},
			showPicker() {
				console.log(this)
				if (this.columns.length > 0) {
					this.show = true
				}
			},
			// picker选中
			handleConfirm(info) {
				console.log(info)
				this.city = info.value[0]
				const location = uni.getStorageSync('location')
				this.show = false
				location.city = this.city
				uni.setStorageSync('location', location)
				uni.$emit('locationChange', location)
			},
			handleCancel() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.custom-nav {
		background: #fdc307;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 11111;
		width: 100%;
		display: flex;
		align-items: center;

		.container {
			display: flex;
			align-items: center;
			padding: 0 7px 0 9px;
			box-sizing: border-box;

			.locate {
				margin-right: 20rpx;
			}

			.input-container {
				flex: 1;
				background: white;
				border-radius: 10px;
			}
		}
	}
</style>