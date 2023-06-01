<template>
	<div class="detail">
		<img class="image" :src="detail.image" mode="widthFix">
		<div class="container detail">
			<div class="detail-item index">
				<div class="label">指数：</div>
				<u-rate :count="detail.value" v-model="detail.value" readonly></u-rate>
			</div>
			<div class="detail-item address">
				<div class="left">
					<div class="label">具体位置：</div>
					{{detail.addr}}
				</div>
				<div class="right" @click="navigatorToMap">
					<u-icon name="map-fill" color="#f3950c" size="19"></u-icon>
				</div>
			</div>
		</div>
		<div class="container content" v-if="detail.remark">
			{{detail.remark}}
		</div>
	</div>
</template>

<script>
	export default {
		name: 'DetailPage',
		data() {
			return { detail: {} }
		},
		onLoad: function() {
			console.log('onload')
			const eventChannel = this.getOpenerEventChannel()
			this.eventChannel = eventChannel
			eventChannel.on('foodDetail', ({ detail }) => {
				console.log(detail)
				this.detail = detail
				uni.setNavigationBarTitle({ title: detail.name })
			})
		},
		computed: {
			// getImage() {
			// 	if (this.detail && this.detail.image) {
			// 		return this.detail.image
			// 	}
			// 	return ''
			// }
		},
		methods: {
			// 跳转至map
			navigatorToMap() {
				uni.navigateTo({
					url: '/pages/map/map',
					success: res => {
						res.eventChannel.emit('postMap', { detail: this.detail })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail {
		height: 100%;
		background: $background;

		.image {
			width: 100%;
		}

		.container {
			@include defaultContainer();
			padding: $uni-spacing-row-base;
		}

		.detail {

			&-item {
				margin: $uni-spacing-row-base 0;
				display: flex;
				align-items: center;

				.label {
					display: inline-block;
					margin: $uni-spacing-row-base;
				}
			}

			.address {
				justify-content: space-between;
			}

		}

		.content {
			color: $uni-text-color-grey;
		}
	}
</style>