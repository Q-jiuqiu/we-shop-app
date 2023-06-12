<template>
	<div class="message">
		<CustomNav :showInput="false"></CustomNav>
		<u-textarea v-model="value" placeholder="请输入留言内容" :maxlength="-1"></u-textarea>
		<div class="buttons">
			<u-button class="button1" type="primary" :plain="true" text="镂空" @click="handleInputClear">取消</u-button>
			<u-button class="button2" type="primary" text="确定" :loading="btnLoading"
				@click="handleSaveMessage"></u-button>
		</div>
	</div>
</template>

<script>
	import CustomNav from '@/compnnents/customNav/customNav.vue'

	export default {
		name: 'MessageIndex',
		components: { CustomNav },
		data() {
			return {
				value: '',
				btnLoading: false
			}
		},
		methods: {
			// 清空输入框
			handleInputClear() {
				this.value = ''
			},
			// 保存留言
			handleSaveMessage() {
				if (this.value) {
					this.btnLoading = true
					uni.request({
						url: 'http://8.137.19.141/pro/rest/dbs/add/leave/word',
						method: 'POST',
						data: { leaveWord: this.value },
						success: res => {

							uni.showToast({
								icon: 'success',
								title: '留言成功'
							})

							this.handleInputClear()

						},
						fail: err => {
							console.log(err)
							this.$refs.uNotify.show({
								type: 'warning',
								message: '留言失败',
								duration: 1000,
								safeAreaInsetTop: true
							})
						},
						complete: () => {
							this.btnLoading = false
						}
					})
				}
				console.log(this.value)
			}
		}
	}
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

	::v-deep .u-status-bar {
		height: 0 !important;
	}
</style>