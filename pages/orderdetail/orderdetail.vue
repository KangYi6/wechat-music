<template>
	<!-- 订单详情 -->
	<view class="order">
		<view class="list">产品名称：<text>{{detail.m_title}}</text></view>
		<view class="list">产品价格：<text>{{detail.m_price}}元</text></view>
		<view class="list">订单状态：<text>已支付</text></view>
		<view class="list">订单编号：<text>{{detail.m_orderid}}</text><text class="copy" @click="copybtn(detail.m_orderid)">复制</text></view>
		<view class="list">支付单号：<text>{{detail.m_transaction_id}}</text><text class="copy" @click="copybtn(detail.m_transaction_id)">复制</text></view>
		<view class="list">支付方式：<text>在线支付</text></view>
		<view class="list">下单时间：<text>{{detail.m_addtime}}</text></view>
		<view class="list">支付时间：<text>{{detail.m_updatetime}}</text></view>
	</view>
	<view class="contact" @click="contact()"><image mode="widthFix" src="@/static/qiyewechat-icon.png"></image>联系客服</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				id:'',
				detail:'',
				login:false,
			}
		},
		onLoad(options) {
			wx.setNavigationBarTitle({
				title: '订单详情'
			})
			if (app.globalData.login) {
				this.login = true
			} else {
				uni.navigateTo({
					url:'../user/user'
				})
			}
			if (options.id) {
				this.id = options.id
				this.getDetail()
			} else {
				uni.navigateTo({
					url:'../user/user'
				})
			}
		},
		methods: {
			getDetail(){
				this.$request({
					url: "/musiccourse/order/detail.html",
					data:{
						id:this.id
					},
					method: "POST",
				}).then((res)=>{
					uni.stopPullDownRefresh();
					if (res.data.code == 1000) {
						this.detail = res.data.data
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//复制
			copybtn: function(e){
				uni.setClipboardData({
					data: e,
					success (res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none'
						})
					}
				})
			},
			//联系客服
			contact(){
				uni.navigateTo({
					url:'../customer/customer?id='+this.id
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
	page{background: #f0f0f5;}
	.order{width:690rpx;height:auto;margin-bottom:10rpx;background:#fff;padding:30rpx;font-size:28rpx;color:#7a7a7a;}
	.contact{width:750rpx;height:auto;margin:10rpx auto;background:#fff;}
	.list{line-height: 60rpx;}
	.list text{color:#666;}
	.contact{width:750rpx;height:auto;text-align: center;font-size:30rpx;color:#333;line-height: 80rpx;}
	.contact image{width:40rpx;height:40rpx;padding-right:10rpx;position: relative;top:6rpx;}
	.copy{height:40rpx;line-height: 40rpx;padding:0 10rpx;border:1rpx #7a7a7a solid;border-radius:10rpx;text-align: center;font-size:24rpx;float:right;margin-top:8rpx;}
</style>
