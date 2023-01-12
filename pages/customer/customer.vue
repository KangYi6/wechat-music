<template>
	<view class="box" @click="saveImg">
	    <image mode="widthFix" show-menu-by-longpress="true" lazy-load="true" :src="image"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				image:'https://files.thedream.tech/live/mini/addteacher.jpg',
				recommenderId:'',//推荐人ID字符串
				id:'',//订单ID
			}
		},
		onLoad(options) {
			var that = this;
			if (options.id) {
			   this.recommenderId=options.id
			}
		  //标题
		  wx.setNavigationBarTitle({
			  title: '添加客服微信'  //修改title
		  })
		},
		onUnload() {
			uni.switchTab({
			            url:'../order/order',
			        })
		},
		onShareAppMessage() {
			return{
			      title: '轻松学钢琴 0基础速成班',
			      path: '/pages/home/home?scene='+app.globalData.userinfo.u_id,
			      imageUrl:'https://files.thedream.tech/live/mini/share.jpg', 
			}
		},
		methods: {
			//保存图片到相册
			saveImg :function(e){
			        var that = this;
			        wx.getImageInfo({
			            src: that.image,
			            success (res) {
			                var path = res.path;
			                wx.saveImageToPhotosAlbum({
			                    filePath:path,
			                    success(res) { 
			                        wx.showToast({
			                            title: '保存成功！',
			                            icon: 'success',
			                        })
			                    },
			                    fail(error){
			                        wx.showToast({
			                            title: '保存失败！',
			                            icon: 'none',
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
