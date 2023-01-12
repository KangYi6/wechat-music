<template>
	<view class="body">
		<view class="box" v-if="list.length > 0">
			<view class="list" v-for="(item,index) in list" :key="index" @click="newsDetail(item.id)">
				<image mode="widthFix" :src="item.thumb"></image>
				<view class="title">{{item.title}}</view>
				<view class="more">
					<view class="date">{{item.addtime}}</view>
					<view class="detail">查看详情</view>
				</view>
			</view>
		</view>
		<view class="nocot" v-else>
			<image mode="widthFix" src="@/static/nocot.png"></image>
			<text>暂无内容</text>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				list:[],
				totalPage:'', //总页
				curPage:0, //当前页面
				dataAll:false, //数据是否加载完
				limit:10,
			}
		},
		onLoad(){
			uni.setNavigationBarTitle({
				title: '最新动态',
			})
			this.getListData()
		},
		methods: {
			getListData(){
				this.$request({
					url: "/musiccourse/index/news.html",
					data:{
						page:Number(this.curPage)+1,
						limit:10,
					},
					method: "POST",
				}).then((res)=>{
					uni.stopPullDownRefresh();
					if (res.data.code == 1000) {
						let list = this.list
						if (this.curPage == 0) {
							list = res.data.data.data
						} else {
							list = list.concat(res.data.data.data)
						}
						this.list = list
						this.totalPage = res.data.data.last_page
						this.curPage = res.data.data.current_page
						if (res.data.data.current_page >= res.data.data.last_page) {
							this.dataAll = true
						}
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//新闻详情
			newsDetail(id){
				uni.navigateTo({
					url:'/pages/newsdetail/newsdetail?id='+id,
				})
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			this.curPage = 0
			this.getListData();
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {
			if (this.curPage < this.totalPage) {
				this.getListData();
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
page{background: #F1F4F8;}
.body{width:700rpx;height:auto;background: url('https://files.thedream.tech/live/mini/images/page-head-bg.png') no-repeat top;background-size:100%;padding:25rpx 25rpx 0;}
.list{width:calc(100% - 40rpx);height:auto;background:#fff;border-radius:15rpx;padding:20rpx;overflow: hidden;margin-bottom:20rpx;}
.list image{width:660rpx;height:333rpx;}
.title{width:660rpx;height:auto;font-size:30rpx;color:#333;line-height: 40rpx;font-weight: bold;margin:10rpx auto;}
.more{width:660rpx;height:auto;overflow: hidden;}
.date{width:500rpx;height:50rpx;line-height: 50rpx;float:left;font-size:26rpx;color:#7a7a7a;}
.detail{width:150rpx;height:40rpx;line-height: 40rpx;float:left;text-align: right;font-size:26rpx;color:#fff;text-align: center;padding:5rpx;border-radius: 20rpx;background:#00c2db;}
</style>
