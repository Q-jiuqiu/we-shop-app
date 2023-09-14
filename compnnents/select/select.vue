<template>
	<div class="select">
		<div class="mask" v-show="showMask" @click="cancelContainer"></div>
		<div class="show" @click.stop="handleSelectClick">
			<span>{{ options[selectIndex].name }}</span>
			<span class="iconfont icon-xiangxia"></span>
		</div>
		<div class="select-container" :style="{ height: height }">
			<div :class="['select-item', { active: index === selectIndex }]" v-for="(item, index) in options" :key="index" @click="handleItemSelect(index)">
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'selectPage',
	props: {
		options: {
			type: Array,
			default: () => []
		},
		selectName: {
			type: String,
			default: () => ''
		}
	},
	data() {
		return {
			selectIndex: 0,
			itemHeight: 0,
			height: 0,
			showMask: false
		}
	},
	created() { 
		const query = uni.createSelectorQuery().in(this)
		query
			.select('.select-item')
			.boundingClientRect(rect => { 
				this.itemHeight = rect.height
			})
			.exec()
	}, 
	methods: {
		handleSelectClick() { 
			this.$emit('fixedTo', { height: '100vh', overflow: 'hidden' })
			// 页面回到顶部
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 300
			})
			this.showMask = true
			const length = this.options.length > 8 ? 8 : this.options.length
			this.height = `${this.itemHeight * length}px`
		}, 
		cancelContainer() { 
			this.$emit('fixedTo', {})
			this.showMask = false
			this.height = '0px' 
		},
		handleItemSelect(index) {
			this.selectIndex = index
			this.$emit('select', index)
			this.cancelContainer()
		}
	}
}
</script>

<style scoped lang="scss">
.select {
	position: relative;

	.mask {
		background-color: rgba(0, 0, 0, 0.2);
		position: fixed;
		top: 0;
		left: 0;
		height: 100vh;
		width: 100vw;
		z-index: 1;
	}

	.show {
		.iconfont {
			margin-left: 10rpx;
			background: white;
		}
	}

	&-container {
		position: fixed;
		left: 0;
		background: white;
		width: 100vw;
		border-radius: 0 0 20rpx 20rpx;
		box-sizing: border-box;
		height: 0rpx;
		overflow: hidden;
		transition: height 0.5s ease-in-out;
		z-index: 2;
		overflow: auto;

		.select-item {
			white-space: nowrap;
			padding: 15rpx 20rpx;
		}

		.active {
			background-color: rgba(253, 195, 7, 0.2);
		}
	}
}
</style>