<template>
	<div class="foods" :style="fixedStyle">
		<customNavBack :custom="true" v-if="showDetail" @customBack="handleDetailBack">
		</customNavBack>
		<CustomNav ref="customNav" @search="handleSearch" :showInput="showInput" v-else></CustomNav>
		<div class="detail" v-if="showDetail">
			<Detail ref="detail" :detailInfo="detail"></Detail>
		</div>
		<div v-else>
			<div class="image-container">
				<img class="image" :src="imageList[0]" alt="美食" @click="navigateCityInfo">
			</div>

			<div class="option">
				<div class="select">
					<div class="type">
						<CusSelect selecName='type' :options="typeList" @select="handleTypeSelect"
							@fixedTo="handleFixStyle">
						</CusSelect>
					</div>
					<div class="sort">
						<CusSelect selecName='sort' :options="sortList" @select="handleSortSelect"
							@fixedTo="handleFixStyle">
						</CusSelect>
					</div>
				</div>
				<div class="map-button" @click="handleShowMap">进入地图模式</div>
			</div>
			<div class="content">
				<div class="content-item" v-for="(item,index) in threeContent" :key="index"
					@click="handleDetailShow(item)">
					<img class="image" :src="item.image">
					<div class="text">
						<div class="text-item name">
							<div class="value">{{item.name}}</div>
							<div class="location">
								<div class="icon iconfont icon-dingwei1"></div>
								<div class="distance">{{item.distance}}km</div>
							</div>
						</div>
						<div class="text-item dis">
							<div class="value">{{item.remark}}</div>
						</div>
					</div>
				</div>
				<NoData v-if="threeContent.length === 0" tips="当前城市暂无数据"></NoData>
				<div class="more" v-if="!isThreeLastPage">上拉获取更多数据</div>
			</div>
		</div>
	</div>
</template>

<script>
	const QQMapWX = require('../../static/qqmap-wx-jssdk.min.js')
	import NoData from '@/compnnents/noData/noData.vue'
	import CusSelect from '@/compnnents/select/select.vue'
	import CustomNav from '@/compnnents/customNav/customNav.vue'
	import customNavBack from '@/compnnents/customNavBack/customNavBack.vue'
	import Detail from '@/compnnents/detail/detail.vue'
	import authorize from '@/utils/authorize.js'

	export default {
		name: 'FoodsIndex',
		components: { CusSelect, CustomNav, customNavBack, Detail, NoData },
		data() {
			return {
				imageList: [
					'https://t7.baidu.com/it/u=760837404,2640971403&fm=193&f=GIF'
				],
				cityDes: '',
				contentList: [],
				showDetail: false, // 是否展示详情
				isLastPage: false, // 是否是最后一页
				curPage: 1, // 当前的页数
				typeList: [{ name: '全部美食' }], // 类型
				sortList: [
					{ name: '智能排序' },
					{ name: '热度' },
					{ name: '距离' }
				],
				twoCur: 1, // 二级数据类型的当前页
				// twoContent: [], // 二级数据
				// twoContentCopy: [],
				// isShowTwo: true, // 是否展示二级数据
				// isTwoLastPage: true, // 二级数据是否是最后一页
				// 三级数据
				threeCur: 1,
				threeContent: [],
				threeContentCopy: [], // 用以排序
				isThreeLastPage: true,
				// 详情
				detail: {},
				location: uni.getStorageSync('location'), // 位置信息
				city: uni.getStorageSync('location').city,
				showInput: true, // 是否展示搜索框
				fixedStyle: {},
				secondType: '' // 二级类型
			}
		},

		// 监听页面加载
		onLoad: async function() {
			this.getCityInfo()
			// 获取二级数据
			const { content, last } = await this.getOneDatas()
			this.typeList.push(...content)
			// await this.getThreeData({ city: this.city, type: '美食' })
			await authorize.getLocationInfo()
		},

		created() {
			uni.$on('locationChange', this.handleCityChange)
			uni.$on('locationSave', this.setCity)
		},

		beforeDestroy() {
			uni.$off('locationChange', this.handleCityChange)
			uni.$off('locationSave', this.setCity)
		},

		// 页面上拉触底事件
		onReachBottom: async function() {
			console.log('到底部啦', this.isShowTwo, this.isTwoLastPage, this.isThreeLastPage)
			if (this.showDetail) {
				// 获取下一页留言数据
				this.$refs.detail && this.$refs.detail.getLastComment()
			} else {
				if (!this.isThreeLastPage) {
					this.threeCur++
					await this.getThreeData({ secondType: this.secondType, city: this.city })
				} else {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				}
			}
			// 二级目录获取更多数据
			// if (this.isShowTwo) {
			// 	if (!this.isTwoLastPage) {
			// 		this.twoCur++
			// 		const { content, last } = await this.getOneDatas()
			// 		this.typeList.push(...content)
			// 		this.twoContent = content
			// 		this.isTwoLastPage = last
			// 		this.isShowTwo = true
			// 	} else {
			// 		uni.showToast({
			// 			icon: 'none',
			// 			title: '没更多数据啦'
			// 		})
			// 	}
			// } else {
			// if (!this.isThreeLastPage) {
			// 	this.threeCur++
			// 	await this.getThreeData({ secondType: this.secondType, city: this.city })
			// } else {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '没更多数据啦'
			// 	})
			// }
			// }
		},

		methods: {
			// 调整根节点样式
			handleFixStyle(style) {
				this.fixedStyle = style
			},
			// 跳转至城市详情页
			navigateCityInfo() {
				uni.navigateTo({
					url: '/pages/cityInfo/cityInfo',
					success: res => {
						console.log(res)
						res.eventChannel.emit('cityInfo', {
							cityInfo: {
								imageList: this.imageList,
								cityDes: this.cityDes
							}
						})
					}
				})
			},
			// 设置城市名称
			setCity() {
				this.city = uni.getStorageSync('location').city
				this.getCityInfo()
				this.threeContent = []
				this.threeCur = 1
				const params = {
					city: this.city,
					type: '美食'
				}
				if (this.secondType) {
					params.secondType = this.secondType
				}
				console.log(params)
				this.getThreeData(params)
			},
			// 城市改变
			async handleCityChange({ city }) {
				if (this.city === city) {
					return
				}
				// 清空胶囊处输入框
				// this.$refs.customNav.handleInputClear()
				this.city = city
				// 正在查看三级数据--需刷新数据
				if (!this.isShowTwo) {
					this.threeContent = []
					this.threeCur = 1
					const params = {
						city: this.city,
						type: '美食'
					}
					if (this.secondType) {
						params.secondType = this.secondType
					}
					console.log(params)
					await this.getThreeData(params)
					this.getCityInfo()
				}
			},
			/**
			 * @description 根据城市名称获取城市详细数据
			 * @param {string} city
			 */
			getCityInfo(city) {
				uni.request({
					url: `http://8.137.19.141/pro/rest/dbs/city/dict/find/${this.city}`,
					method: 'GET',
					success: ({ data }) => {
						const info = data.data
						if (info) {
							this.imageList = []
							const keys = Object.keys(info)
							for (let key of keys) {
								if (key.indexOf('image') >= 0 && info[key]) {
									this.imageList.push(info[key])
								}
							}
							this.cityDes = info.remark
						}
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			// 详情返回
			handleDetailBack() {
				this.showDetail = false
				this.showInput = true
			},
			/**
			 * @description 根据关键字搜索
			 * @param {String} keyWord
			 */
			async handleSearch(keyWord) {
				console.log('搜索关键字:', keyWord)
				this.threeContent = []
				this.isShowTwo = false
				await this.getThreeData({ name: keyWord, city: this.city, type: '美食' })
			},
			/**
			 * @description 选中类型
			 * @param {number} index 选中下标
			 */
			async handleTypeSelect(index) {
				const { name } = this.typeList[index]
				console.log('type', index, name)
				this.isShowTwo = true
				const params = { city: this.city, type: '美食' }
				if (index !== 0) {
					params.secondType = name
				}
				this.threeContent = []
				await this.getThreeData(params)

			},
			/**
			 * @description 选中排序
			 * @param {number} index 选中下标
			 */
			handleSortSelect(index) {
				console.log('Sort', index)
				// 按距离排序
				if (index === 2) {
					for (let i = 0; i < this.threeContent.length; i++) {
						for (let j = i + 1; j < this.threeContent.length; j++) {
							const tmep = this.threeContent[j]
							console.log(this.threeContent[i].distance, this.threeContent[j].distance)
							if (this.threeContent[i].distance >= this.threeContent[j].distance) {
								this.threeContent[j] = this.threeContent[i]
								this.threeContent[i] = tmep
							}
						}
					}
				} else {
					this.threeContent = this.threeContentCopy
				}

			},
			/**
			 * @description 获取指定分类数据
			 * @param {Object} item
			 */
			async handleTowData(item) {
				console.log(item, this.city)
				if (this.city) {
					// this.isShowTwo = false
					this.threeContent = []
					this.secondType = item.name
					console.log('this.city', this.city)
					await this.getThreeData({ secondType: item.name, city: this.city })
				} else {
					authorize.authorizeAgain()
				}
			},
			// 点击页面监听
			// handlePageClick() {
			// 	uni.$emit('handleSelectShow', false)
			// },

			// 获取三级数据
			async getThreeData(params = {}) {
				uni.showLoading({ title: '获取数据中' })
				const res = await this.getFoodsData(params)
				console.log('res', res)
				this.threeContent.push(...res.content)
				// console.log('this.threeContent', this.threeContent)
				this.isThreeLastPage = res.last
				this.isShowTwo = false
				// console.log('0000', this.location)
				await this.getDistance({
					longitude: this.location.longitude,
					latitude: this.location.latitude
				})
				uni.hideLoading()
			},

			// 详情
			handleDetailShow(detail) {
				console.log(detail)
				this.detail = detail
				this.showInput = false
				this.showDetail = true
			},

			// 进入地图
			handleShowMap() {
				uni.navigateTo({
					url: '/pages/index/index',
					success: res => {
						res.eventChannel.emit('foodMap', { data: this.threeContent })
					}
				})
			},

			// 获取美食二级分类数据
			getOneDatas() {
				uni.showLoading({ title: '获取数据中' })
				return new Promise(resolve => {
					uni.request({
						url: 'http://8.137.19.141/pro/rest/dbs/find/dict/1/99999?Type=美食',
						method: 'GET',
						success: res => {
							const data = res.data.data
							uni.hideLoading()
							resolve(data)
						},
						fail: err => {
							resolve([])
						}
					})
				})
			},

			// 获取美食数据
			getFoodsData(params = {}) {
				return new Promise(resolve => {
					uni.request({
						url: `http://8.137.19.141/pro/rest/dbs/find/${this.threeCur}/10`,
						data: params,
						method: 'GET',
						success: res => {
							const data = res.data.data
							resolve(data)
						},
						fail: err => {
							console.log(err)
							resolve([])
						}
					})
				})
			},

			// 获取距离
			getDistance({ longitude, latitude }) {
				if (this.threeContent.length > 0) {
					const toList = []
					const start = (this.threeCur - 1) * 10
					for (let i = start; i < this.threeContent.length; i++) {
						const item = this.threeContent[i]
						if (item.longitude && item.latitude && !item.distance) {
							toList.push({
								longitude: Number(item.longitude),
								latitude: Number(item.latitude)
							})
						}
					}
					console.log('toList', toList)
					if (toList.length > 0) { // 腾讯地图Api
						const qqmapsdk =
							new QQMapWX({ key: 'NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7' })
						qqmapsdk.calculateDistance({
							from: {
								longitude, // 经度
								latitude // 纬度
							},
							to: toList,
							success: ({ result }) => { //成功后的回调
								const distanceInfo = result.elements
								console.log('result', result, distanceInfo)
								for (let i = 0; i < distanceInfo.length; i++) {
									const distance = distanceInfo[i].distance
									if (distance === -1) {
										this.threeContent[start + i].distance = '--'
									} else {
										this.threeContent[start + i].distance = (distance / 1000).toFixed(1)
									}
								}
								this.threeContentCopy = JSON.parse(JSON.stringify(this
									.threeContent))
							},
							fail: function(error) {
								console.error(error)
							},
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.foods {
		min-height: 100vh;
		background: $background;

		.image-container {
			background-color: white;
			height: 400rpx;

			.image {
				width: 100%;
				height: 100%;
			}
		}

		.option {
			padding: 25rpx 20rpx $uni-spacing-row-base 20rpx;
			display: flex;
			justify-content: space-between;

			.select {
				display: flex;
				align-items: center;

				.type {
					margin-right: 40rpx;
				}
			}

			.map-button {
				background-color: white;
				padding: 8rpx;
				border-radius: 10rpx;
			}
		}

		.content {
			padding: 0 $uni-spacing-row-base;

			&-item {
				display: flex;
				align-items: center;
				border-radius: 30rpx;
				@include defaultContainer();
				margin: 20rpx;
				padding: 20rpx;
				height: 225rpx;
				letter-spacing: $letter-spacing-base;

				.image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 20rpx;
				}

				.text {
					width: calc(100% - 200rpx);
					padding-left: $uni-spacing-row-base;
					height: 100%;

					&-item {
						display: flex;
						justify-content: space-between;
						margin-bottom: $uni-spacing-row-base;
					}

					.dis {
						.value {
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							word-wrap: break-word;
							white-space: normal !important;
							-webkit-line-clamp: 4;
							-webkit-box-orient: vertical;
						}
					}

					.name {
						color: #b50a0e;
						font-weight: bold;

						.value {
							font-size: $uni-font-size-lg;
							@include ellipsis()
						}

						.location {
							display: flex;
							color: $uni-text-color-grey;
							font-size: $uni-font-size-sm;
							font-weight: normal;
							align-items: center;
						}
					}
				}
			}
		}
	}
</style>