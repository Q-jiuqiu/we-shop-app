<template>
	<div class="foods" :style="fixedStyle">
		<customNavBack :custom="true" v-if="showDetail || !isShowTwo" @customBack="handleDetailBack"></customNavBack>
		<CustomNav ref="customNav" @search="handleSearch" :showInput="showInput" v-else></CustomNav>
		<div class="detail" v-if="showDetail">
			<Detail ref="detail" :detailInfo="detail"></Detail>
		</div>
		<div v-else>
			<div class="image-container">
				<div class="image-list"  @click="navigateCityInfo">
					<u-swiper :list="[imageList[0]]" style="height: 100%;"></u-swiper>
				</div>
				 
			</div>
			<!-- 下拉框操作栏 -->
			<div class="option">
				<div class="select">
					<div class="type">
						<CusSelect :options="filterData" @select="handleTypeSelect" @fixedTo="handleFixStyle">
						</CusSelect>
					</div>
					<div class="sort" v-if="!isShowTwo">
						<CusSelect :options="sortList" @select="handleSortSelect" @fixedTo="handleFixStyle"></CusSelect>
					</div>
				</div>
				<div class="map-button" @click="handleShowMap" v-if="!isShowTwo">进入地图模式</div>
			</div>
			<!-- 小类数据 -->
			<div class="content" v-if="isShowTwo">
				<div class="content-item" v-for="(item, index) in twoContent" :key="index"
					@click="handleTwoDetails(item)">
					<img class="image" :src="item.image" />
					<div class="text">
						<div class="text-item name">
							<div class="value">{{ item.name }}</div>
						</div>
						<div class="text-item dis">
							<div class="value line2">{{ item.remark }}</div>
						</div>
					</div>
				</div>
				<NoData v-if="twoContent.length === 0"></NoData>
				<div class="more" v-if="!isTwoLastPage">上拉获取更多数据</div>
			</div>
			<!-- 门店数据 -->
			<div class="content" v-else>
				<div class="content-item" v-for="(item, index) in threeContent" :key="index"
					@click="handleDetailShow(item)">
					<img class="image" :src="item.image1" />
					<div class="text">
						<div class="text-item name">
							<div class="value">{{ item.name }}</div>
							<div class="location">
								<div class="icon iconfont icon-dingwei1"></div>
								<div class="distance">{{ item.distance }}km</div>
							</div>
						</div>
						<div class="die">
							<div class="value line2">{{ item.introduction }}</div>
						</div>
						<div class="value capitaConsumption">
							<span>拥挤度:{{ item.environment }}</span>
							<span>卫生度:{{ item.queue}}</span>
							<span>人均:{{ item.capitaConsumption }}</span>

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
				imageList: [],
				contentList: [],
				showDetail: false, // 是否展示详情
				isLastPage: false, // 是否是最后一页
				curPage: 1, // 当前的页数
				filterData: [{ name: '全部美食' }], // 类型
				sortList: [{ name: '智能排序' }, { name: '热度' }, { name: '距离' }],
				twoCur: 1, // 二级数据类型的当前页
				twoContent: [], // 二级数据
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
				showInput: true, // 是否展示搜索框
				fixedStyle: {},
				secondType: '', // 二级类型
				threeType: '' // 三级级类型
			}
		},

		// 监听页面加载
		onLoad: async function() {
			this.getCityInfo()
			// 获取筛选条件
			const { content } = await this.getFilterDatas()
			this.getTwoDatas()
			if (content.length) {
				this.filterData.push(...content)
			} else {
				this.filterData = [{ name: '全部美食' }]
			}

			this.isShowTwo = true

			await authorize.getLocationInfo()
		},

		// 页面上拉触底事件
		onReachBottom: async function() {
			if (this.showDetail) {
				return
			}

			if (this.isShowTwo) {
				// 二级目录获取更多数据
				if (this.isTwoLastPage) {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				} else {
					this.twoCur++
					let params = {}
					if (this.secondType) {
						params = { parentName: this.secondType }
					}
					console.log('页面上拉触底事件',params);
					this.getTwoDatas(params)
				}
			} else {
				if (this.isThreeLastPage) {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				} else {
					this.threeCur++
					this.getThreeData({ threeType: this.threeType, city: this.city })
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
			// 调整根节点样式
			handleFixStyle(style) {
				this.fixedStyle = style
			},
			// 跳转至城市详情页
			navigateCityInfo() {
				uni.navigateTo({
					url: '/pages/cityInfo/cityInfo',
					success: res => {
						res.eventChannel.emit('cityInfo', {
							cityInfo: {
								imageList: this.imageList,
								cityDes: this.cityDes
							}
						})
					}
				})
			},
			/**
			 * @description  设置城市名称
			 */
			async setCity() {
				this.city = uni.getStorageSync('location').city
				this.getCityInfo()
				this.isShowTwo = true
			},
			/**
			 * @description 城市改变
			 */
			handleCityChange({ city }) {
				if (this.city === city) {
					return
				}
				this.city = city
				this.getCityInfo()
				if (this.isShowTwo) {
					this.twoContent = []
					this.twoCur = 1
					this.getTwoDatas()
				} else {
					// 正在查看三级数据--需刷新数据
					this.threeContent = []
					this.threeCur = 1
					this.getThreeData({ threeType: this.threeType, city: this.city })
				}
				// 清空胶囊处输入框
				this.$refs.customNav.handleInputClear()
			},
			/**
			 * @description 根据城市名称获取城市详细数据
			 * @param {string} city
			 */
		async	getCityInfo() {
				uni.request({
					url: `https://www.aomue.cn/dbs/pro/rest/dbs/city/dict/find/${this.city}`,
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
							console.log(this.imageList);
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
				this.twoCur = 1
				this.twoContent = []
				this.showInput = true
				if (!this.isShowTwo && !this.showDetail) {
					this.getTwoDatas()
				} else if (!this.isShowTwo && this.showDetail) {
					this.showDetail = false
				}
			},
			/**
			 * @description 根据关键字搜索
			 * @param {String} keyWord
			 */
			handleSearch(keyWord) {
				this.threeContent = []
				this.isShowTwo = false
				this.threeType = ''
				this.getThreeData({ name: keyWord, city: this.city, type: '美食' })
			},
			/**
			 * @description 选中类型
			 * @param {number} index 选中下标
			 */
			async handleTypeSelect(index) {
				const { name } = this.filterData[index]
				this.isShowTwo = true
				this.twoContent = []
				let params = {}
				this.secondType = ''
				this.twoCur = 1
				if (index !== 0) { 
					params = { parentName: name }
					this.secondType = name
				}
				console.log(params);

				this.getTwoDatas(params)
			},
			/**
			 * @description 选中排序
			 * @param {number} index 选中下标
			 */
			handleSortSelect(index) {
				// 按距离排序
				if (index === 2) {
					for (let i = 0; i < this.threeContent.length; i++) {
						for (let j = i + 1; j < this.threeContent.length; j++) {
							const tmep = this.threeContent[j]
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
			 * @description 获取指定二级(小类)数据详情
			 * @param {Object} item
			 */
			handleTwoDetails(item) {
				if (this.city) {
					this.isShowTwo = false
					this.threeContent = []
					this.threeType = item.name
					this.getThreeData({ threeType: item.name, city: this.city })
				} else {
					authorize.authorizeAgain()
				}
			},
			/**
			 * @description 获取三级数据--二级(小类)详情
			 * @param {Object} params 请求条件
			 */
			getThreeData(params = {}) {
				uni.showLoading({ title: '获取数据中' })
				uni.request({
					url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/${this.threeCur}/6`,
					data: params,
					method: 'GET',
					success: async res => {
						const data = res.data.data
						const { content, last } = data 
						this.threeContent.push(...content)
						this.isThreeLastPage = last
						this.isShowTwo = false
						await this.getDistance({
							longitude: this.location.longitude,
							latitude: this.location.latitude
						})
						uni.hideLoading()
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			// 详情
			handleDetailShow(detail) {
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
			/**
			 * @description 获取筛选(大类)数据
			 */
			getFilterDatas() {
				uni.showLoading({ title: '获取数据中' })
				return new Promise(resolve => {
					uni.request({
						url: 'https://www.aomue.cn/dbs/pro/rest/dbs/find/dict/one/1/1000?type=美食&level=2',
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
			/**
			 * @description 获取二级(小类)数据
			 * @param {Object} params 请求条件
			 */
			getTwoDatas(params = {}) {
				console.log("城市数据",this.city);
				uni.showLoading({ title: '获取数据中' })
				uni.request({
					url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/dict/one/${this.twoCur}/6?type=美食&level=3&city=${this.city}`,
					data: params,
					method: 'GET',
					success: res => {
						const data = res.data.data
						const { content, last } = data
						this.twoContent.push(...content)
						this.isTwoLastPage = last
						this.isShowTwo = true
						uni.hideLoading()
					},
					fail: err => {}
				})
			},

			// 获取美食数据
			getFoodsData(params = {}) {
				return new Promise(resolve => {
					uni.request({
						url: `https://www.aomue.cn/dbs/pro/rest/dbs/find/${this.threeCur}/6`,
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
						if (item.longitude && item.latitude) {
							toList.push({
								longitude: Number(item.longitude),
								latitude: Number(item.latitude)
							})
						}
					}
					if (toList.length > 0) {
						// 腾讯地图Api
						const qqmapsdk = new QQMapWX({ key: 'NVCBZ-67BCV-7VAP3-56OOQ-P6OQS-A3BZ7' })
						qqmapsdk.calculateDistance({
							from: {
								longitude, // 经度
								latitude // 纬度
							},
							to: toList,
							success: ({ result }) => {
								//成功后的回调 
								const distanceInfo = result.elements
								this.threeContent.forEach((item, index) => {
									const distance = distanceInfo[index].distance
									if (distance === -1) {
										item.distance = '--'
									} else {
										item.distance = (distanceInfo[index].distance / 1000).toFixed(
											1)
									}
								})
								this.threeContentCopy = JSON.parse(JSON.stringify(this.threeContent))
							},
							fail: function(error) {
								console.error(error)
							}
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
				background-color: #fdc307;
				color: #000;
				padding: 10rpx;
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
				height: 200rpx;
				letter-spacing: $letter-spacing-base;

				.image {
					width: 220rpx;
					height: 100%;
					border-radius: 20rpx;
				}

				.text {
					width: calc(100% - 220rpx);
					padding-left: $uni-spacing-row-base;
					height: 100%;

					&-item {
						display: flex;
						justify-content: space-between;
					}

					.dis {
						-webkit-line-clamp: 4;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						word-wrap: break-word;
						white-space: normal !important;
						-webkit-box-orient: vertical;
						height: calc(100% - 40rpx);

						.line2 {
							-webkit-line-clamp: 2;
							font-size: 12px;
							height: 100%;
						}
					}
					.die {
						-webkit-line-clamp: 4;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						word-wrap: break-word;
						white-space: normal !important;
						-webkit-box-orient: vertical; 

						.line2 {
							-webkit-line-clamp: 2;
							font-size: 12px; 
						}
					}
					.capitaConsumption {
						height: 40rpx;
						font-size: 25rpx;
						color: #0072bd;
						display: flex;
						justify-content: space-between;
						align-items: center;

						span {
							color: #0072bd;
						}
					}

					.name {
						font-size: 40rpx;
						color: #b50a0e;
						font-weight: bold;
						height: 40rpx;

						.value {
							@include ellipsis();
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