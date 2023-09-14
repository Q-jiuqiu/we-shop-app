<!--
 * @Author: 何元鹏
 * @Date: 2023-08-28 21:18:38
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-14 16:10:21
-->
<template>
	<div class="city-info">
		<CustomNavBack></CustomNavBack>
		<div class="image">
			<div class="image-container">
				<div class="image-list">
					<u-swiper :list="imageList" style="height: 100%;"></u-swiper>
				</div>
				<div class="describe">
					<div class="text" v-html="cityDes">
					 
					</div>
				</div>
			</div>
		</div>
		<div class="content"></div>
	</div>
</template>

<script>
	import CustomNavBack from '@/compnnents/customNavBack/customNavBack.vue'

	export default {
		name: 'cityInfo',
		components: { CustomNavBack },
		data() {
			return {
				imageList: [ 
				],
				cityDes: '',
			}
		},
		onLoad: function() {
			const eventChannel = this.getOpenerEventChannel()
			this.eventChannel = eventChannel
			eventChannel.on('cityInfo', ({ cityInfo }) => { 
				this.cityDes = cityInfo.cityDes
				this.imageList = cityInfo.imageList
			})
		}
	}
</script>

<style lang="scss" scoped>
	.city-info {
		background-color: white;

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
					letter-spacing: 3rpx;
					line-height: 55rpx;
					text-indent: 2rem;
					padding: 10rpx;
					white-space: pre-wrap;
				}
			}
		}
	}
</style>