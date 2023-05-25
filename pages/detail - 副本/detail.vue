<template>
	<div class="detail">
		<div class="detail-content">
			<image class="image" :src="detail.image"></image>
			<div class="name">{{detail.name}}</div>
			<div class="tag">
				<u-tag :text="detail.city" icon="tags-fill" plain color="#909399"></u-tag>
				<u-tag :text="detail.region" icon="tags-fill" plain color="#909399"></u-tag>
			</div>
			<div class="address">
				<div class="ads">
					<u-icon name="map" color="#333" size="15"></u-icon>
					<span>{{detail.addr}}</span>
				</div>
				<view class="iconfont icon-dingwei locate" @click="handleShowMap"></view>
			</div>
			<div class="remark" v-if="detail.remark">
				<div class="title">说明</div>
				<div class="content">
					{{detail.remark}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { ref } from 'vue'

	export default {
		name: 'DetailPage',
		setup() {
			const detail = ref({})
			const eventChannel = ref(null)
			const longitude = ref(104.065681) // 经度
			const latitude = ref(30.653442) // 纬度

			return {
				detail,
				eventChannel,
				longitude,
				latitude,
			}
		},

		onLoad: function() {
			console.log('onload')
			const eventChannel = this.getOpenerEventChannel()
			this.eventChannel = eventChannel
			// 监听postMessage事件，获取上一页面通过eventChannel传送到当前页面的数据
			eventChannel.on('postMessage', ({ detail, latitude, longitude }) => {
				console.log(detail, latitude, longitude)
				this.detail = detail
				this.latitude = latitude
				this.longitude = longitude
				console.log(this)
			})
		},
		onUnload() {
			console.log(4444)
			this.eventChannel.off('postMessage')
		},
		methods: {
			handleShowMap() {
				// this.showMap = true
				uni.navigateTo({
					url: '/pages/map/map',
					success: res => {
						res.eventChannel.emit('postLocation', {
							from: {
								longitude: this.longitude,
								latitude: this.latitude
							},
							to: {
								longitude: this.detail.longitude,
								latitude: this.detail.latitude
							},
							info: {
								name: this.detail.name,
								address: this.detail.addr,
							}
						})
					}
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		height: 100%;
		background: #fcf9f0;
		position: relative;

		&-content {
			.image {
				width: 100%;
				height: 500rpx;
			}

			.name {
				margin: 20rpx 0 0 0;
				font-size: $uni-font-size-lg;
				background-color: #fff;
				padding: 10rpx;
			}

			.tag {
				background-color: #fff;
				padding: 10rpx 10rpx 20rpx 10rpx;

				::v-deep .u-transition {
					display: inline-block;
					min-width: 180rpx;
					margin-right: 10rpx;

					.u-tag--primary--plain {
						border-color: #767a82;

						.u-icon__icon--primary {
							color: #767a82;
						}
					}
				}
			}

			.address {
				margin: 10rpx 0;
				padding: 10rpx;
				background: #fff;
				min-height: 120rpx;
				font-size: $uni-font-size-base;
				display: flex;

				.ads {
					width: calc(100% - 80rpx);
					display: flex;

					::v-deep .u-icon--right {
						align-items: baseline;
					}
				}

				.locate {
					width: 80rpx;
					font-size: 70rpx;
					text-align: center;
					color: #f3950c;
				}
			}

			.remark {
				margin: 10rpx 0;
				padding: 10rpx;
				background-color: #fff;
				font-size: $uni-font-size-base;

				.title {
					color: $uni-text-color;
					padding: 5rpx 0;
				}

				.content {
					color: $uni-text-color-grey;
				}
			}
		}

		.map-container {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			.map {
				width: 100%;
			}
		}
	}
</style>