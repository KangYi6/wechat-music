<template>
	<!-- 1.头部 -->
	<view class="head">
		<view class="location">
			<image mode="widthFix" src="@/static/location-icon.png"></image>
			<text>深圳</text>
		</view>
		<view class="search">
			<input type="text" @input="searchInput" :value="keyword" placeholder="搜索您需要的课程" placeholder-style="color:#ABABAB;font-size:28rpx;" @confirm="searchBtn()"/>
			<image @click="searchBtn()" src="@/static/search-btn.png"></image>
		</view>
	</view>
	<!-- 2.轮播图 -->
	<view class="banner">
		<swiper class="swiper" circular indicator-dots="true" autoplay="true" interval="2000" duration="500" indicator-active-color="#00C2DB">
			<swiper-item v-for="(item,index) in banner" :key="index">
				<image :src="item.b_image" mode="widthFix" ></image>
			</swiper-item>
		</swiper>
	</view>
	<view class="body">
		<!-- 3.新闻 -->
		<view class="news">
			<view class="left" @click="newsList();">最新动态</view>
			<view class="right">
				<view class="list" v-for="(item,index) in news" :key="index" @click="newsDetail(item.id)">
					<view class="title">{{item.title}}</view>
					<view class="date">{{item.addtime}}</view>
				</view>
			</view>
		</view>
		<view class="command" @click="productDetail(command.p_id)">
			<view class="catetitle">推荐课程</view>
			<view class="leftimg">
				<image :src="command.p_thumb" mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="biaoti">
					<view class="tubiao" v-if="command.p_type==1">直播</view>
					<view class="tubiao1" v-if="command.p_type==2">闯关</view>
					<view class="tubiao2" v-if="command.p_type==3">产品</view>
					<view class="tubiao3" v-if="command.p_type==4">视频</view>
					<view class="tubiao3" v-if="command.p_type==5">曲谱</view>
				{{command.p_title}}
				</view>
				<view class="desc">{{command.p_desc}}</view>
				<view class="star">
					<view class="font">推荐指数</view>
					<view class="s">
						<uni-rate :readonly="true" :touchable="false"  active-color="#ffc805" :value="4"/>	
					</view>
				</view>
				<view class="price" v-if="systemInfo!='ios'">￥{{command.p_price}}</view>
				<view class="buy">马上报名</view>
			</view>
		</view>
		<view class="course" v-for="(item,index) in course" :key="index">
			<view class="catetitle" @click="product(item.c_id)">
				{{item.c_name}}
				<view class="more">全部<image mode="widthFix" src="@/static/more.png"></image></view>
			</view>
			<view class="box">
				<view class="list" v-for="(vo,i) in item.list" :key="i" @click="productDetail(vo.p_id)">
					<image mode="widthFix" :src="vo.p_thumb"></image>
					<view class="title">{{vo.p_title}}</view>
					<view class="desc">{{vo.p_desc}}</view>
					<view class="price" v-show="systemInfo!='ios'">{{vo.p_price}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				banner:[], //banner
				command:[], //推荐课程
				course:[], //课程列表
				news:[], //新闻列表
				keyword:'', //搜索词
				systemInfo:app.globalData.os, //手机类型
			}
		},
		mounted() {
			this.getHomeData();
		},
		methods: {
			searchInput: function(event) {
				this.keyword = event.target.value;
			},
			//首页数据
			getHomeData(){
				this.$request({
					url: "/musiccourse/index/home.html",
					method: "POST",
				}).then((res)=>{
					if (res.data.code == 1000) {
						this.banner = res.data.data.banner
						this.command = res.data.data.command
						this.course = res.data.data.course
						this.news = res.data.data.news
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none',
						})
					}
				})
			},
			//新闻列表
			newsList(){
				uni.navigateTo({
					url:'/pages/news/news',
				})
			},
			//新闻详情
			newsDetail(id){
				uni.navigateTo({
					url:'../newsdetail/newsdetail?id='+id,
				})
			},
			//搜索
			searchBtn: function(){
				if (this.keyword == '') {
					uni.showToast({
						title: '请输入关键词',
						icon: 'none'
					})
					return;
				}
				uni.navigateTo({
					url:'../search/search?keyword='+this.keyword
				})
			},
			//产品分类
			product(id){
				if (!id) {
					uni.showToast({
						title:'请稍后',
						icon:'none'
					})
				}
				uni.navigateTo({
					url:'../product/product?id='+id
				})
			},
			//产品详情
			productDetail(id){
				uni.navigateTo({
					url:'../productdetail/productdetail?id='+id
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
page{background: #F1F4F8;}
.body{width:700rpx;height:auto;background-size:100%;padding:0 25rpx;}
.head{width:700rpx;overflow: hidden;padding:25rpx 25rpx;background:#00C2DB;}
.location{width:120rpx;height:auto;float:left;font-size:28rpx;color:#fff;}
.location image{width:25rpx;height:38rpx;position: relative;top:8rpx;padding-right:10rpx;}
.search{width:570rpx;height:auto;float:left;color:#7a7a7a;position: relative;}
.search input{width:450rpx;height:auto;background:#fff;border-radius: 30rpx;padding:10rpx 90rpx 10rpx 30rpx;font-size:28rpx;}
.search image{width:50rpx;height:50rpx;position: absolute;right:10rpx;top:10rpx;}
/* banner */
.banner{width:750rpx;height:384rpx;}
swiper{width:750rpx !important;height:384rpx !important;}
.banner image{width:750rpx;height:384rpx !important;}
/* 新闻 */
.news{width:670rpx;height:auto;overflow: hidden;margin:25rpx 0;padding:20rpx 20rpx 20rpx 10rpx;background: #fff;border-radius: 15rpx;margin:20rpx auto;}
.news .left{width:120rpx;height:auto;float:left;font-size:34rpx;color:#00C2DB;letter-spacing:10rpx;text-align: center;}
.news .right{width:550rpx;height:auto;float:left;font-size:26rpx;color:#555;}
.news .list{width:550rpx;height:auto;line-height: 45rpx;overflow: hidden;}
.news .title{width:450rpx;height:auto;float:left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
.news .date{width:100rpx;height:auto;float:left;color:#ACB0B7;font-size:26rpx;text-align: right;}
/* 推荐课程 */
.command{width:calc(100% - 40rpx);height:auto;background:#fff;border-radius:15rpx;padding:20rpx;overflow: hidden;}
.catetitle{width:calc(100% - 30rpx);height:60rpx;background:url('https://files.thedream.tech/live/mini/images/title-bg.png') no-repeat left;background-size:200rpx;font-size:34rpx;font-weight: bold;color:#353535;line-height: 60rpx;padding-left:30rpx;margin-bottom:20rpx;}
.leftimg{width:230rpx;height:266rpx;float:left;}
.leftimg image{width:230rpx;height:266rpx;border-radius:10rpx;}
.content{width:410rpx;height:auto;float:left;padding:0 0 0 20rpx;}
.content .biaoti{width:100%;height:80rpx;color:#353535;font-size:30rpx;font-weight: bold;margin-bottom:-7rpx;overflow: hidden;line-height: 40rpx;}
.content .biaoti .tubiao{width: 55rpx;height: 35rpx;background-color: #29c210;border-radius: 20rpx;display: inline-block;transform: translateY(-2rpx);font-size: 20rpx;text-align: center;line-height: 35rpx;color: #fff;}
.content .biaoti .tubiao1{width: 55rpx;height: 35rpx;background-color: #ba29f0;border-radius: 20rpx;display: inline-block;transform: translateY(-2rpx);font-size: 20rpx;text-align: center;line-height: 35rpx;color: #fff;}
.content .biaoti .tubiao2{width: 55rpx;height: 35rpx;background-color: #f7a900;border-radius: 20rpx;display: inline-block;transform: translateY(-2rpx);font-size: 20rpx;text-align: center;line-height: 35rpx;color: #fff;}
.content .biaoti .tubiao3{width: 55rpx;height: 35rpx;background-color: #e03e5b;border-radius: 20rpx;display: inline-block;transform: translateY(-2rpx);font-size: 20rpx;text-align: center;line-height: 35rpx;color: #fff;}
.content .desc{width:100%;height:80rpx;overflow: hidden;color:#999;line-height: 40rpx;font-size:26rpx;}
.price{width:200rpx;height:auto;float:left;color:#f00;margin-top:20rpx;}
.buy{width: 200rpx;height: 50rpx;text-align: center;line-height: 50rpx;color:#fff;font-size:26rpx;opacity: 0.57;background: linear-gradient(0deg,#009db1 0%, #00c2db 100%);border-radius: 26rpx;box-shadow: 6rpx 10.39rpx 14rpx 0rpx rgba(0,160,181,0.48);margin-top:20rpx;float:right;}
.content .star{width:100%;height:50rpx;	}
.content .star .font{color:#999;font-size:26rpx;float: left;margin:5rpx 7rpx 0 0;}
.content .star .s{float:left;}
/* 其它课程 */
.course{width:calc(100% - 40rpx);height:auto;background:#fff;border-radius:15rpx;padding:20rpx;overflow: hidden;margin:20rpx auto;}
.catetitle .more{width:100rpx;text-align:right;float:right;font-weight:normal;font-size:26rpx;color:#595959;display:block;}
.catetitle image{width:26rpx;height:26rpx;position: relative;top:3rpx;}
.box{width:100%;height:auto;overflow: hidden;}
.box .list{width:calc(50% - 10px);height:auto;float:left;margin-right:20rpx;margin-bottom:30rpx;}
.box .list:nth-child(2n){margin-right:0;}
.box .list image{width:320rpx;height:189rpx;border-radius:10rpx;}
.box .title{width:100%;height:40rpx;font-size:28rpx;color:#353535;line-height:40rpx;overflow: hidden;margin-bottom:10rpx;}
.box .desc{width:100%;height:36rpx;font-size:24rpx;line-height: 36rpx;color:#999;overflow: hidden;}
.box .price{margin-top:10rpx;}
</style>
