<template>
	<web-view v-show="xmlshow" @load="loadSuccessHandler" @error="loadFailHandler" :src="webviewPath"></web-view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				xmlshow:false,
				webviewPath:'',
				path:'',
				title:'',
				defaultFifths:'',
				curFifths:'',
				scaleAll:'',
			}
		},
		onLoad(options) {
			if (!options.title) {
				uni.switchTab({
					url:'../aimusicxml/aimusicxml'
				})
				return
			}
			if (!options.path) {
				uni.switchTab({
					url:'../aimusicxml/aimusicxml'
				})
				return
			}
			//显示webview页面
			this.path = options.path
			this.title = options.title
			this.webviewPath = app.globalData.webviewPath+'?url='+this.path+'&title='+this.title
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

</style>
