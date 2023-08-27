<template>
	<div class="detail">
		<header class="header">
			<div class="image-container">
				<img class="image" :src="detailInfo.image" />
			</div>
			<div class="info">
				<!-- 标题 -->
				<div class="title">{{ detailInfo.name }}</div>
				<!-- 营业时间/风景等级 -->
				<div class="open-time info-item" v-if="detailInfo.workTime">
					<div :class="['open', { close: !isOpen }]">{{ isOpen ? '营业中：' : '歇业中：' }}</div>
					<div class="time">{{ detailInfo.workTime }}</div>
					<div class="open" v-if="isSense">景区等级：</div>
					<div class="time" v-if="isSense">{{ detailInfo.threeType }}</div>
				</div>
				<!-- 人均消费 -->
				<div class="info-item consume">
					<span class="label">人均消费：</span>
					<span class="text">{{detailInfo.capitaConsumption}}￥</span>
				</div>
				<!-- 位置 -->
				<div class="adds" @click="navigatorToMap">
					<span class="iconfont icon-dingwei1"></span>
					<span class="text">{{ detailInfo.addr }}</span>
					<span class="iconfont icon-initiate"></span>
				</div>
			</div>
		</header>
		<section class="container">
			<button :style="{ top: backTop }" v-show="activeTab === 2" id="add" class="add" ref="add" type="default"
				@click="addComment">我要评论</button>
			<!-- 使tabs滑动浮动在最顶部 -->
			<u-sticky ref="sticky" bgColor="#fff" :offset-top="stickyTop" bg-color="#f4f4f4">
				<div class="tabs">
					<div :class="['tabs-item', { active: activeTab === index }]" v-for="(item, index) in tabList"
						:key="index" @click="handleTabClick(index)">
						{{ item }}
					</div>
				</div>
			</u-sticky>
			<!-- 简介 -->
			<div class="des tab-container" v-show="activeTab === 0" v-html="detailInfo.remark">
			</div>
			<!-- 推荐 -->
			<div class="recommend tab-container" v-show="activeTab === 1">
				<!-- 风景-推荐 -->
				<div v-if="isSense"> </div>
				<!-- 美食-推荐 -->
				<div v-else>
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
			</div>
			<!-- 主播 -->
			<div class="anchor tab-container" v-show="activeTab === 2">
				<div class="anchor-item">
					<div class="left">
						<img class="image"
							src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F19%2F20210719150601_4401e.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1695301334&t=55126573fcc46d59419be207d803f58e">
					</div>
					<div class="right">
						描述新消息
					</div>
				</div>
			</div>
			<!-- 评价 -->
			<div class="comment tab-container" v-show="activeTab === 3">
				<div class="comment-item" v-for="(item, index) in commentData" :key="index">
					<div class="content">
						<span class="content-span">{{ index + 1 }}、</span>
						{{ item.comment }}
					</div>
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
					<u-button type="warning" :plain="true" text="取消" @click="close"></u-button>
				</div>
				<div class="confirm">
					<u-button type="warning" text="确认" @click="handleConfirm"></u-button>
				</div>
			</div>
		</u-popup>
	</div>
</template>

<script>
	import NoData from '@/compnnents/noData/noData.vue'

	export default {
		name: 'detailCom',
		components: { NoData },
		props: {
			detailInfo: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				tabList: ['简介', '推荐', '主播', '评价'],
				activeTab: 0,
				recommendData: [],
				commentData: [],
				isOpen: true,
				backTop: uni.getStorageSync('menuInfo').windowHeight,
				show: false,
				comment: '',
				commentCur: 1,
				commentLast: true // 评价数据是否是最后一页
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
			},
			isSense() {
				return this.detailInfo.type === '风景'
			}
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
						const data = res.data.data
						this.recommendData = data
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
							this.comment = ''
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
		height: 100vh;

		.header {
			position: relative;

			.image-container {
				height: $uni-img-size-height-base;
				display: table;
				vertical-align: middle;
				margin: auto;
				width: 100%;
				background-color: white;

				.image {
					max-width: 100%;
					max-height: 100%;
					display: block;
					margin: auto;
					object-fit: contain;
				}
			}

			.info {
				width: 95%;
				margin: 5px auto 20rpx;
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

				&-item {
					display: flex;
					justify-content: center;
					font-weight: bold;
					border-bottom: #eee 1px solid;
					padding: 10rpx 0 10rpx 0;

					.open {
						color: #2fca32;
						margin-right: 10rpx;
					}

					.time {
						margin-right: 10rpx;
					}

					.close {
						color: #ff7f24;
						margin-right: 10rpx;
					}
				}

				.consume {
					font-weight: normal;
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

		.container {
			.add {
				background-color: rgba(253, 195, 7, 0.6);
				position: fixed;
				right: 10px;
				width: 140rpx;
				height: 50rpx;
				font-size: 20rpx;
				display: flex;
				justify-content: center;
				align-items: center;

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

			.tab-container {
				background-color: white;
				padding: 10rpx 25rpx;
			}

			// 简介
			.des {
				text-indent: 2rem;
				line-height: 50rpx;
				font-size: 30rpx;
				color: #333;
			}

			// 推荐
			.recommend {

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
							font-size: 30rpx;
							color: #b50a0e;
							font-weight: bold;
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

			// 主播
			.anchor {
				&-item {
					display: flex;
					padding: 10rpx;

					.image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}

					.right {
						margin-left: 10rpx;
					}
				}
			}

			// 评价
			.comment {
				&-item {
					padding: 20rpx 20rpx 0rpx;

					.content {
						font-size: $uni-font-size-sm;
						margin-top: $uni-spacing-row-base;

						.content-span {
							margin-right: 5rpx;
							font-size: 30rpx;
							color: #ff7f24;
						}
					}
				}
			}
		}

		.textarea {
			margin-top: 20rpx;
		}

		.buttons {
			padding: 30rpx $uni-spacing-row-base;
			display: flex;
			justify-content: space-around;

			.cancel {
				width: 200rpx;

				::v-deep .u-button--plain {
					color: #f9ae3d !important;
				}
			}

			.confirm {
				width: 200rpx;
			}
		}
	}
</style>