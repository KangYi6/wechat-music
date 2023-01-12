<template>
	<!-- MBTI测试 -->
	<!-- 首页 -->
	<view class="index" v-if="showpage == 'index'">
		<view class="bg">
			<image src="https://files.thedream.tech/live/mini/question/indexbg2.jpg" mode="widthFix"></image>
		</view>
		<view class="start">
			<button class="startbtn" v-if="!login" @tap="getUserProfile" open-type="getPhoneNumber" bindgetphonenumber="getPhoneNumber"><image src="https://files.thedream.tech/live/mini/question/start-btn.png" mode="widthFix"></image></button>
			<image v-else @click="startbtn()" src="https://files.thedream.tech/live/mini/question/start-btn.png" mode="widthFix"></image>
		</view>
	</view>
	<!-- 答题页 -->
	<view class="list" v-else-if="showpage == 'list'">
		<image src="https://files.thedream.tech/live/mini/question/list-head.png" mode="widthFix"></image>
		<view class="box">
			<view class="cot">
				<view class="title">0{{index+1}}. {{curQuestion.title}}</view>
				<view :class="cur == 'A' ? 'select cur' : 'select'" @click="selectBtn('A',curQuestion.select.answerAcode)">{{curQuestion.select.answerA}}</view>
				<view :class="cur == 'B' ? 'select cur' : 'select'" @click="selectBtn('B',curQuestion.select.answerBcode)">{{curQuestion.select.answerB}}</view>
				<view class="next" @click="nextBtn()">
					<image src="https://files.thedream.tech/live/mini/question/next.png" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<image src="https://files.thedream.tech/live/mini/question/list-title-bottom.png" mode="widthFix"></image>
	</view>
	<!-- 测试结果 -->
	<view class="detail" v-else-if="showpage == 'detail'" @click="saveImg('https://files.thedream.tech/live/mini/question/img1/'+answer+'.png')">
		<image :src="'https://files.thedream.tech/live/mini/question/img1/'+answer+'.png'" show-menu-by-longpress="true" lazy-load="true" mode="widthFix"></image>
		<view class="savebtn"><i-icon type="share_fill"/> 保存到相册</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				showpage:'index', //显示页面
				question:[ //题目
					{
						'title':'空闲时',
						'select':{
							'answerA':'你更愿意出去玩儿（E）',
							'answerAcode':'E',
							'answerB':'还是愿意宅在家读书/看电视？(I)',
							'answerBcode':'I',
						},
					},
					{
						'title':'当你学习新东西时',
						'select':{
							'answerA':'你是所见即所学（S）',
							'answerAcode':'S',
							'answerB':'还是根据自己的直觉添加/删除印象？(N)',
							'answerBcode':'N',
						},
					},
					{
						'title':'当你对某件事作出决定时',
						'select':{
							'answerA':'你依靠逻辑推理（T）',
							'answerAcode':'T',
							'answerB':'还是倾向于感性和情绪？/看电视？（F）',
							'answerBcode':'F',
						},
					},
					{
						'title':'你愿意自己生活井井有条',
						'select':{
							'answerA':'预先安排好（J）',
							'answerAcode':'J',
							'answerB':'还是喜欢突如其来，令人惊喜？(P)',
							'answerBcode':'P',
						},
					},
				],
				cur:'', //当前选项
				index:0, //答题位置
				curQuestion:{}, //当前答题
				curAnswer:'', //当前答案
				answer:'', //选择的答案
				image:'', //最终要显示的图片后缀
				login:false, //是否登录
				nickname:'',
				heading:'',
				sex:0,
				session_key:'',
				openid:'',
				unionid:'',
				getUser:false, //获取头像昵称权限
				getPhone:false,//获取手机号权限
				phone:'',
				recommender:'',
			}
		},
		onLoad(options){
			uni.setNavigationBarTitle({
				title: '测一测 你最适合学习什么乐器？'
			})
			let recommender = uni.getStorageSync('recommender')
			if (recommender) {
				this.recommender = recommender
			} else {
				this.recommender = options.scene
			}
			//如果用户登录
			if (app.globalData.login) {
				this.login = true
			} else {
				let wxdata = uni.getStorageSync('wxdata')
				this.session_key = wxdata.session_key
				this.openid = wxdata.openid
				this.unionid = wxdata.unionid
			}
		},
		methods: {
			//开始答题
			startbtn:function(){
				this.showpage = 'list'
				this.curQuestion = this.question[0]
				this.index = 0
			},
			//选择答题
			selectBtn:function(select,id){
				this.cur = select
				this.curAnswer = id
			},
			//下一题
			nextBtn:function(){
				let index = this.index+1
				//答题结束
				if (index > 3) {
					//拼凑答案
					let answer = this.answer+this.curAnswer;
					//判断测试结果，显示不用图片
					this.image = 'share'
					this.showpage = 'detail'
					this.answer = answer
				} else {
					//如果用户未选择答案
					if (!this.curAnswer) {
						uni.showToast({
							title: '请选择答案',
							icon:'none',
						})
						return;
					}
					//拼凑答案
					let answer = this.answer+this.curAnswer;
					this.cur = ''
					this.curAnswer = ''
					this.answer = answer
					this.index = index,
					this.curQuestion = this.question[index]
				}
			},

			/**
			 * 保存图片到相册
			 */
			saveImg :function(img){
				uni.getImageInfo({
					src: img,
					success (res) {
						let path = res.path;
						uni.saveImageToPhotosAlbum({
							filePath:path,
							success(res) { 
								uni.showToast({
									title: '保存成功！',
									icon: 'success',
								})
							},
							fail(error){
								uni.showToast({
									title: '保存失败！',
									icon: 'error',
								})
							}
						})
					}
				})
			},
			//获取头像，昵称
			getUserProfile(e) {
				// 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
				// 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						this.nickname = res.userInfo.nickName
						this.headimg = res.userInfo.avatarUrl
						this.sex = res.userInfo.gender
						this.getUser = true
						if (this.getPhone && this.getUser) {
							this.wxLogin();
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
				this.getphone(e);
			},
			//获取手机号
			getphone:function(e){
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
						this.getphone(e);
					}
				})
			},
			//注册
			wxLogin:function(){
				let wxdata = uni.getStorageSync('wxdata')
				this.$request({
					url: "/musiccourse/login/wxRegister.html",
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
		},
		//用户点击右上角分享
		onShareAppMessage: function () {
			return {
				title: '测一测你最适合学习什么乐器',
				path: '/pages/question/question?scene='+app.globalData.userinfo.u_id,
				imageUrl:'http://files.thedream.tech/live/mini/question/share.jpg', 
			}
		}
	}
</script>

<style>
	page{width:100%;height:100%;background:#fc73ae;}
	/* 首页 */
	.index{width:750rpx;height:100%;}
	.index .bg image{width:100%;}
	.index .startbtn{width:auto;background: none;}
	.index .start{width:100%;height:auto;position:fixed;bottom:80rpx;text-align: center;}
	.index .start image{margin:0 auto;}
	/* 答题页 */
	.list{width:100%;height:auto;overflow: hidden;background: url('https://files.thedream.tech/live/mini/question/listbg.jpg') no-repeat;background-size: 100%;}
	.list image{width:100%;display:block;}
	.list .box{width:100%;height:auto;background:url('https://files.thedream.tech/live/mini/question/list-title-center.png') repeat-y;background-size: 100%;}
	.list .cot{width:80%;height:auto;padding:20rpx 10%;}
	.list .cot .title{width:100%;height:auto;font-size:32rpx;color:#000;margin-bottom:30rpx;}
	.list .cot .select{width:90%;height:auto;background: #ff6977;color:#fff;font-size:30rpx;line-height: 60rpx;border-radius: 50rpx;padding:15rpx 5%;margin-bottom:30rpx;}
	.list .cot .cur{background: #00c2db !important;}
	.list .next{width:100%;height:auto;text-align: center;}
	.list .next image{width:100%;}
	/* 测试结果 */
	.detail{width:100%;height:100%;text-align: center;}
	.detail image{width:90%;margin:40rpx auto 0;padding:0 5%;}
	.detail .close{width:30rpx;height:30rpx;margin-top:20rpx;}
	.savebtn{width:200rpx;height:60rpx;line-height: 60rpx;font-size:26rpx;color:#fff;text-align: center;background: #00c2db;border-radius: 30rpx;margin:20rpx auto;}
</style>