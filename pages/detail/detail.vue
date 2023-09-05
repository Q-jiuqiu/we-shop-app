<template> 
	<div class="detail">
		<CustomNavBack></CustomNavBack>
		<header class="header">
			<div class="image-container">
				<img class="image" :src="detailInfo.image" />
			</div>
				<div class="info">
				<!-- 标题 -->
				<div class="title">
					<span class="name">{{ detailInfo.name }}</span>
					<div class="open" v-if="isSense">景区等级：{{ detailInfo.threeType }}</div>
				</div>
				<!-- 营业时间/风景等级 -->
				<div class="open-time info-item" v-if="detailInfo.workTime">
					<div :class="['open', { close: !isOpen }]">{{ isOpen ? '营业中：' : '歇业中：' }}	
						<span class="time">{{ detailInfo.workTime }}</span>
					</div> 
				</div>
				<!-- 位置 -->
				<div class="adds" @click="navigatorToMap">
					<span class="iconfont icon-dingwei1"></span>
					<span class="text">{{ detailInfo.addr }}</span>
					<span class="iconfont icon-initiate"></span>
				</div>
					<!-- 排队情况 -->
				<div class="info-item consume"> 
					<p>	
						<span class="label" v-if="isSense">预约：</span>
						<span class="label" v-else>排队情况：</span>
					  <span class="text">{{detailInfo.environment}}</span>
					</p>
					<p class="queue">
						<span class="label" v-if="isSense">拥挤指数：</span> 
						<span class="label" v-else>排队时长：</span>
						<span class="text">{{detailInfo.queue}}</span>
					</p>
					<p>	
						<span class="label" v-if="isSense">门票：</span> 
						<span class="label" v-else>人均：</span>
					  <span class="text">{{detailInfo.capitaConsumption}}¥</span>
					</p>
				</div>  
			</div>
		</header>
		<section class="container">
			<button :style="{ top: backTop }" v-show="activeTab === 3" id="add" class="add" ref="add" type="default"
				@click="addComment">我要评论</button>
			<!-- 使tabs滑动浮动在最顶部 -->
			<u-sticky ref="sticky" bgColor="#fff" :offset-top="stickyTop" bg-color="#f4f4f4">
				<!-- 风景 -->
				<div class="tabs" v-if="isSense">
					<div :class="['tabs-item', { active: activeTab === index }]" v-for="(item, index) in tabSenseList"
						:key="index" @click="handleTabClick(index)">
						{{ item }}
					</div>
				</div>
					<!-- 美食 -->
				<div class="tabs" v-else>
					<div :class="['tabs-item', { active: activeTab === index }]" v-for="(item, index) in tabList"
						:key="index" @click="handleTabClick(index)">
						{{ item }}
					</div>
				
				</div>
			</u-sticky>
			<!-- 简介 -->
			<div class="des tab-container" v-show="activeTab === 0" v-html="detailInfo.remark">
			</div>
			<!-- 推荐/购票 -->
			<div class="recommend tab-container" v-show="activeTab === 1">
				<!-- 风景-购票 -->
				<div class="table" v-if="isSense && faresData.length">
					<div class="table-header">
						<div class="tr">
							<div class="th">人群类型</div>
							<div class="th">具体条件</div>
							<div class="th">票价</div>
						</div>
					</div>
					<div class="table-body">
						<div class="tr" v-for="(item,index) in faresData" :key="index">
							<div class="td">{{item.adult}}</div>
							<div class="td">{{item.elder}}</div>
							<div class="td">{{item.child}}</div>
						</div>
					</div>
				</div>
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
				<div class="anchor-item" v-for="(item, index) in exploreShopData" :key="index">
					<div class="left">
						<img class="image"
							:src="item.headSculpture">
					</div>
					<div class="right">
						{{item.name}}
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
import CustomNavBack from '@/compnnents/customNavBack/customNavBack.vue'

export default {
	name: 'detailCom',
	components: { NoData, CustomNavBack },
	data() {
		return {
			tabList: ['简介', '推荐', '探店', '评价'],
			tabSenseList:['简介', '票价','探店','评价'],
			activeTab: 0,
			recommendData: [],
			commentData: [],
			isOpen: true,
			backTop: uni.getStorageSync('menuInfo').windowHeight,
			show: false,
			comment: '',
			commentCur: 1,
			commentLast: true, // 评价数据是否是最后一页
			detailInfo: {}, 
			exploreShopData:[],
			isSense:false,
			faresData:[]
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
		const eventChannel = this.getOpenerEventChannel()
		this.eventChannel = eventChannel
		eventChannel.on('detailPage', ({ detail }) => { 
			this.detailInfo = detail
			const type = this.detailInfo.type
				console.log(type);
			if(type === '风景'){
				this.isSense = true
			}else{
				this.isSense = false
			}
		})
	},

	created() {
		this.isOpen = this.judgeOpen(this.detailInfo.workTime)
	
	},

	watch: {
		activeTab(newVal) { 
			if (newVal === 3) {
				this.$nextTick(() => {
					setTimeout(() => { 
						const menuInfo = uni.getStorageSync('menuInfo')
						const windowHeight = parseInt(menuInfo.windowHeight)
						const query = uni.createSelectorQuery().in(this)
						query
							.select('#add')
							.boundingClientRect(rect => { 
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
			console.log(index);
			switch (index) {
				// 推荐
				case 1:
						if (this.isSense) {
							this.getFaresData()
						} else {
							this.getRecommendData()
						}

					break
				// 主播
				case 2: 
					this.getExploreShopData()
					break
				// 评价
				case 3:
					this.commentCur = 1
					this.commentData = []
					this.getCommentData()
					break
				
			}
		},
		// 获取票价数据
			getFaresData() {
				uni.showLoading({ title: '获取数据中' })
				uni.request({
					url: `https://www.aomue.cn/pro/rest/dbs/fares/find/${this.detailInfo.id}`,
					method: 'GET',
					success: res => {
						console.log(res.data);
						const data = res.data.data
						this.faresData = data
						uni.hideLoading()
					},
					fail: err => {
						console.log(err)
					}
				})
			},
		// 获取主播数据
		getExploreShopData() {
			uni.showLoading({ title: '获取数据中' })
			uni.request({
				url: `https://www.aomue.cn/pro/rest/dbs/exp/find//${this.detailInfo.id}`,
				method: 'GET',
				success: res => {
					const data = res.data.data
					this.exploreShopData = data
					uni.hideLoading()
				},
				fail: err => {
					console.log(err)
				}
			})
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
					display: flex;
					justify-content: space-between;
					margin-bottom: $uni-spacing-row-base; 
					border-bottom: #eee 1px solid; 
					padding: 15rpx 0 15rpx 0;
						.name{
							font-weight: bold;
							font-size: $uni-font-size-lg;
							color: #b50a0e; 
						} 
						.open{
							font-size: 24rpx;
    					padding-top: 10rpx;
						}
				}
				.open-time{
					border-bottom: #eee 1px solid;
				}
				&-item {
					display: flex;
				  justify-content: space-between;
					padding: 10rpx 0 10rpx 0;
				
					.open {
						color: #2fca32;
						margin-right: 10rpx;
						.time {
							color: #333;
						}
					} 
					.close { 
						margin-right: 10rpx;
					}
				} 
				.adds {
					padding: 10rpx 0 10rpx 0;
					display: flex;
					align-items: center;
					border-bottom: #eee 1px solid;
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
					padding: 15rpx 40rpx 25rpx;
				}

				.active {
					background-color: #fff;
					letter-spacing: 10rpx;
				}
			}

			.tab-container {
				background-color: white;
				padding: 10rpx 25rpx;
					.table {
					font-size: 15rpx;
					width: 98%;
					margin: 20rpx 1%;

					.tr {
						display: grid;
						grid-template-columns: 25% 55% 20%;
					}

					.th,
					.td {
						width: 100%;
						text-align: center;
						align-items: center;
						justify-content: center;
						height: 3rem;
					}

					.tr,
					.table {
						border: 1rpx solid #e9e9e9;
					}

					.th {
						border-top: 1rpx solid #e9e9e9;
						border-left: 1rpx solid #e9e9e9;
					}

					.td {
						border-left: 1rpx solid #e9e9e9;
					}

					.tr:last-child {
						border-top: none;
					}

					.th {
						display: flex; 
					}

					.td {
						padding: 10rpx 0;
						display: flex;
						justify-content: center;
					}

				}
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
					align-items: center;

					.image {
						width: 100rpx;
						height: 100rpx;
						border-radius: 50%;
					}

					.right {
						margin-left: 50rpx;
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