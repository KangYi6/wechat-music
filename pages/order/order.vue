<template>
	<!-- 我的订单 -->
	<view class="nav">
		<view :class="status == '' ? 'cur' : ''" @click="tab('')">全部</view>
		<view :class="status == 2 ? 'cur' : ''" @click="tab(2)">待支付</view>
		<view :class="status == 1 ? 'cur' : ''" @click="tab(1)">已支付</view>
	</view>
	<view class="box">
		<view class="cot" v-if="list.length > 0">
			<view class="list" v-for="(item,index) in list" :key="index" @click="item.m_status == 1 ? toDetail(item.m_id,item.m_status) : rePay(item.m_id,item.m_status)">
				<view class="order">
					<text class="orderid">订单号：{{item.m_orderid}}</text>
					<text class="status payed" v-if="item.m_status == 1">已付款</text>
					<text class="status wait" v-else-if="item.m_status == 2">待付款</text>
					<text class="status lost" v-else>已失效</text>
				</view>
				<view class="title">{{item.m_title}}</view>
				<view class="info">
					<view class="time">
						<image mode="widthFix" src="@/static/time-icon.png"></image>
						<text>{{item.m_addtime}}</text>
					</view>
					<view class="price">
						<image mode="widthFix" src="@/static/money-icon.png"></image>
						<text>{{item.m_price}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="nocot" v-else>
			<image mode="widthFix" src="@/static/nocot.png"></image>
			<text>暂无内容</text>
		</view>
		<!-- 登录按钮 -->
		<navigator url="../user/user" open-type="switchTab">
			<button class="nologin" v-if="!login"><image mode="widthFix" src="@/static/user-icon.png"></image>请登录</button>
		</navigator>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				list:'',
				login:false,
				total:'',
				status:'',
				totalPage:'', //总页
				curPage:0, //当前页面
				dataAll:false, //数据是否加载完
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '我的订单'
			})
			if (app.globalData.login) {
				this.login = true
				this.getListData();
			}
		},
		methods: {
			//TAB切换
			tab: function (status){
				this.status = status
				this.curPage = 0
				this.getListData();
			},
			//获取列表数据
			getListData: function() {
				this.$request({
					url: "/musiccourse/order/list.html",
					data:{
						status:this.status,
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
			//重新发起支付
			rePay: function(id,status) {
				if (status == 0) {
					return;
				}
				let that=this
				console.log(this.list);
				this.$request({
					url: '/musiccourse/order/payOrder.html',
					data:{
						openid:app.globalData.userInfo.openid,
						id:id,
						uid:app.globalData.userInfo.u_id,
					},
					method:'POST',
					}).then(o=>{
						if (o.data.code == 1000) {
							console.log(o.data.data);
							wx.showToast({
								title: '请稍等...',
								icon: 'loading',
								duration: 2000,
								mask: false
							})
							try {
								wx.requestPayment({
									'timeStamp': o.data.data.timeStamp,
									'nonceStr': o.data.data.nonceStr,
									'package': o.data.data.package,
									'signType': o.data.data.signType,
									'paySign': o.data.data.paySign,
									'success': function (c) {
										if (c.errMsg == 'requestPayment:ok') {
											//跳转到支付成功，加班主任老师二维码页面
											// wx.navigateTo({
											// 	url: '../teacher/teacher?oid='+that.data.id+'&scene='+that.data.uid,
											// })
											//成功跳转到我的课程
											uni.switchTab({
												url:"/pages/course/course"
											})
										} else {
											wx.showToast({ title: '支付失败', duration: 2000,icon:'none' }); return;
										}
									},
									'fail': function (res) {
										wx.showToast({ title: '取消支付', duration: 2000,icon:'none' }); return;
									}
								});
							} catch (error) {
								wx.showToast({ title: '支付失败', duration: 2000,icon:'none' }); return;
							}
						} else {
							wx.showToast({
								title: o.data.msg,
								icon:'none'
							})
						}
				})
			},
			//查看详情
			toDetail: function (id,status){
				uni.navigateTo({
					url: '../orderdetail/orderdetail?id='+id,
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
	page{background: #f0f0f5;}
	.nav{width:750rpx;height:auto;background: #fff;overflow: hidden;font-size:30rpx;}
	.nav view{width:250rpx;height:80rpx;line-height: 80rpx;text-align: center;float:left;padding-bottom:5rpx solid #fff;color:#666;font-size:30rpx;}
	.cur{width:100%;height:auto;border-bottom:5rpx #00c2db solid;color:#00c2db;}
	.box{width:750rpx;height:auto;}
	.list{width:690rpx;height:auto;background:#fff;padding:30rpx;margin:10rpx auto;}
	.order{width:690rpx;height:auto;color:#7a7a7a;font-size:25rpx;overflow: hidden;}
	.orderid{width:445rpx;height:auto;float:left;}
	.status{width:auto;height:auto;float:right;text-align: right;}
	.title{width:690rpx;height:auto;font-size:30rpx;color:#333;font-weight: bold;padding:20rpx 0;}
	.info{width:690rpx;height:auto;overflow: hidden;}
	.time{width:345rpx;height:auto;float:left;font-size:25rpx;}
	.time image{width:25rpx;height:25rpx;color:#7a7a7a;position: relative;top:5rpx;padding-right:5rpx;}
	.price{width:345rpx;height:auto;float:left;font-size:25rpx;text-align: right;}
	.price image{width:25rpx;height:25rpx;color:#7a7a7a;position: relative;top:5rpx;padding-right:5rpx;}
	.wait{color:#fff;background: #FF0000;border-radius:20rpx;padding:5rpx 10rpx;}
	.payed{color:#00c2db;}
	.lost{color:#fff;background:#eee;border-radius:20rpx;padding:5rpx 10rpx;}
</style>
