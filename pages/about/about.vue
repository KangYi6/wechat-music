<template>
	<web-view src="https://www.epiano.com.cn/about.html" />
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
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
	.about{width:700rpx;padding:25rpx;font-size:28rpx;color:#7a7a7a;line-height: 50rpx;}
</style>
