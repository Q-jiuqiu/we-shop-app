<template>
	<div class="select">
		<div class="show" @click.stop="handleSelectClick">
			<span>{{options[selectIndex].name}}</span>
			<span class="iconfont icon-xiangxia"></span>
		</div>
		<div class="select-container" v-show="showContainer">
			<div class="select-item" v-for="(item,index) in options" :key="index" @click="handleItemSelect(index)">
				{{item.name}}
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
			}
		},
		data() {
			return {
				selectIndex: 0,
				showContainer: false
			}
		},
		created() {
			console.log('options', this.options)
			uni.$on('handleSelectShow', this.cancelContainer)
		},
		beforeDestroy() {
			uni.$off('handleSelectShow', this.cancelContainer)
		},
		methods: {
			handleSelectClick() {
				this.showContainer = true
			},
			cancelContainer() {
				this.showContainer = false
			},
			handleItemSelect(index) {
				this.selectIndex = index
				this.$emit('select', index)
			}
		}
	}
</script>

<style scoped lang="scss">
	.select {
		position: relative;

		.show {
			.iconfont {
				margin-left: 10rpx;
				background: white;
				font-size: 20rpx;
			}
		}

		&-container {
			position: absolute;
			background: white;
			padding: 0rpx 20rpx;

			.select-item {
				white-space: nowrap;
				padding: 10rpx 0;
			}
		}
	}
</style>