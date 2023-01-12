<template>
	<view class="cot">逐梦感谢有您！运营开发团队真诚欢迎并且会认真对待您的一切意见和建议。</view>
	<textarea placeholder-style="color:#c5c5c5;" @input="textAreaInput" :value="content" cols="30" rows="10" placeholder="请输入您的意见和建议"></textarea>
	<view class="button" @click="submit()">保存</view>
</template>

<script>
	export default {
		data() {
			return {
				content:'',
			}
		},
		methods: {
			textAreaInput(e){
				this.content = e.detail.value
			},
			//提交
			submit: function(){
				if (!this.content) {
					uni.showToast({
						title: '请输入留言或建议',
						icon: 'none'
					})
				} else {
					this.$request({
						url: "/musiccourse/user/suggest.html",
						data:{
							content:this.content,
						},
						method:'POST',
					}).then((res)=>{
						if (res.data.code == 1000) {
							uni.showModal({
								title: '提示',
								content: '感谢留言',
								showCancel:false,
								success (res) {
									if (res.confirm) {
										uni.switchTab({
											url: '../user/user',
										})
									}
								}
							})
						} else {
							uni.showToast({
								title: res.data.msg,
								icon:'none'
							})
						}
					})
				}
			},
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage: function () {
			return {
				title: '',
				path: '',
				imageUrl:'', 
			}
		}
	}
</script>

<style>
	.cot{width:700rpx;height:auto;font-size:28rpx;color:#666;line-height:50rpx;padding:20rpx 25rpx;}
	textarea{width:648rpx;height:400rpx;border:2rpx solid #e7e7e7;padding:20rpx 25rpx;font-size:30rpx;color:#666;margin:0 auto;}
	.contact{width:700rpx;height:80rpx;border-bottom:2rpx solid #e7e7e7;padding:0 25rpx;color:#666;line-height: 80rpx;}
	.contact text{width:150rpx;height:auto;float:left;font-size:30rpx;}
	.contact input{width:550rpx;height:80rpx;float:left;line-height: 80rpx;font-size:30rpx;}
	.button{width: 400rpx;height: 80rpx;background: linear-gradient(119deg,#63d6e5 0%, #5cc2cf 100%);border-radius: 53rpx;margin:80rpx auto 0;text-align: center;line-height: 80rpx;color:#fff;}
</style>
