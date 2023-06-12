<template>
	<div class="avoid-bad">
		<CustomNav :showInput="false"></CustomNav>
		<div class="header">
			<u-subsection :list="list" :current="curNow" @change="sectionChange"></u-subsection>
		</div>
		<div class="food" v-if="curNow===0">
			<div class="content" v-if="foodData.length > 0">
				<div class="content-item" v-for="(item,index) in foodData" :key="index">
					{{item.leaveWord}}
				</div>
			</div>
			<NoData v-else></NoData>
			<div class="more" v-if="!foodLast">上拉获取更多数据</div>
		</div>
		<div class="food" v-else>
			<div class="content" v-if="senseData.length > 0">
				<div class="content-item" v-for="(item,index) in senseData" :key="index">
					{{item.leaveWord}}
				</div>
			</div>
			<NoData v-else></NoData>
			<div class="more" v-if="!senseLast">上拉获取更多数据</div>
		</div>
	</div>
</template>

<script>
	import NoData from '@/compnnents/noData/noData.vue'
	import CustomNav from '@/compnnents/customNav/customNav.vue'

	export default {
		name: 'avoidBad',
		components: { NoData, CustomNav },
		data() {
			return {
				foodData: [],
				foodCur: 1, // 美食数据的当前页
				foodLast: true, // 美食数据是否到最后一页
				senseData: [],
				senseCur: 1, // 风景数据的当前页
				senseLast: true,
				list: ['美食', '风景'],
				curNow: 0,
				city: uni.getStorageSync('location').city
			}
		},
		onLoad: function() {
			this.getData({ type: '美食' })
		},
		// 页面上拉触底事件
		onReachBottom: async function() {
			console.log('到底部啦')
			// 获取更多美食数据
			if (this.curNow === 0) {
				if (this.foodLast) {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				} else {
					this.foodCur++
					this.getData({ type: '美食' })
				}
			} else {
				if (this.senseLast) {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				} else {
					this.senseCur++
					this.getData({ type: '风景' })
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
			},
			// 城市改变
			async handleCityChange({ city }) {
				if (this.city === city) {
					return
				}
				this.foodCur = 1
				this.foodData = []
				this.senseCur = 1
				this.senseData = []
				this.getData()
			},
			/**
			 * @description 获取美食或者风景的避坑数据
			 * @param {Object} params 筛选条件
			 */
			getData(params) {
				params.city = this.city
				let curPage = this.foodCur
				if (params.type === '风景') {
					curPage = this.senseCur
				}
				uni.request({
					url: `http://8.137.19.141/pro/rest/dbs/find/escape/pit/${curPage}/10`,
					data: params,
					method: 'GET',
					success: ({ data }) => {
						const result = data.data
						if (params.type === '美食') {
							this.foodData.push(...result.content)
							this.foodLast = result.last
						} else {
							this.senseData.push(...result.content)
							this.senseLast = result.last
						}
						console.log(this.foodData, this.senseData)
					},
					fail: err => {
						console.log(err)
					}
				})
			},
			sectionChange(index) {
				this.curNow = index
				if ((index === 0 && this.foodData.length === 0) || (index === 1 && this.senseData.length === 0)) {
					this.getData({ type: this.list[index] })
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.avoid-bad {
		width: 100%;
		min-height: 100vh;
		background-color: $background;
		font-size: $uni-font-size-base;
	}

	.content-item {
		margin-bottom: 40rpx;
		background-color: white;
		padding: 20rpx 30rpx;
		text-indent: 2rem;
	}

	.more {
		text-align: center;
		color: $uni-text-color-grey;
	}
</style>