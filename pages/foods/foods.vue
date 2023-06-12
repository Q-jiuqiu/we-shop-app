<template>
	<div class="foods" @click="handlePageClick">
		<CustomNav ref="customNav" @search="handleSearch" :showInput="showInput"></CustomNav>
		<div class="detail" v-if="showDetail">
			<Detail :detailInfo="detail" @back="hanldeDetialBack"></Detail>
		</div>
		<div v-else>
			<div class="image-container">
				<div class="image-list">
					<u-swiper :list="imageList" style="height: 100%;"></u-swiper>
				</div>
				<div class="describe">
					<div class="text">
						{{cityDes}}
					</div>
				</div>
			</div>

			<div class="option">
				<div class="select">
					<div class="type">
						<CusSelect :options="typeList" @select="handleTypeSelect"></CusSelect>
					</div>
					<div class="sort">
						<CusSelect :options="sortList" @select="handleSortSelect" v-if="!isShowTwo"></CusSelect>
					</div>
				</div>
				<div class="map-button" @click="handleShowMap" v-if="!isShowTwo">进入地图模式</div>
			</div>

			<div class="content" v-if="isShowTwo">
				<div class="content-item" v-for="(item,index) in twoContent" :key="index" @click="handleTowData(item)">
					<img class="image" :src="item.image">
					<div class="text">
						<div class="text-item name">
							<div class="value">{{item.name}}</div>
						</div>
						<div class="text-item dis">
							<div class="value">{{item.remark}}</div>
						</div>
					</div>
				</div>
				<NoData v-if="twoContent.length === 0"></NoData>
				<div class="more" v-if="!isTwoLastPage">上拉获取更多数据</div>
			</div>
			<div class="content" v-else>
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
				<NoData v-if="threeContent.length === 0"></NoData>
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
	import Detail from '@/compnnents/detail/detail.vue'
	import authorize from '@/utils/authorize.js'

	export default {
		name: 'FoodsIndex',
		components: { CusSelect, CustomNav, Detail, NoData },
		data() {
			return {
				imageList: [
					'https://cdn.uviewui.com/uview/swiper/swiper1.png',
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
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
				twoContent: [], // 二级数据
				twoContentCopy: [],
				isShowTwo: true, // 是否展示二级数据
				isTwoLastPage: true, // 二级数据是否是最后一页
				// 三级数据
				threeCur: 1,
				threeContent: [],
				threeContentCopy: [], // 用以排序
				isThreeLastPage: true,
				// 详情
				detail: {},
				location: uni.getStorageSync('location'), // 位置信息
				city: uni.getStorageSync('location').city,
				showInput: true // 是否展示搜索框
			}
		},

		// 监听页面加载
		onLoad: async function() {
			this.getCityInfo()
			// 获取二级数据
			const { content, last } = await this.getOneDatas()
			this.typeList.push(...content)
			this.twoContent = content
			this.twoContentCopy = JSON.parse(JSON.stringify(this.twoContent))
			this.isTwoLastPage = last
			this.isShowTwo = true

			await authorize.getLocationInfo()
		},

		// 页面上拉触底事件
		onReachBottom: async function() {
			console.log('到底部啦', this.isShowTwo, this.isTwoLastPage, this.isThreeLastPage)
			if (this.showDetail) {
				return
			}
			// 二级目录获取更多数据
			if (this.isShowTwo) {
				if (!this.isTwoLastPage) {
					this.twoCur++
					const { content, last } = await this.getOneDatas()
					this.typeList.push(...content)
					this.twoContent = content
					this.isTwoLastPage = last
					this.isShowTwo = true
				} else {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				}
			} else {
				if (!this.isThreeLastPage) {
					this.threeCur++
					await this.getThreeData({ secondType: item.name, city: this.city })
				} else {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				}
			}
		},
		created() {
			uni.$on('locationChange', this.handleCityChange)
			uni.$on('locationSave', this.setCity)
		},
		beforeDestroy() {
			uni.$off('locationChange', this.handleCityChange)
			uni.$off('locationSave', this.setCity)
		},
		methods: {
			// 设置城市名称
			setCity() {
				this.city = uni.getStorageSync('location').city
				this.getCityInfo()
			},
			// 城市改变
			async handleCityChange({ city }) {
				if (this.city === city) {
					return
				}
				// 清空胶囊处输入框
				this.$refs.customNav.handleInputClear()
				this.city = city
				// 正在查看三级数据--需刷新数据
				if (!this.isShowTwo) {
					this.threeContent = []
					this.threeCur = 1
					await this.getThreeData({ secondType: this.secondType, city: this.city })
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
						this.imageList = []
						const info = data.data
						const keys = Object.keys(info)
						for (let key of keys) {

							if (key.indexOf('image') >= 0 && info[key]) {
								this.imageList.push(info[key])
							}
						}
						this.cityDes = info.remark
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			// 详情返回
			hanldeDetialBack() {
				this.showDetail = false
				this.showInput = true
			},
			/**
			 * @description 根据关键字搜索
			 * @param {String} keyWord
			 */
			async handleSearch(keyWord) {
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
				console.log('type', index, this.twoContentCopy)
				this.isShowTwo = true
				if (index === 0) {
					this.twoContent = this.twoContentCopy
				} else {
					this.twoContent = this.twoContentCopy.filter(item => {
						if (item.name === name) {
							return item
						}
					})
				}
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
					this.isShowTwo = false
					this.threeContent = []
					this.secondType = item.name
					console.log('this.city', this.city)
					await this.getThreeData({ secondType: item.name, city: this.city })
				} else {
					authorize.authorizeAgain()
				}
			},
			// 点击页面监听
			handlePageClick() {
				uni.$emit('handleSelectShow', false)
			},
			// 获取三级数据
			async getThreeData(params = {}) {
				uni.showLoading({ title: '获取数据中' })
				const res = await this.getFoodsData(params)
				console.log('res', res)
				this.threeContent.push(...res.content)
				console.log('this.threeContent', this.threeContent)
				this.isThreeLastPage = res.last
				this.isShowTwo = false
				console.log('0000', this.location)
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
						url: `http://8.137.19.141/pro/rest/dbs/find/dict/${this.twoCur}/10?Type=美食`,
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
					for (let item of this.threeContent) {
						console.log('item--', item)
						if (item.longitude && item.latitude) {
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
								console.log('result', result)
								const distanceInfo = result.elements
								this.threeContent.forEach((item, index) => {
									const distance = distanceInfo[index]
										.distance
									if (distance === -1) {
										item.distance = '--'
									} else {
										item.distance = (distanceInfo[index]
											.distance / 1000).toFixed(
											1)
									}
								})
								this.threeContentCopy = JSON.parse(JSON.stringify(this
									.threeContent))
								console.log('距离', this.threeContent)
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

			.image-list {
				height: 400rpx;

				::v-deep .u-swiper {
					height: 100% !important;

					.u-swiper__wrapper {
						height: 100% !important;

						.u-swiper__wrapper__item__wrapper {
							height: 100% !important;
						}

						image {
							height: 100% !important;
						}
					}
				}
			}

			.describe {
				padding: 10rpx 5rpx 20rpx 10rpx;

				.text {
					letter-spacing: 10rpx;
					line-height: 55rpx;
					text-indent: 2rem;
					word-break: break-all; //在恰当的断字点进行换行 
					overflow: hidden; //文字超出的进行隐藏
					text-overflow: ellipsis; //超出的文字用省略号表示
					display: -webkit-box; //将元素设为盒子伸缩模型显示
					text-overflow: ellipsis; //利用盒子模型 
					-webkit-box-orient: vertical; //伸缩方向设为垂直方向
					-webkit-line-clamp: 6;
				}
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
						font-size: 40rpx;
						color: #b50a0e;
						font-weight: bold;

						.value {
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

	.more {
		text-align: center;
		color: $uni-text-color-grey;
	}
</style>