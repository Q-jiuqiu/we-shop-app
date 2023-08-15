<template>
	<div class="detail">
		<CustomNavBack></CustomNavBack>
		<header class="header">
			<div class="image-container">
				<img class="image" :src="detailInfo.image" />
				<img class="image" :src="detailInfo.image" />
			</div>
			<div class="info">
				<div class="title">{{ detailInfo.name }}</div>
				<div class="title">{{ detailInfo.name }}</div>
				<div class="open-time" v-if="detailInfo.workTime">
					<div :class="['open',{close: !isOpen}]">{{isOpen?'营业中':'歇业中'}}</div>
					<div class="time">{{detailInfo.workTime}}</div>
				</div>
				<div class="adds" @click="navigatorToMap">
					<span class="iconfont icon-dingwei1"></span>
					<span class="text">{{ detailInfo.addr }}</span>
				</div>
			</div>
		</header>
		<!-- 占位 -->
		<div class="box"></div>
		<section class="container">
			<div id="add" class="add" ref="add" @click="addComment" :style="{ top: backTop }" v-show="activeTab === 2">
				<span class="iconfont">+</span>
			</div>
			<!-- 使tabs滑动浮动在最顶部 -->
			<u-sticky bgColor="#fff" :offset-top="stickyTop" bg-color="#f4f4f4">
				<div class="tabs">
					<div :class="['tabs-item', { active: activeTab === index }]" v-for="(item, index) in tabList" :key="index" @click="handleTabClick(index)">
						{{ item }}
					</div>
				</div>
			</u-sticky>
			<!-- 简介 -->
			<div class="des tab-container" v-show="activeTab === 0">
				{{ detailInfo.remark }}
			</div>
			<!-- 推荐 -->
			<div class="recommend tab-container" v-show="activeTab === 1">
				<div class="recommend-item" v-for="(item, index) in recommendData" :key="index">
					<div class="left">
						<img class="image" :src="item.image" />
					</div>
					<div class="right">
						<div class="title">{{ item.foodName }}</div>
						<div class="describe">{{ item.describe }}</div>
					</div>
				</div>
				<NoData v-if="recommendData.length === 0"></NoData>
			</div>
			<!-- 评价 -->
			<div class="comment tab-container" v-show="activeTab === 2">
				<div class="comment-item" v-for="(item, index) in commentData" :key="index">
					<div class="content">{{ item.comment }}</div>
				</div>
				<NoData v-if="commentData.length === 0"></NoData>
				<div class="more" v-if="!commentLast">上拉获取更多数据</div>
			</div>
		</section>
		<u-popup :show="show" @close="close">
			<div class="textarea">
				<u-textarea v-model="comment" placeholder="请输入评论内容" :maxlength="-1"></u-textarea>
			</div>
			<div class="buttons">
				<div class="cancel">
					<u-button type="warning" :plain="true" text="镂空" @click="close">取消</u-button>
				</div>
				<div class="confirm">
					<u-button type="warning" text="确定" @click="handleConfirm">确认</u-button>
				</div>
			</div>
		</u-popup>
	</div>
</template>

<script>
import NoData from '@/compnnents/noData/noData.vue'
import CustomNavBack from '@/compnnents/customNavBack/customNavBack.vue'

export default {
	name: 'detailCom',
	components: { NoData, CustomNavBack },
	data() {
		return {
			tabList: ['简介', '推荐', '评价'],
			activeTab: 0,
			recommendData: [],
			commentData: [],
			isOpen: true,
			backTop: uni.getStorageSync('menuInfo').windowHeight,
			show: false,
			comment: '',
			commentCur: 1,
			commentLast: true, // 评价数据是否是最后一页
			detailInfo: {}
		}
	},
	computed: {
		stickyTop() {
			// 手机系统的状态栏高度
			const statusBarHeight = uni.getStorageSync('menuInfo').statusBarHeight
			let height = 0
			if (statusBarHeight) {
				height = parseInt(statusBarHeight)
			}

			// 44为自定义顶部导航栏高度
			return height + 44 + 'px'
		}
	},
	onLoad: function () {
		console.log('onload')
		const eventChannel = this.getOpenerEventChannel()
		this.eventChannel = eventChannel
		eventChannel.on('detailPage', ({ detail }) => {
			console.log(detail)
			this.detailInfo = detail
		})
	},

	created() {
		this.isOpen = this.judgeOpen(this.detailInfo.workTime)
	},

	watch: {
		activeTab(newVal) {
			console.log('newVal', newVal)
			if (newVal === 2) {
				this.$nextTick(() => {
					setTimeout(() => {
						console.log('this', this)
						const menuInfo = uni.getStorageSync('menuInfo')
						const windowHeight = parseInt(menuInfo.windowHeight)
						const query = uni.createSelectorQuery().in(this)
						query
							.select('#add')
							.boundingClientRect(rect => {
								console.log('backTop:', rect)
								const height = rect.height + 2
								this.backTop = `${windowHeight - height}px`
							})
							.exec()
					})
				})
			}
		}
	},

	methods: {
		// 关闭新增评论弹框
		close() {
			this.show = false
			console.log('close')
		},
		// 判断是否在营业中 统一换算成24小时制
		judgeOpen(openingHours) {
			try {
				const date = new Date()
				const startTime = openingHours.split('-')[0]
				const endTime = openingHours.split('-')[1]
				// 二十四小时制
				const now = date.toLocaleTimeString('chinese', { hour12: false })

				const nowTimes = now.split(':')
				const startTimes = startTime.split(':')
				const endTimes = endTime.split(':')

				const dqdq = date.setHours(nowTimes[0], nowTimes[1])
				const start = date.setHours(startTimes[0], startTimes[1])
				const end = date.setHours(endTimes[0], endTimes[1])

					if (startTimes[0] * 1 > endTimes[0] * 1) {
						// 说明是到第二天
						console.log('第二天')
						return !this.judgeOpen(endTime + '-' + startTime)
					}

				return start < dqdq && dqdq < end
			} catch (e) {
				return false
			}
		},
		// 点击tab
		handleTabClick(index) {
			this.activeTab = index
			switch (index) {
				// 推荐
				case 1:
					this.getRecommendData()
					break
				// 评价
				case 2:
					this.commentCur = 1
					this.commentData = []
					this.getCommentData()
					break
			}
		},
		// 获取推荐数据
		getRecommendData() {
			uni.showLoading({ title: '获取数据中' })
			uni.request({
				url: `https://www.aomue.cn/pro/rest/dbs/find/recommend/${this.detailInfo.id}`,
				method: 'GET',
				success: res => {
					console.log(res)
					const data = res.data.data
					uni.hideLoading()
				},
				fail: err => {
					console.log(err)
				}
			})
		},
		// 增加留言
		addComment() {
			console.log('增加留言')
			this.show = true
		},
		// 确认增加
		handleConfirm() {
			console.log(this.detailInfo)
			if (this.comment) {
				uni.request({
					url: 'https://www.aomue.cn/pro/rest/dbs/add/comment',
					data: {
						productId: this.detailInfo.id,
						comment: this.comment
					},
					method: 'POST',
					success: ({ data }) => {
						this.close()
						this.commentCur = 1
						this.commentData = []
						this.getCommentData()
						tis.comment = ''
					},
					fail: err => {
						console.log(err)
					}
				})
			} else {
				uni.showToast({
					icon: 'none',
					title: '评论未空'
				})
			}
		},
		// 打开地图
		navigatorToMap() {
			uni.navigateTo({
				url: '/pages/map/map',
				success: res => {
					res.eventChannel.emit('postMap', { detail: this.detailInfo })
				}
			})
		},
		// 获取评价数据
		getCommentData() {
			uni.showLoading({ title: '获取数据中' })
			uni.request({
				url: `https://www.aomue.cn/pro/rest/dbs/find/comment/${this.detailInfo.id}/${this.commentCur}/10`,
				method: 'GET',
				success: res => {
					const data = res.data.data
					console.log(res)
					this.commentData.push(...data.content)
					this.commentLast = data.last
					uni.hideLoading()
				},
				fail: err => {
					console.log(err)
				}
			})
		},
		// 获取下一页评价数据
		getLastComment() {
			if (this.activeTab === 2) {
				if (!this.commentLast) {
					this.commentCur++
					this.getCommentData()
				} else {
					uni.showToast({
						icon: 'none',
						title: '没更多数据啦'
					})
				}
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.detail {
	min-height: 100vh;
	font-size: $uni-font-size-base;
	background-color: white;

	.header {
		position: relative;

		.image-container {
			height: $uni-img-size-height-base;

			.image {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			width: 95%;
			position: absolute;
			bottom: 0;
			left: 50%;
			transform: translate(-50%, 50%);
			box-sizing: border-box;
			background-color: white;
			border-radius: 40rpx;
			padding: $uni-spacing-row-base 30rpx;
			z-index: 1111;
			font-size: $uni-font-size-base;

			.title {
				font-weight: bold;
				margin-bottom: $uni-spacing-row-base;
				text-align: center;
				border-bottom: #eee 1px solid;
				font-size: $uni-font-size-lg;
				padding: 15rpx 0 25rpx 0;
			}

			.open-time {
				display: flex;
				justify-content: center;
				font-weight: bold;
				border-bottom: #eee 1px solid;
				padding: 10rpx 0 10rpx 0;

				.open {
					color: #2fca32;
					margin-right: 10rpx;
				}

				.close {
					color: #ff7f24;
					margin-right: 10rpx;
				}
			}

			.adds {
				padding: 10rpx 0 10rpx 0;
				display: flex;
				align-items: center;

				.iconfont {
					margin-right: $uni-spacing-row-base;
					font-size: 40rpx;
				}

				.text {
					font-size: $uni-font-size-base;
					flex: 1;
					@include ellipsis();
				}
			}
		}
	}

	.box {
		height: 170rpx;
		background-color: #f4f4f4;
	}

	.container {
		.add {
			background-color: rgba(253, 195, 7, 0.6);
			position: fixed;
			right: 10px;
			text-align: center;
			border-radius: 50%;
			width: 100rpx;
			height: 100rpx;

			.iconfont {
				color: white;
				font-size: 60rpx;
				line-height: 100rpx;
				font-weight: bold;
			}
		}

		.tabs {
			display: flex;
			justify-content: space-around;
			padding: 0 40rpx;

			&-item {
				padding: 15rpx 20rpx 25rpx 20rpx;
			}

			.active {
				background-color: #fff;
				letter-spacing: 10rpx;
			}
		}

		// 简介
		.des {
			text-indent: 2rem;
			padding: 10rpx 25rpx;
		}

		// 推荐
		.recommend {
			background-color: white;

			&-item {
				display: flex;
				align-items: center;
				padding: 20rpx;
				height: 225rpx;
				margin-top: 20rpx;
				letter-spacing: $letter-spacing-base;
				background-color: #f4f4f4;

				.image {
					width: 200rpx;
					height: 200rpx;
					border-radius: 20rpx;
				}

				.right {
					width: calc(100% - 200rpx);
					padding-left: $uni-spacing-row-base;
					height: 100%;

					.title {
						color: #c50608;
						font-size: 40rpx;
					}

					&-item {
						display: flex;
						justify-content: space-between;
						margin-bottom: $uni-spacing-row-base;
					}

					.describe {
						margin-left: 5rpx;
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						word-wrap: break-word;
						white-space: normal !important;
						-webkit-line-clamp: 4;
						-webkit-box-orient: vertical;
					}
				}
			}
		}

		// 评价
		.commit {
			background-color: white;

			&-item {
				margin-top: 20rpx;
				background-color: #f4f4f4;
				padding: 20rpx 20rpx;

				.name {
				}

				.content {
					font-size: $uni-font-size-sm;
					margin-top: $uni-spacing-row-base;
					color: $uni-text-color-grey;
				}
			}
		}
	}
}
</style>
