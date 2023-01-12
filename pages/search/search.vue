<template>
	<!-- 搜索 -->
	<view class="body">
		<view class="search">
			<input type="text" @input="searchInput" :value="keyword" placeholder="搜索您需要的课程" @confirm="searchBtn()"/>
			<image @click="searchBtn()" src="@/static/search-btn.png"></image>
		</view>
		<view class="hot">
			<view class="title">热门搜索</view>
			<div class="hotkey">
				<text @click="hotBtn('零基础')">零基础</text>
				<text @click="hotBtn('免费体验')">免费体验</text>
			</div>
		</view>
		<view class="box" v-if="list.length > 0">
			<view class="list" v-for="(item,index) in list" :key="index" @click="product(item.p_id)">
				<view class="leftimg">
					<image mode="widthFix" :src="item.p_thumb"></image>
				</view>
				<view class="content">
					<view class="biaoti">{{item.p_title}}</view>
					<view class="desc">{{item.p_desc}}</view>
					<view class="price">￥{{item.p_price}}</view>
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
				keyword:'',
				list:'',
				totalPage:'', //总页
				curPage:0, //当前页面
				dataAll:false, //数据是否加载完
				limit:10,
			}
		},
		onLoad(options) {
			this.keyword = options.keyword
			this.getListData();
		},
		methods: {
			searchInput: function(event) {
				this.keyword = event.target.value;
			},
			//搜索
			searchBtn: function(){
				this.curPage = 0;
				if (this.keyword == '') {
					uni.showToast({
						title: '请输入关键词',
						icon: 'none'
					})
					return;
				}
				this.getListData();
			},
			//热门搜索
			hotBtn:function(words){
				this.curPage = 0;
				this.keyword = words;
				this.getListData();
			},
			//搜索数据
			getListData:function(){
				uni.setNavigationBarTitle({
					title: '搜索 '+this.keyword + ' 的结果'
				})
				this.$request({
					url: "/musiccourse/index/search.html",
					data:{
						page:Number(this.curPage)+1,
						limit:10,
						keyword:this.keyword
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
			//课程or产品详情
			product(id){
				uni.navigateTo({
					url:'../productdetail/productdetail?id='+id,
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
	page{background: #F1F4F8;height:100%;}
	.body{width:700rpx;height:100%;background: url('https://files.thedream.tech/live/mini/images/page-head-bg.png') no-repeat top;background-size:100%;padding:25rpx 25rpx 0;}
	.search{width:700rpx;height:auto;color:#7a7a7a;position: relative;}
	.search input{width:580rpx;height:auto;background:#fff;border-radius: 30rpx;padding:10rpx 90rpx 10rpx 30rpx;font-size:28rpx;}
	.search image{width:50rpx;height:50rpx;position: absolute;right:10rpx;top:10rpx;}
	.hot{width:700rpx;height:auto;margin:30rpx auto;overflow: hidden;}
	.hot .title{font-size:32rpx;color:#fff;border-left:10rpx #FFB400 solid;padding-left:20rpx;font-weight: bold;margin-bottom:20rpx;}
	.hot .hotkey{width:100%;height:auto;overflow: hidden;}
	.hot text{padding:10rpx 20rpx;border-radius: 30rpx;text-align: center;line-height: 30rpx;color:#fff;background:#f00;float:left;display: block;margin-bottom:20rpx;font-size:26rpx;margin-right:20rpx;}
	.hotkey text:first-child{background:#f00;}
	.hotkey text:nth-child(2){background:#FFB400;}
	.list{width:calc(100% - 40rpx);height:auto;background:#fff;border-radius:15rpx;padding:20rpx;overflow: hidden;margin-bottom:20rpx;}
	.leftimg{width:280rpx;height:166rpx;float:left;}
	.leftimg image{width:280rpx;height:166rpx;border-radius:10rpx;}
	.content{width:360rpx;height:auto;float:left;padding:0 0 0 20rpx;}
	.content .biaoti{width:100%;height:76rpx;color:#353535;font-size:30rpx;font-weight: bold;padding-bottom:10rpx;overflow: hidden;}
	.content .desc{width:100%;height:36rpx;overflow: hidden;color:#999;line-height: 36rpx;font-size:24rpx;}
	.price{width:200rpx;height:auto;float:left;color:#f00;margin-top:10rpx;font-size:26rpx;}
	.buy{width: 150rpx;height: 36rpx;text-align: right;line-height: 36rpx;color:#009db1;font-size:24rpx;margin-top:10rpx;float:right;}
</style>
