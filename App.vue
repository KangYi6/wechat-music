<script>
	export default {
		onLaunch: function() {
			let that = this;
			//判断平台类型
			let systemInfo = uni.getSystemInfoSync()
			that.globalData.os = systemInfo['osName']
			console.log(systemInfo['osName'])
			if (systemInfo.uniPlatform == 'mp-weixin') { //微信小程序
				// 登录
				uni.login({
					success: res => {
						if (res.code) {
							//发送 res.code 到后台换取 openId, sessionKey, unionId
							this.$request({
								url: "/musiccourse/login/wxlogin.html",
								data: {code: res.code},
								method: "POST",
							}).then((e)=>{
								//用户已注册，直接登录
								if (e.data.code == 1000) {
									uni.setStorageSync('userInfo',e.data.data);
									that.globalData.userInfo = e.data.data;
									that.globalData.login = true;
									uni.setStorageSync('wxdata',e.data.data);
								} else if (e.data.code == 1003) {
									uni.setStorageSync('wxdata',e.data.data);
								} else {
									uni.showToast({
										title:res.data.msg,
										icon:'none',
									})
								}
							})
						}
					},
					complete: e =>{
						that.globalData.launch = true;
					}
				})
			}
		},
		onShow: function() {
			wx.onAppRoute(res=>{
			    let pages = getCurrentPages();
			    let view = pages[pages.length-1];
				if(view.route=='pages/product/product'||view.route=='pages/productdetail/productdetail'||view.route=='pages/news/news'||view.route=='pages/newsdetail/newsdetail'||view.route=='pages/aimusicxml/aimusicxml'||view.route=='pages/musicxmldetail/musicxmldetail'||view.route=='pages/question/question'){
					return
				} else {
					view.onShareAppMessage = function(){
						return {
							title: '逐梦音乐 让你轻松学会钢琴',
							path: '/pages/home/home?scene='+getApp().globalData.userInfo.u_id,
							imageUrl:"../../static/zhumeng.png"
						}
					}
				}
			})
		},
		onHide: function() {
			console.log('App Hide') 
		},
		globalData: {
		    launch:false, //lanuch是否运行完
			userInfo:'', //用户信息
			login:false, //是否登录
			webviewPath:'https://music.thedream.tech/musicxmlengine/index.html', //曲谱引擎地址 
			param:'', //扫码登录 设备MAC&时间戳
			os:'android'
		},
		methods:{
			formatRichText(html) { //控制小程序中图片大小
				let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
					match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
					match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
					match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
					return match;
				});
				newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
					match = match.replace(/[^;]+;/gi, 'max-100%;').replace(/[^;]+;/gi, 'max-100%;');
					return match;
				});
				// newContent = newContent.replace(/<br[^>]*/>/gi, '');
				newContent = newContent.replace(/<img/gi,
					'<img style="max-100%;height:auto;display:inline-block;margin:10rpx auto;"');
				return newContent;
			},
			
		
		}
	}
</script>

<style>
	.nocot{width:450rpx;height:auto;margin:200rpx 150rpx 0;}
	.nocot image{width:450rpx;height:306rpx;}
	.nocot text{width:450rpx;height:auto;font-size:24rpx;color:#ccc;text-align: center;line-height: 40rpx;display: inline-block;}
	.nologin{width:300rpx !important;height:80rpx;padding:5rpx 0;background:#f00;border-radius: 40rpx;text-align: center;line-height: 80rpx;color:#fff;font-weight: normal;font-size:30rpx;margin-top:30rpx;}
	.nologin image{width:40rpx;height:40rpx;position: relative;top:10rpx;padding-right:10rpx;}
	.dataend{width:100%;height:auto;color:#7a7a7a;text-align: center;font-size:26rpx;margin:20rpx auto;}
	/* 加载 */
	.load{margin:30rpx auto;}
	.icon-load{animation: ani-demo-spin 1s linear infinite;}
	@keyframes ani-demo-spin {from { transform: rotate(0deg);}50%  { transform: rotate(180deg);}to   { transform: rotate(360deg);}}
</style>
