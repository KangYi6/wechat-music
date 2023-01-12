<template>
	<view class="body">
		<!-- 头部 -->
		<view class="head">
			<scroll-view scroll-x>
				<view class="tabbar">
					<!-- 导航栏列表 -->
					<text @click="chooseItem(0)" :class="current == 0 ? 'cur' : ''">全部</text>
					<text v-for="(item, index) in data" :key="item.c_id" @click="chooseItem(item.c_id)" :class="current == item.c_id ? 'cur' : ''">{{item.c_name}}</text>
				</view>
			</scroll-view>
		</view>
	    <view class="box" v-if="list.length > 0">
	        <view class="list" v-for="(item, index) in list" :key="item.p_id" @click="productDetail(item.p_id)">
				<view class="leftimg">
					<image mode="widthFix" :src="item.p_thumb"></image>
				</view>
				<view class="content">
					<view class="biaoti">{{item.p_title}}</view>
					<view class="desc">{{item.p_desc}}</view>
					<view class="price" v-show="systemInfo!='ios'">￥{{item.p_price}}</view>
					<view class="buy">查看详情</view>
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
				current: 0,
				data: [],
				list:[],
				systemInfo:app.globalData.os,  //手机类型
			}
		},
		onLoad(options) {
			this.current = options.id
			this.getListData()
		},
		methods:{
			getListData(){
				this.$request({
					url: "/musiccourse/index/product.html",
					data:{id:this.current},
					method: "POST",
				}).then((res)=>{
					uni.stopPullDownRefresh();
					if (res.data.code == 1000) {
						this.data = res.data.data.cate
						let list = this.list
						if (this.curPage == 0) {
							list = res.data.data.list.data
						} else {
							list = list.concat(res.data.data.list.data)
						}
						this.list = list
						this.totalPage = res.data.data.list.last_page
						this.curPage = res.data.data.list.current_page
						if (res.data.data.list.current_page >= res.data.data.list.last_page) {
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
			chooseItem(index){
				this.current = index
				this.curPage = 0
				this.getListData()
			},
			productDetail(id){
				uni.navigateTo({
					url: '../productdetail/productdetail?id='+id
				})
			},
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
	.head {width: 690rpx;height: 80rpx;background-color: #00c2db;border-radius: 0 0 100% 100%;}
	/* 导航栏 */
	.head .tabbar {display: flex;flex-direction: row;}
	.head .tabbar text{width:auto;height:auto;margin:0 20rpx;white-space: nowrap;padding-bottom: 10rpx;color:#fff;}
	.cur {font-size: 33rpx;border-bottom: 2rpx solid #fff;border-radius: 3rpx;}
	.list{width:calc(100% - 40rpx);height:auto;background:#fff;border-radius:15rpx;padding:20rpx;overflow: hidden;margin-bottom:20rpx;}
	.leftimg{width:280rpx;height:166rpx;float:left;}
	.leftimg image{width:280rpx;height:166rpx;border-radius:10rpx;}
	.content{width:360rpx;height:auto;float:left;padding:0 0 0 20rpx;}
	.content .biaoti{width:100%;max-height:80rpx;color:#353535;font-size:30rpx;font-weight: bold;padding-bottom:10rpx;overflow: hidden;}
	.content .desc{width:100%;height:32rpx;overflow: hidden;color:#999;line-height: 36rpx;font-size:24rpx;}
	.price{width:200rpx;height:auto;float:left;color:#f00;margin-top:10rpx;font-size:26rpx;}
	.buy{width: 150rpx;height: 36rpx;text-align: right;line-height: 36rpx;color:#009db1;font-size:24rpx;margin-top:10rpx;float:right;}
</style>