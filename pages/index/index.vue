<template>
	<view class="content">
		<header class="seacher">
			<u-button type="primary" text="确定"></u-button>
		</header>
		<section class="map-content">
			<map class="map" :longitude="longitude" :latitude="latitude"></map>
		</section>
	</view>
</template>

<script setup>
	import { ref, onMounted } from 'vue'
	const longitude = ref(0)
	const latitude = ref(0)
	const value = ref('11')

	onMounted(() => {
		uni.getLocation({
			type: 'wgs84',
			success: res => {
				longitude.value = res.longitude
				latitude.value = res.latitude
			},
			fail: () => {},
			complete: () => {}
		})
	})
</script>

<style lang="scss">
	.content {
		height: 100%;
		width: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.seacher {
		height: 200rpx;
		// color: $uni-color-primary;
		width: 100%;
	}

	.map-content {
		height: calc(100% - 200rpx);
		width: 100%;

	}

	.map {
		width: 100%;
		height: 100%;
	}
</style>

<style lang="scss">
	page {
		height: 100%;
	}
</style>