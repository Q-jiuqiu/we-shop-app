<template>
	<view class="content">
		<header class="seacher">
			<view class="locate">
				<u-icon name="map-fill" color="#f3950c" size="19"></u-icon>
				<view>{{locateCity}}</view>
			</view>
			<view class="input-content">
				<u-input placeholder="请输入内容" border="surround" clearable shape="circle"></u-input>
			</view>
		</header>
		<section class="map-content">
			<map class="map" :longitude="longitude" :latitude="latitude"></map>
			<view class="scroll">
				<u-scroll-list @right="right" @left="left" :indicatorWidth="0">
					<view class="scroll-list" style="flex-direction: row;">
						<view class="scroll-list__shops" v-for="(item, index) in list" :key="index"
							:class="[(index === 5) && 'scroll-list__shops--no-margin-right']">
							<view class="scroll-list__shops_item">
								<image class="scroll-list__shops_item__image" :src="item.thumb"></image>
								<view class="scroll-list__shops_item__des">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</u-scroll-list>
			</view>
		</section>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	const longitude = ref(0)
	const latitude = ref(0)
	const locateCity = ref('成都') // 当前城市名
	const list = ref(
		[{
			name: '门店1',
			thumb: 'https://cdn.uviewui.com/uview/goods/1.jpg'
		}, {
			name: '门店2',
			thumb: 'https://cdn.uviewui.com/uview/goods/2.jpg'
		}, {
			name: '门店3',
			thumb: 'https://cdn.uviewui.com/uview/goods/6.jpg'
		}, {
			name: '门店4',
			thumb: 'https://cdn.uviewui.com/uview/goods/5.jpg'
		}, {
			name: '门店5',
			thumb: 'https://cdn.uviewui.com/uview/goods/2.jpg'
		}])

	onMounted(() => {
		uni.getLocation({
			type: 'wgs84',
			success: res => {
				console.log(res)
				longitude.value = res.longitude
				latitude.value = res.latitude
			},
			fail: () => {},
			complete: () => {}
		})
	})

	const left = () => {
		console.log('left')
	}
	const right = () => {
		console.log('right')
	}
</script>

<style lang="scss" scoped>
	.content {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.seacher {
			height: 60rpx;
			padding: 10px 0;
			width: 100%;
			display: flex;
			align-items: center;

			.locate {
				display: flex;
				align-items: center;
				margin: 0 20rpx;
				font-size: $uni-font-size-sm;
				white-space: nowrap;
			}

			.input-content {
				flex: 1;
				margin-right: 30rpx;

				::v-deep .u-input {
					height: 30rpx;
				}
			}
		}

		.map-content {
			height: calc(100% - 80rpx);
			width: 100%;
			position: relative;

			.map {
				width: 100%;
				height: 100%;
			}

			.scroll {
				width: 100%;
				position: absolute;
				bottom: 10rpx;
				left: 0;
			}
		}
	}

	.scroll-list {
		@include flex(column);

		&__shops {
			margin-right: 20rpx;
			padding: 20rpx 0;
			width: 300rpx;
			height: 400rpx;

			&_item {
				background-color: $uni-bg-color;
				border-radius: 20rpx;
				box-shadow: 5rpx 5rpx 20rpx $uni-bg-color-mask ;
				height: 100%;

				&__image {
					height: 310rpx;
					width: 100%;
					border-radius: 20rpx 20rpx 0 0;
				}

				&__des {
					text-align: center;
					font-size: $uni-font-size-base;
					font-weight: bold;
					border-radius: 20rpx;
				}
			}
		}
	}
</style>

<style lang="scss">
	page {
		height: 100%;
	}
</style>