<template>
	<!-- 用户中心 -->
	<view class="body">
		<view class="head">
			<view class="headimg">
				<image :src="login ? userInfo.u_headimg : '../../static/headimg.png'"></image>
			</view>
			<view class="nickname" v-if="login">{{userInfo.u_nickname}}</view>
			<button v-else class="nickname button" @tap="getUserProfile" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">点击登录/注册</button>
		</view> 
		<view class="box">

			<view class="list" @click="scanQrcode()">
				<image class="icon" mode="widthFix" src="@/static/scan-icon.png"></image>
				<text>扫一扫</text>
				<image class="more" mode="widthFix" src="@/static/right-icon.png"></image>
			</view>
			<view class="list" @click="orderbtn()">
				<image class="icon" mode="widthFix" src="@/static/order-icon.png"></image>
				<text>我的订单</text>
				<image class="more" mode="widthFix" src="@/static/right-icon.png"></image>
			</view>
			<view class="list" @click="personal()">
				<image class="icon" mode="widthFix" src="@/static/account-icon.png"></image>
				<text>资料修改</text>
				<image class="more" mode="widthFix" src="@/static/right-icon.png"></image>
			</view>
			<view class="list" @click="question()">
				<image class="icon" mode="widthFix" src="@/static/ceyan-icon.png"></image>
				<text>你最适合什么乐器？</text>
				<image class="more" mode="widthFix" src="@/static/right-icon.png"></image>
			</view>
			<view class="list" @click="suggest()">
				<image class="icon" mode="widthFix" src="@/static/suggest-icon.png"></image>
				<text>改进意见</text>
				<image class="more" mode="widthFix" src="@/static/right-icon.png"></image>
			</view>
			<view class="list" @click="about()">
				<image class="icon" mode="widthFix" src="@/static/about-icon.png"></image>
				<text>关于逐梦音乐</text>
				<image class="more" mode="widthFix" src="@/static/right-icon.png"></image>
			</view>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				userInfo:'',
				login:false,
				getUser:false,
				getPhone:false,
				nickname:'',
				headimg:'',
				sex:'',
				phone:'',
				recommander:'',
				timestamp:'', //扫码登录时间戳
				device:'', //设备MAC地址
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({
				title: '个人中心'
			})
			var recommender = uni.getStorageSync('recommender')
			//如查lanuch
			if (!app.globalData.launch) {
				setTimeout(function() {
					
				}, 1000);
			}
			this.login = app.globalData.login
			this.userInfo = app.globalData.userInfo
			this.recommender = recommender
			//如有扫码登录传值过来
			if (getApp().globalData.param) {
				if (getApp().globalData.login) {
					//授权登录
					this.loginAuth(getApp().globalData.param)
					//清空
					getApp().globalData.param = ''
				} else {
					uni.showToast({
						title:"请先登录",
						icon:"error"
					})
				}
			}
		},
		methods: {
			//获取头像，昵称
			getUserProfile(e) {
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				uni.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						this.nickname = res.userInfo.nickName
						this.headimg = res.userInfo.avatarUrl
						this.sex = res.userInfo.gender
						this.getUser = true
						if (this.getPhone && this.getUser) {
							this.wxLogin()
						}
					},
					fail: (err) => {
						console.log(err);
					}
				})
			},
			//获取手机号
			getPhoneNumber (e) {
				//如果用户拒绝
				if (e.detail.errMsg != 'getPhoneNumber:ok') {
					return;
				}
				let wxdata = uni.getStorageSync('wxdata')
				this.unionid = wxdata.unionid
				this.openid = wxdata.openid
				this.session_key = wxdata.session_key
				this.$request({
					url: "/musiccourse/login/getPhone.html",
					data:{
						encryptedData:e.detail.encryptedData,
						iv: e.detail.iv,
						session_key: this.session_key,
						openid: this.openid,
						code:e.detail.code,
					},
					method: "POST",
				}).then((res)=>{
					if (res.data.code == 1000) {
						this.phone = res.data.data
						this.unionid = wxdata.unionid
						this.getPhone = true
						if (this.getPhone && this.getUser) {
							this.wxLogin();
						}
					} else {
						uni.showToast({
							title: '获取手机号失败，请重试!',
							icon:'none'
						})
					}
				})
			},
			//登录
			wxLogin(){
				let wxdata = uni.getStorageSync('wxdata')
				this.$request({
					url: "/musiccourse/login/Register.html",
					data: {
						nickname:this.nickname,
						headimg:this.headimg,
						sex:this.sex,
						phone:this.phone,
						unionid:this.unionid,
						recommander:this.recommander,
						session_key:this.session_key,
						unionid:this.unionid,
						openid:this.openid,
					},
					method: "POST",
				}).then((e)=>{
					if (e.data.code == 1000) {
						uni.setStorageSync('userInfo',e.data.data)
						app.globalData.userInfo = e.data.data
						app.globalData.login = true
						this.login = true
						this.userInfo = e.data.data
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none',
						})
					}
				})
			},
			//建议
			suggest: function(){
				if (this.login) {
					uni.navigateTo({
						url: '../suggest/suggest',
					})
				} else {
					uni.showToast({
						title: '请登录',
						icon: 'none'
					})
				}
			},
			//关于我们
			about(){
				uni.navigateTo({
					url: '../about/about',
				})
			},
			//修改资料
			personal: function(){
				if (this.login) {
					uni.navigateTo({
						url: '../personal/personal',
					})
				} else {
					uni.showToast({
						title: '请登录',
						icon: 'none'
					})
				}
			},
			//测验
			question: function(){
				uni.navigateTo({
					url: '../question/question',
				})
			},
			//我的订单
			orderbtn: function(){
				uni.navigateTo({
					url: '../order/order',  
				})
			},
			//扫码登录
			scanQrcode:function(){
				let that = this
				if (!this.userInfo) {
					uni.showToast({
						title: '请先登录',
						icon:'none',
					})
					return;
				}
				uni.scanCode({
					success:function(res){
						var path = res.path;
						var pathurl = decodeURIComponent(path)
						var param = that.GetLocationParam(pathurl);
						that.loginAuth(param);
					}  
				})
			},
			GetLocationParam: function(url) {
				var result = {};
				var reg = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
				var arr = reg.exec(url);
				while (arr) {
					result[arr[2]] = arr[3];
					arr = reg.exec(url);
				}
				return result;
			},

			//登录授权
			loginAuth:function(param){
				let that = this
				if(param.id){
					uni.navigateTo({
						url:"/pages/productdetail/productdetail?id="+param.id
					})
					return
				}
				uni.showModal({
					title: "扫码登录",
					content: "是否同意授权在设备"+param.d+"上登录？",
					success (res) {
						if (res.confirm) {
							that.$request({
								url:that.$baseUrl+"/musiccourse/user/scanLogin.html",
								method:'POST',
								data:{
									mac: param.d,
									time: param.t ? param.t : '',
									unionid:app.globalData.userInfo.unionid,
									phone:that.phone
								}
							}).then(res=>{
								console.log(res);
								if (res.data.code == 1000) {
										uni.showToast({
											title: '授权成功',
											icon:'none',
										})
									} else {
										uni.showModal({
											title: '提示',
											showCancel:false,
											content: res.data.msg,
										})
									}
							})
						}
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
.body{width:750rpx;height:auto;background: url('https://files.thedream.tech/live/mini/images/page-head-bg.png') no-repeat top;background-size:100%;}
.head{width:700rpx;height:auto;margin:0 25rpx;padding-top:120rpx;text-align: center;}
.headimg{width:150rpx;height:150rpx;margin:0 auto;}
.head image{width:150rpx;border-radius:50%;height:150rpx;}
.head .nickname{width:100%;height:auto;text-align: center;color:#fff;font-size:30rpx;padding:10rpx 0 60rpx;}
.box{width:750rpx;height:auto;margin:40rpx 0;}
.list{width:670rpx;height:auto;overflow: hidden;border-bottom:2rpx solid #e7e7e7;padding:30rpx 40rpx;line-height:50rpx;}
.list .icon{width:50rpx;height:50rpx;float:left;margin-right:15rpx;}
.list text{width:575rpx;height:auto;float:left;overflow: hidden;color:#666;font-size:30rpx;}
.list .more{width:30rpx;height:30rpx;float:left;position: relative;top:10rpx;}
.button{background: none;display: inline;padding:0;}
button::after{border: none;}
</style>
