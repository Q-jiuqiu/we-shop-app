<template>
	<div class="message">
		<u-textarea v-model="value1" placeholder="请输入留言内容" :maxlength="-1"></u-textarea>
		<div class="buttons">
			<u-button class="button1" type="primary" :plain="true" text="镂空">取消</u-button>
			<u-button class="button2" type="primary" text="确定"></u-button>
		</div>
	</div>
</template>

<script>
</script>

<style lang="scss" scoped>
	.message {
		::v-deep .u-textarea__field {
			min-height: 750rpx;
		}

		.buttons {
			padding: 30rpx $uni-spacing-row-base;
			display: flex;

			.button1 {
				margin-right: 5rpx;
			}

			.button2 {
				margin-left: 5rpx;
			}
		}
	}
</style>