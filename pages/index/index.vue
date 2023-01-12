<template>
	<view>
		<image src="@/static/startad.jpg" mode="widthFix"></image>
		<view class="title">{{title}}</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				title:'正在进入...',
				param:'',
				timer:null,
			}
		},
		onLoad(options) {
			//假如产品扫码跳转
			var path = decodeURIComponent(options.scene)
			var param = this.GetLocationParam(path)
			this.param = param
			
			//记录options值
			this.$request({
				url: "/musiccourse/server/test.html",
				data:param,
				method: "POST",
			}).then((res)=>{})
			
			
			this.lanuchCheck();
		},
		onShow(){
			if (getApp().globalData.launch) {
				uni.switchTab({
					url: '../home/home',
				})
				return;
			}
		},
		methods: {
			lanuchCheck(){
				var that = this
				if (getApp().globalData.launch) {
					if (this.param.d) { //假如登录扫码跳转
						getApp().globalData.param = this.param
						uni.switchTab({
							url:"../user/user"
						})
						return
					} else if (this.param.id) { //产品
						uni.navigateTo({
							url:"/pages/productdetail/productdetail?id="+this.param.id
						})
						return
					} else {
						uni.switchTab({
							url: '../home/home',
						})
						return;
					}
				} else {
					this.timer = setTimeout(() => {
						that.lanuchCheck();
					}, 1000);
				}
			},
			GetLocationParam: function(url) {
				var result = {};
				var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
				var arr = reg.exec(url);
				while (arr) {
					result[arr[2]] = arr[3];
					arr = reg.exec(url);
				}
				return result;
			},
		}
	}
</script>

<style>
	image{width:750rpx;}
	.title{position: absolute;top:20rpx;right:30rpx;color:#fff;}
</style>
