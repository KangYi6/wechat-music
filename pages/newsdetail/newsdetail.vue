<template>
	<view class="body">
		<view class="title">{{detail.title}}</view>
		<view class="date">{{detail.addtime}}</view>
		<rich-text :nodes="detail.content" class="content"></rich-text>
	</view>
</template>

<script>
	//公共函数库
	import {formatContent} from '@/lib/util.js';
	export default {
		data() {
			return {
				id:'',
				detail:'',
			}
		},
		onLoad(options) {
			this.id = options.id
			this.newDetail()
		},
		methods: {
			newDetail(){
				this.$request({
					url: this.$baseUrl + "/musiccourse/index/newsdetail.html",
					data:{id:this.id},
					method: "POST",
				}).then((res)=>{
					if (res.data.code == 1000) {
						this.detail = res.data.data
						this.detail.content = formatContent(res.data.data.content)
						uni.setNavigationBarTitle({
							title: res.data.data.title,
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							success: function (res) {
								uni.navigateBack()
							}
						});
					}
					
				})
			}
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
.body{width:700rpx;height:auto;margin:25rpx;}
.title{width:100%;height:auto;font-size:38rpx;font-weight: bold;color:#333;text-align: center;margin:20rpx auto;line-height: 55rpx;}
.date{width:100%;height:auto;font-size:28rpx;color:#7a7a7a;text-align: center;}
.content{width:700rpx;}
.content image{width:100%;margin:20rpx  auto;}
.content img{max-width:100% !important;height:auto !important;}
</style>
