<template>
	<!-- 作业详情 -->
	<view class="video">
	    <video 
	        id="video" 
	        :src="url" 
	        binderror="videoErrorCallback" 
	        show-center-play-btn='true' 
	        show-play-btn="false" 
	        controls 
	        :autoplay="autoplay"
	        direction="-90" 
	        picture-in-picture-mode="{{['push', 'pop']}}" 
	        enable-auto-rotation="true"
			show-fullscreen-btn="true"
			  v-if="videoshow">
	    </video>
		<view class="course" v-if="!videoshow">
			<view class="title">{{detail.info.h_title}}</view>
			<view class="futitle">作业内容</view>
			<view class="desc">{{detail.info.h_desc}}</view>
			<view>完成时间：{{detail.info.h_date}}</view>
		</view>
	</view>
	<view class="box">
	    <view class="list" @click="selectCourse(item.cw_content,item.cw_type,item.cw_name)" v-for="(item,index) in detail.data" :key="index">
	        <image mode="widthFix" src="../../static/video-icon-se.png" v-if="item.cw_type==1"></image>
			  <image src="../../static/note-icon.png" v-if="item.cw_type==2"></image>
	        <view class="name">{{item.cw_name}}</view>
	    </view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				login:false,
				id:'',
				detail:'',
				url:'',
				autoplay:false,
				videoshow:false,
			}
		},
		onLoad(options) {
			var that = this;
			this.id = options.id
			this.$request({
				url: '/musiccourse/homework/detail.html',
				data:{
					h_id:options.id,
				},
				method:'POST',
			}).then(res=>{
				if (res.data.code == 1000) {
					this.detail = res.data.data
					uni.setNavigationBarTitle({
						title: res.data.data.h_title
					})
				}
			})
		},
		methods: {
			//选择课件
			selectCourse(content,type,title){
				if (type == 1) { //视频
					this.url = content.video
					this.autoplay = true
					this.videoshow = true
				} else if (type == 2) { //曲谱
					uni.navigateTo({
						url:"/pages/musicxmldetail/musicxmldetail?title="+title+"&path="+content.xml
					})
				}
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
.video{width:750rpx;height:auto;}
.video video{width:100%;height:100%;}
#video{height:400rpx;}
.nav{width:750rpx;height:auto;overflow: hidden;padding-bottom:20rpx;}
.nav view{width:375rpx;height:80rpx;line-height: 80rpx;text-align: center;float:left;padding-bottom:3rpx solid #fff;color:#666;font-size:30rpx;box-shadow: 0px 5px 8.3px 0.85px rgba(0,0,0,0.05);}
.cur{width:100%;height:auto;background:#00c2db !important;color:#fff !important;}
.course{width:700rpx;height:auto;margin:0 25rpx;font-size:28rpx;color:#7a7a7a;line-height:60rpx;}
.course .title{font-size: 33rpx;color: #000;width: 690rpx;text-align: center;margin-top: 20rpx;font-weight: bold;}
.futitle{width:100%;height:30rpx;border-left:8rpx #FF4747 solid;font-size:30rpx;padding-left:10rpx;font-weight: bold;line-height: 30rpx;color:#000;margin:20rpx auto;}
.course .desc{width: 690rpx;height: auto;margin-top: 10rpx;}
.box{width:750rpx;height:auto;}
.list{width:700rpx;height:50rpx;line-height: 50rpx;border-bottom:1rpx #eee solid;padding:25rpx;font-size:28rpx;color:#555;overflow: hidden;}
.list:last-child{border-bottom:none;margin-bottom:50rpx;}
.list image{width:50rpx;height:50rpx;padding-right:10rpx;display:block;float:left;}
.list .name{width:520rpx;height:auto;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;float:left;}
.list .time{width:120rpx;height:auto;float:left;text-align: right;}
.selected{color:#00c2db;}
</style>
