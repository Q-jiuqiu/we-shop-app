<!--
 * @Author: 何元鹏
 * @Date: 2023-08-28 21:18:38
 * @LastEditors: 何元鹏
 * @LastEditTime: 2023-09-14 16:18:39
-->
<template>
	<div class="message">
		<CustomNav :showInput="false"></CustomNav>
		<div class="message-text">
			<pre style="">&nbsp;&nbsp;&nbsp;&nbsp; 我们热衷于给广大热爱旅游的朋友提供便利，可能有BUG或者内容错误的情况，希望大家能够帮助我们指出和改正；</pre>
			<pre style="">&nbsp;&nbsp;&nbsp;&nbsp; 如果您的家乡还有什么美食和景点我们没有收录，也请您给我们留言，以便我们补充完整。</pre> 
			<pre style="">&nbsp;&nbsp;&nbsp;&nbsp; 感谢您的理解与支持！</pre>
		</div>
		<u-textarea v-model="value" placeholder="请输入留言内容" :maxlength="-1"></u-textarea>
		<div class="buttons">
			<div class="cancel button">
				<u-button type="warning" :plain="true" text="取消" @click="handleInputClear"></u-button>
			</div>
			<div class="confirm button">
				<u-button type="warning" text="确定" :loading="btnLoading" @click="handleSaveMessage"></u-button>
			</div>
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
						url: 'https://www.aomue.cn/pro/rest/dbs/add/leave/word',
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message {
			background: #eee;
			position: relative;
			min-height: 100vh;
			width: 100%;
			height: 100%;
		::v-deep .u-textarea__field {
			min-height: 750rpx;
		}
		&-text{
			background: #eee;
    	padding: 20rpx 10rpx;
			letter-spacing:3px;
		}
		.buttons {
			background: #eee;
			padding: 30rpx $uni-spacing-row-base;
			display: flex;
			justify-content: space-around;

			.cancel {
				width: 200rpx;

				::v-deep .u-button--plain {
					color: #f9ae3d;
				}
			}

			.confirm {
				width: 200rpx;
			}
		}
	}

	::v-deep .u-status-bar {
		height: 0 !important;
	}
</style>