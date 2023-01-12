<template>
	<view class="details">
		<view class="banner">
			<uni-swiper-dot :info="data.p_images" mode="round" field="title" :current="banner_cur" v-if="!videoshow">
				<swiper :autoplay="true" :interval="3000" :duration="1000" @change="bannerChanged">
					<swiper-item v-for="(item,index) in data.p_images" :key="index">
						<image :src="item" mode="widthFix"></image>
					</swiper-item>
				</swiper>
			</uni-swiper-dot>
			<video class="video" id="myvideo" :src="content.video" autoplay controls show-fullscreen-btn="true" v-if="videoshow"></video>
		</view>
		<view class="tab" v-if="data.course.length">
			<view :class="tab == 1 ? 'tabname cur' : 'tabname'" @click="tabBtn(1)" v-show="data.p_body!=null">
				<view>课程介绍</view>
				<text></text>
			</view>
			<view :class="tab == 2 ? 'tabname cur' : 'tabname'" @click="tabBtn(2)" :style="{width:tabwidth}">
				<view>课程目录</view>
				<text></text>
			</view>
		</view>
		<view class="content" v-show="tab == 1">
			<view class="img" v-for="(item,index) in data.p_body" :key="index">
				<image v-if="item.images" :src="item.images" mode="widthFix"></image>
				<image v-else :src="item" mode="widthFix"></image>
			</view>
		</view>
		<view class="content mulu" v-show="tab == 2">
			<!-- 直播或者闯关 -->
			<view v-for="(item,index) in data.course" :key="item.c_id" v-show="ptype==1||ptype==2">
				<view class="contenta" @click="openlist(index)">
					<image class="coursetype" v-if="item.c_type == 1" src="@/static/video-icon.png" mode="widthFix"></image>
					<image class="coursetype" v-else-if="item.c_type == 2" src="@/static/note-icon.png" mode="widthFix"></image>
					<text class="text">{{item.c_name}}</text>
					<image class="mianfei" src="../../static/mianfei.png" v-show="item.c_free==0"></image>
					<!-- <image class="lock" src="@/static/lock-icon.png" mode="widthFix" v-if="isbuy==0&&item.c_free== 1"></image> -->
					<image class="lock" src="@/static/bottom.png" v-if="!item.show"></image>
					<image class="lock" src="@/static/top.png" v-if="item.show"></image>
					<view class="contenta text" v-if="item.show && item.list.length==0" style="margin-top: 10px;">暂无内容</view>
					<view v-for="(i,n) in item.list" :key="i.cw_id" class="contenta" v-if="item.show && item.list.length>0" style="margin-top: 12px;animation: showup 0.3s ease;"  @click.stop="gameshow">
						<image class="coursetype" v-if="i.cw_type == 1" src="@/static/video-icon.png" mode="widthFix"></image>
						<image class="coursetype" v-else-if="i.cw_type == 2" src="@/static/note-icon.png" mode="widthFix"></image>
						<text class="text">{{i.cw_name}}</text>
						<image class="mianfei" src="../../static/mianfei.png" v-show="i.cw_free==0"></image>
						<image class="lock" src="@/static/lock-icon.png" mode="widthFix" v-if="isbuy==0&&i.cw_free== 1"></image>
					</view>
				</view>
				<view class="underline"></view>
			</view>
			<!-- 产品或者视频 -->
			<view v-for="(item,index) in data.course" :key="item.c_id" v-show="ptype==3||ptype==4||ptype==5">
				<view class="contenta" @click="openlist(index)">
					<image class="coursetype" v-if="item.c_type == 1" src="@/static/video-icon.png" mode="widthFix"></image>
					<image class="coursetype" v-else-if="item.c_type == 2" src="@/static/note-icon.png" mode="widthFix"></image>
					<text class="text">{{item.c_name}}</text>
					<image class="mianfei" src="../../static/mianfei.png" v-show="item.c_free==0"></image>
					<!-- <image class="lock" src="@/static/lock-icon.png" mode="widthFix" v-if="isbuy==0&&item.c_free== 1"></image> -->
					<image class="lock" src="@/static/bottom.png" v-if="!item.show"></image>
					<image class="lock" src="@/static/top.png" v-if="item.show"></image>
					<view class="contenta text" v-if="item.show && item.list.length==0" style="margin-top: 10px;">暂无内容</view>
					<view v-for="(i,n) in item.list" :key="i.cw_id" class="contenta" v-if="item.show && item.list.length>0" style="margin-top: 12px;animation: showup 0.3s ease;" @click.stop="courseclick(i.cw_content,i.cw_free,i.cw_name)">
						<image class="coursetype" v-if="i.cw_type == 1" src="@/static/video-icon.png" mode="widthFix"></image>
						<image class="coursetype" v-else-if="i.cw_type == 2" src="@/static/note-icon.png" mode="widthFix"></image>
						<text class="text">{{i.cw_name}}</text>
						<image class="mianfei" src="../../static/mianfei.png" v-show="i.cw_free==0"></image>
						<image class="lock" src="@/static/lock-icon.png" mode="widthFix" v-if="isbuy==0&&i.cw_free== 1"></image>
					</view>
				</view>
				<view class="underline"></view>
			</view>
		</view>
		<view class="footer" v-if="data.buy == 0">
			<view v-if="globalData.os == 'ios' || globalData.os == 'macos'">
				<button class="buybtn ios" @click="infomation()"><image class="buyicon" src="@/static/caricon.png"></image>立即订阅</button>
			</view>
			<view v-else>
				<view class="price">￥{{data.p_price}}元</view>
				<!-- 获取头像昵称 -->
				<!-- 获取手机号 -->
				<!-- 1、获取用户信息+手机号 -->
				<button class="buybtn" v-if="createOrderBtn == 1" @tap="getUserProfile" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber"><image class="buyicon" src="@/static/caricon.png"></image>立即购买</button>
				<!-- 2、直接下单 -->
				<button class="buybtn" v-else @click="infomation()"><image class="buyicon" src="@/static/caricon.png"></image>立即购买</button>
			</view>
		</view>
	</view>	    	
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				id:'', //产品ID
				data:'', //产品数据
				banner_cur:0, //banner索引
				recommander:'',//推荐人ID
				userInfo:'',//用户信息
				createOrderBtn:1,//1、获取用户信息+手机号 2、直接下单
				getUser:false, //获取头像昵称权限
				getPhone:false,//获取手机号权限
				session_key: '',
				openid: '',
				unionid: '',
				nickname:'',
				headimg:'',
				sex:'',
				phone:'',
				tab:1, //1课程介绍 2课程目录
				content:[],//播放视频
				videoshow:false,//视频显示隐藏
				videoContext:'',//视频元素
				isbuy:'',//是否购买产品
				ptype:'',//判断是否闯关或直播1或2
				tabwidth:'50%',//tab宽度
				globalData:app.globalData,
			}
		},
		onLoad(options){
			var recommender = uni.getStorageSync('recommender')
			this.id = options.id
			this.productDetail()
			this.videoContext=uni.createVideoContext('myvideo')
			if (app.globalData.login) {
				this.createOrderBtn = 2
			} else {
				this.createOrderBtn = 1
			}
			console.log(this.globalData.os)
		},
		methods:{
			bannerChanged(e){
				this.banner_cur = e.detail.current; //图片滚动时值跟着变
			},
			tabBtn(val){
				this.tab = val
				this.videoshow=false
				if(val==1){
					this.videoContext.pause()
				}
			},
			//产品详情
			productDetail(){
				this.$request({
					url: this.$baseUrl + "/musiccourse/index/productdetail.html",
					data:{id:this.id},
					method: "POST",
				}).then((res)=>{
					if (res.data.code == 1000) {
						uni.setNavigationBarTitle({
							title: res.data.data.p_title,
						})
						this.data = res.data.data
						this.isbuy=res.data.data.buy
						this.ptype=res.data.data.p_type
						if(res.data.data.p_body==null){
							this.tabwidth="100%"
							this.tab=2
						}
						this.data.course.forEach(i=>{
							i.show=false
						})
					} else {
						uni.showModal({
							title: '提示',
							content: res.data.msg,
							success: function (res) {
								uni.navigateBack()
							}
						});
					}
				})
			},
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
						code:e.detail.code
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
						//登录或注册成功后，跳转到订单填写页
						this.infomation()
					} else {
						uni.showToast({
							title:res.data.msg,
							icon:'none',
						})
					}
				})
			},
			//填写订单信息
			infomation(){
				if (this.globalData.os == 'ios' || this.globalData.os == 'macos') {
					uni.showModal({
						title:'温馨提示',
						content:'十分抱歉，由于相关规范，您暂时无法在这里订阅课程',
						showCancel:false,
						confirmText:'我知道了',
						success: function (res) {
							if (res.confirm) {
								return;
							}
						}
					})
				} else {
					uni.navigateTo({
						url:'../infomation/infomation?id='+this.id
					})
				}
			},
			//课程目录点击
			courseclick(content,free,title){
				if(this.isbuy==0&&free==1){
					uni.showToast({
						title:"未购买",
						icon:"none"
					})
					return
				}
				if(content.video){
					this.content=content
					this.videoshow=true
				}else{
					uni.navigateTo({
						url:"/pages/musicxmldetail/musicxmldetail?title="+title+"&path="+content.xml
					})
				}
			},
			//闯关提示
			gameshow(){
				uni.showToast({
					title:"请在APP上进行闯关",
					icon:"none"
				})
			},
			//查看课程详情
			courseWare(id){
				this.$request({
					url: "/musiccourse/index/coursedetail.html",
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
			
			//打开下拉列表
			openlist(index){
				if(this.data.course[index].show){
					this.data.course[index].show=false
				}else{
					this.data.course[index].show=true
				}
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
	.details {width: 750rpx;height: auto;background-color: #fff;}
	.banner{width:750rpx;height:409rpx;}
	.video{width:750rpx;height:409rpx;}
	/* 轮播图 */
	.banner image{width: 750rpx;height: 409rpx;}
	swiper{width:750rpx;height:409rpx;}
	.swiper-item image{width:750rpx;height:409rpx;}
	.tab{width:750rpx;height:80rpx;overflow: hidden;background: #fff;box-shadow:3px -1px 10px 0px #3333334f;}
	.tabname{width:50%;height:80rpx;float:left;text-align: center;line-height: 80rpx;font-size:30rpx;color:#333;}
	.cur text{width:40rpx;height:4rpx;background-color: #00C2DB;display: inline-block;position: relative;top: -30px;}
	.content .img{margin: 0 auto;border-radius: 8px;box-sizing: border-box;display: flex;flex-direction: column;}
	.content image{width: 100%;}
	.footer{width:100%;height:100rpx;position:fixed;bottom:0rpx;font-size: 25rpx;background-color: #fff;overflow: hidden;}
	.price{width: 45%;height:auto;float:left;color:#f00;font-weight: bold;line-height: 100rpx;font-size:32rpx;padding-left:5%;}
	.buybtn{width:45%;height:auto;font-size:32rpx;color:#fff;line-height: 70rpx;text-align: center;background: linear-gradient(0deg,#f00 0%, #e91e63 100%);border-radius: 50rpx;box-shadow: 6rpx 10.39rpx 14rpx 0rpx hsla(2, 82%, 62%, 0.48);margin:15rpx auto;margin-right:5%;}
	.buybtn image{width:40rpx;height:40rpx;padding-right:10rpx;position: relative;top:8rpx;}
	.ios{margin-right:auto}
	.mulu{width:700rpx;height:auto;padding:20rpx 25rpx;}
	.contenta {padding: 15rpx 10rpx;}
	.underline{border-bottom:1rpx #eee dotted;padding-top: 15rpx;}
	.contenta:last-child{border-bottom:none;}
	.text {font-size: 14px;color: #666;line-height: 20px;}
	.button {margin: 10px;margin-bottom: 0;}
	.uni-collapse-item__title-box{padding:0 !important;}
	.uni-collapse-item__title-arrow{margin-right: 0 !important;}
	.coursetype{width:35rpx !important;height:35rpx !important;position: relative;top: 6rpx;padding-right:10rpx;}
	.mianfei{width: 45rpx !important;height: 35rpx !important;margin-left: 10rpx;transform: translateY(8rpx);}
	.lock{width:35rpx !important;height:35rpx !important;float: right;position: relative;top: 6rpx;}
	@keyframes showup{
		0%{opacity: 0;}
		50%{opacity: 0.5;}
		100%{opacity: 1;}
	}
</style>