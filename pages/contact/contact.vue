<template>
	<view class="box" @click="saveImg()">
		<image mode="widthFix" show-menu-by-longpress="true" lazy-load="true" :src="image"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				image:'https://files.thedream.tech/live/mini/addteacher.jpg',
			}
		},
		onLoad() {
			//标题
			uni.setNavigationBarTitle({
				title: '添加老师微信'
			})
		},
		methods: {
			//保存图片到相册
			saveImg :function(){
				uni.getImageInfo({
					src: this.image,
					success (res) {
						var path = res.path;
						uni.saveImageToPhotosAlbum({
							filePath:path,
							success(res) { 
								uni.showToast({
									title: '保存成功！',
									icon: 'success',
								})
							},
							fail(error){
								uni.showToast({
									title: '保存失败！',
									icon: 'error',
								})
							}
						})
					}
				})
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
	page{background: #e63120;}
	.box{width:750rpx;height:auto;}
	.box image{width:100%;display:block;}
</style>
