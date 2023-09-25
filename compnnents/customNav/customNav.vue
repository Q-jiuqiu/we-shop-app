<template>
	<div :style="{ paddingTop: statusBarHeight, height: '44px' }">
		<u-picker ref="uPicker" 
			:show="show" 
			:title="pickerTitle"
			:columns="columns"
			:closeOnClickOverlay="true"
			:loading="pickerLoading"
			@confirm="handleConfirm" 
			@cancel="handleCancel"
			@close="handleCancel" 
			@change="changeHandler">
		</u-picker>
		<div class="custom-nav" :style="{ paddingTop: statusBarHeight, height: '44px' }">
			<div class="container" :style="{ width: surplusWidth }">
				<div class="locate" @click="handlePickerShow">
					<span class="city">{{ city }}</span>
					<span class="iconfont icon-xiangxia"></span>
				</div>
				<div class="input-container">
					<u-input v-if="showInput" prefixIcon="search" prefixIconStyle="color: #909399"
						placeholder="请输入搜索关键词" border="surround" v-model="keyWord" shape="circle"
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
				show: false,
				columnData: [],
				cityData: [],
				pickerLoading:false,
				pickerTitle:""
			}
		},
		created() {
			uni.$on('locationSave', this.setCity)
			uni.$on('locationChange', this.handleCityChange)
			console.log( uni.getStorageSync('location').city);
			const cityList = uni.getStorageSync('cityList')
			if (cityList) {
				this.columns = cityList
			} else {
				uni.request({
					url: 'https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/tree/-1',
					method: 'GET',
					success: res => { 
						this.cityData = res.data.data
						res.data.data.forEach(item => {
							this.columns.push(item.city)
						})
						this.columns = [this.columns] 
						uni.setStorageSync('cityData', this.cityData)
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
		/**
			* @description: 选择行政区划
			* @param {*} e
			* @return {*}
			*/			
			changeHandler(e) {
				const {
					columnIndex,
					value, 
					values,
					picker = this.$refs.uPicker
				} = e  
				this.pickerTitle = value[columnIndex]
				if (columnIndex === 0) { 
					const cityData = uni.getStorageSync('cityData')
					cityData.forEach(item => {
						if (item.city === value[0]) {
							this.pickerLoading = true
							uni.request({
								url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/tree/${item.id}`,
								method: 'GET',
								success: res => {
									const colums = []
									res.data.data.forEach(elements => {
										colums.push(elements.city)
									})
									uni.setStorageSync('cityData1', res.data.data) 
									picker.setColumnValues(1, colums)
									picker.setColumnValues(2, [])
									this.pickerLoading = false
								},
								fail: err => {
									console.log(err)
								}
							})
						}
					})
				}
				if (columnIndex === 1) {
					const cityData1 = uni.getStorageSync('cityData1')
					cityData1.forEach(item => {
						if (item.city === value[1]) {
							this.pickerLoading = true
							uni.request({
								url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/tree/${item.id}`,
								method: 'GET',
								success: res => {
									const colums = []
									res.data.data.forEach(elements => {
										colums.push(elements.city)
									})
									if (colums.length) { 
										picker.setColumnValues(2, colums)
									}
									this.pickerLoading = false
								},
								fail: err => {
									console.log(err)
								}
							})
						}
					})
				}
			},
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
				console.log(this.city);
			},
			// 输入改变
			handleInputChange() {
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
				if (this.columns.length > 0) {
					this.show = true
				}
			},
			// picker选中
			handleConfirm(info) {  
				if(this.pickerTitle){
					this.city = this.pickerTitle
					const location = uni.getStorageSync('location')
					this.show = false
					location.city = this.city
					uni.setStorageSync('location', location)
					uni.$emit('locationChange', location)
				}else{
						uni.showToast({
							title: '未选择城市或者地区',
							duration: 2000
						});
				}
				
			},
			/**
			* @description: 关闭
			* @return {*}
			*/			
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
				border-radius: 25px;
			}
		}
	}
</style>