<template>
	<!-- 下单确认 -->
	<view class="shouhuoren">
		<view class="inputbox">
			<view class="name">收货人</view>
			<input type="text" placeholder="请填写收货人姓名" v-model="name"/>
		</view>
		<view class="inputbox">
			<view class="name">手机号</view>
			<input type="phone" placeholder="请填写收货人手机号" v-model="phone"/>
		</view>
		<view class="inputbox endcot">
			<view class="name">详细地址</view>
			<input type="text" placeholder="购买钢琴等硬件设备时填写" v-model="address"/>
		</view>
	</view>

	<view class="productinfo">
		<view class="leftimg">
			<image mode="aspectFit" :src="product.p_thumb"></image>
		</view>
		<view class="content">
			<view class="biaoti">{{product.p_title}}</view>
			<view class="price">￥{{product.p_price}}元</view>
		</view>
		<view class="inputbox mark">
			<view class="name">备注</view>
			<input type="text" placeholder="请输入留言" v-model="mark"/>
		</view>
	</view>
	<view class="order">
		<view class="total">￥{{product.p_price}}元</view>
		<view class="paybtn" @click="orderPay()">立即支付</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				id:'',
				product:'',
				name:'',
				phone:'',
				address:'',
				mark:'',
			}
		},
		onLoad(options) {
			this.id = options.id
			this.phone = app.globalData.userInfo.u_phone
			this.name = app.globalData.userInfo.u_nickname
			this.productDetail()
		},
		methods: {
			//产品详情
			productDetail(){
				this.$request({
					url: "/musiccourse/index/productDetail.html",
					data:{
						id:this.id,
					},
					method: "POST",
				}).then((res)=>{
					uni.stopPullDownRefresh();
					if (res.data.code == 1000) {
						this.product = res.data.data
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none'
						})
					}
				})
			},
			//选择所在地
			bindRegionChange: function (e) {
				this.region = e.detail.value
			},
			orderPay(){
				if (!this.name) {
					uni.showToast({
						title: '请填写收货人姓名',
						icon:'none',
					})
					return;
				}
				if (!this.phone) {
					uni.showToast({
						title: '请填写收货人手机号',
						icon:'none',
					})
					return;
				}
				uni.showToast({
					title: '下单中...',
					icon: 'loading',
					duration: 2000,
					mask: false
				})
				this.$request({
					url: "/musiccourse/order/createOrder.html",
					data:{
						id:this.id,
						name:this.name,
						phone:this.phone,
						address:this.address,
						mark:this.mark,
						openid:app.globalData.userInfo.openid,
					},
					method: "POST",
				}).then((o)=>{
					if(o.data.code==1000){
						uni.requestPayment({
							'timeStamp': o.data.data.timeStamp,
							'nonceStr': o.data.data.nonceStr,
							'package': o.data.data.package,
							'signType': o.data.data.signType,
							'paySign': o.data.data.paySign,
							'success': function (c) {
								if (c.errMsg == 'requestPayment:ok') {
									//跳转到支付成功，加班主任老师二维码页面
									uni.switchTab({
										url:"/pages/course/course"
									})
								} else {
									uni.showToast({ title: '支付失败', duration: 2000 }); return;
								}
							},
							'fail': function (res) {
								uni.showToast({ title: '取消支付', duration: 2000 }); return;
							}
						})
					}else{
						uni.showToast({
							title:o.data.msg,
							icon:"none"
						})
					}
				})
				// wx.request({
				// 	url: app.globalData.apiUrl+'/order/createOrder2.html',
				// 	data:{
				// 		id:that.data.id,
				// 		openid:that.data.userinfo.openid,
				// 		unionid:that.data.userinfo.s_unionid,
				// 		phone:that.data.userinfo.s_username,
				// 		nickname:that.data.userinfo.s_name,
				// 		headimg:that.data.userinfo.s_headimg,
				// 		name:that.data.name,
				// 		tel:that.data.phone,
				// 		region:that.data.region,
				// 		address:that.data.address,
				// 		mark:that.data.mark,
				// 	},
				// 	method:'POST',
				// 	success:function(o) {
				// 		console.log(0)
				// 		if (o.data.code == 1000) {
				// 			that.setData({
				// 				oid:o.data.data.id,
				// 				uid:o.data.data.uid,
				// 			})
				// 			wx.showToast({
				// 				title: '下单中...',
				// 				icon: 'loading',
				// 				duration: 2000,
				// 				mask: false
				// 			})
				// 			//重新缓存用户信息
				// 			if (!that.data.userinfo) {
				// 				var wxdata = wx.getStorageSync('wxdata');
				// 				o.data.data.session_key = wxdata.session_key;
				// 				o.data.data.unionid = wxdata.unionid;
				// 				o.data.data.openid = wxdata.openid;
				// 				wx.setStorageSync('userinfo',o.data.data);
				// 			}
				// 			wx.requestPayment({
				// 				'timeStamp': o.data.data.payinfo.timeStamp,
				// 				'nonceStr': o.data.data.payinfo.nonceStr,
				// 				'package': o.data.data.payinfo.package,
				// 				'signType': o.data.data.payinfo.signType,
				// 				'paySign': o.data.data.payinfo.paySign,
				// 				'success': function (c) {
				// 					if (c.errMsg == 'requestPayment:ok') {
				// 						//跳转到支付成功，加班主任老师二维码页面
				// 						wx.redirectTo({
				// 							url: '../teacher/teacher?oid='+that.data.oid+'&scene='+that.data.uid,
				// 						})
				// 					} else {
				// 						wx.showToast({ title: '支付失败', duration: 2000 }); return;
				// 					}
				// 				},
				// 				'fail': function (res) {
				// 					wx.showToast({ title: res.err_desc, duration: 2000 }); return;
				// 				}
				// 			});
				// 		} else {
				// 			wx.showToast({
				// 				title: o.data.msg,
				// 				icon: 'none',
				// 			})
				// 		}
				// 	}
				// })
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
	page{background:#F0F0F5;}
	.shouhuoren{width:700rpx;height:auto;padding:30rpx 25rpx 0;background:#fff;overflow: hidden;}
	.inputbox{width:100%;height:auto;overflow: hidden;border-bottom:1rpx #eee solid;padding:25rpx 0;display:inline-block;}
	.inputbox .name{width:150rpx;height:auto;float:left;}
	.inputbox input{width:550rpx;height:auto;float:left;text-align: right;}
	.endcot{border-bottom:none;}
	.productinfo{width:100%;height:auto;background:#fff;margin-top:20rpx;padding:40rpx 25rpx 20rpx;}
	.leftimg{width:280rpx;height:166rpx;float:left;}
	.leftimg image{width:280rpx;height:166rpx;border-radius:10rpx;}
	.content{width:360rpx;height:auto;float:left;padding:0 0 0 20rpx;}
	.content .biaoti{width:100%;height:72rpx;color:#353535;font-size:30rpx;font-weight: bold;padding-bottom:10rpx;overflow: hidden;margin-bottom:30rpx;}
	.price{width:200rpx;height:auto;float:left;color:#f00;margin-top:10rpx;font-size:26rpx;}
	.numb{width: 150rpx;height: 36rpx;text-align: right;line-height: 36rpx;color:#009db1;font-size:24rpx;margin-top:10rpx;float:right;}
	.mark{border-bottom:none;margin:30rpx auto 0;}
	.order{width:700rpx;height:100rpx;line-height:100rpx;background: #fff;position: fixed;bottom:0;left:0;padding:10rpx 25rpx;font-weight: bold;font-size:34rpx;}
	.total{color:#f00;float:left;}
	.paybtn{width:280rpx !important;height:auto;font-size:30rpx;color:#fff;line-height: 70rpx;cursor:pointer;text-align: center;background: linear-gradient(0deg,#f00 0%, #e91e63 100%);border-radius: 50rpx;box-shadow: 6rpx 10.39rpx 14rpx 0rpx hsla(2, 82%, 62%, 0.48);float:right;margin-top:15rpx;}
</style>
