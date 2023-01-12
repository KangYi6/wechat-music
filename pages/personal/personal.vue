<template>
	<view class="box">
		<view class="list">
			<view class="name">头像</view>
			<view class="cot">
				<image class="headimg" mode="widthFix" :src="headimg"></image>
			</view>
		</view>
		<view class="list">
			<view class="name">昵称</view>
			<view class="cot">
				<input type="text" class="nickname" @input="nicknameInput" :value="nickname"/>
			</view>
		</view>
		<view class="list">
			<view class="name">性别</view>
			<view class="cot">
				<radio-group>
					<label class="label" v-for="(item,index) in items" :key="index">
						<view class="radiobtn" @click="sexbtn(item.value)">
							<radio :value="item.value" :checked="item.checked"/>
						</view>
						<text class="sex">{{item.name}}</text>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="button" @click="submit()">保存</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				headimg:'',
				nickname:'',
				sex:'',
				items: [
					{value: '1', name: '男', checked:'true'},
					{value: '2', name: '女', checked:'false'},
					{value: '3', name: '保密', checked:'false'},
				]
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: '修改资料'
			})
			let items = this.items;
			if (app.globalData.userInfo.u_sex == 1) {
				items[0].checked = 'checked';
				items[1].checked = '';
				items[2].checked = '';
			} else if (app.globalData.userInfo.u_sex == 2){
				items[0].checked = '';
				items[1].checked = 'checked';
				items[2].checked = '';
			} else {
				items[0].checked = '';
				items[1].checked = '';
				items[2].checked = 'checked';
			}
			this.sex = app.globalData.userInfo.u_sex
			this.nickname = app.globalData.userInfo.u_nickname
			this.headimg = app.globalData.userInfo.u_headimg
			this.items = items
		},
		methods: {
			//昵称输入
			nicknameInput(e){
				this.nickname = e.detail.value
			},
			//性别选择
			sexbtn: function (value){
				this.sex = value
			},
			//选择头像并上传
			chooseImageSingle: function(){
				uni.chooseMedia({
					count: 1,
					mediaType: ['image'],
					success(res) {
						var imgpath = res.tempFiles[0].tempFilePath;
						uni.showToast({ title: '上传中...', icon: 'loading', duration: 1000, mask: false });
						uni.uploadFile({
							url: app.globalData.apiUrl + '/user/headimg.html',
							filePath: imgpath,
							name: 'file',
							formData: {
								'uid': app.globalData.userinfo.s_id,
							},
							success: function (e) {
								var data = JSON.parse(e.data);
								if (data.code == 1000) {
									that.setData({
										headimg:data.data,
									})
									var userinfo = wx.getStorageSync('userinfo');
										userinfo.s_headimg = data.data;
									app.globalData.userinfo = userinfo;
									wx.setStorageSync('userinfo', userinfo)
								} else {
									wx.showToast({
										title: data.msg,
										icon: 'none'
									})
								}
							}
						})
					}
				})
			},
			//提交修改
			submit: function(){
				if (!this.nickname) {
					uni.showToast({
						title: '请输入昵称',
						icon:'none'
					})
					return;
				}
				if (this.sex === '') {
					uni.showToast({
						title: '请选择性别',
						icon:'none'
					})
					return;
				}
				this.$request({
					url: "/musiccourse/user/personal.html",
					data:{
						nickname:this.nickname,
						sex:this.sex,
					},
					method: "POST",
				}).then((res)=>{
					if (res.data.code == 1000) {
						let userInfo = app.globalData.userInfo
						userInfo.u_nickname = this.nickname
						userInfo.u_sex = this.sex
						//重设用户信息缓存和记录
						uni.setStorageSync('userInfo',userInfo)
						app.globalData.userInfo = userInfo
						uni.showModal({
							title: '提示',
							content: '修改成功',
							showCancel:false,
							success (res) {
								if (res.confirm) {
									uni.switchTab({
										url: '../user/user',
									})
								}
							}
						})
					} else {
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
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
	.box{width:750rpx;height:auto;margin:40rpx 0;}
	.list{width:670rpx;height:auto;overflow: hidden;border-bottom:2rpx solid #e7e7e7;padding:30rpx 40rpx;line-height:50rpx;overflow: hidden;}
	.name{width:100rpx;height:auto;float:left;}
	.cot{width:540rpx;height:auto;float:left;overflow: hidden;color:#666;font-size:30rpx;line-height: 50rpx;height:50rpx;}
	.cot image{width:50rpx;height:50rpx !important;border-radius:50%;}
	.cot input{height:50rpx;line-height:50rpx;}
	.more{width:30rpx;height:30rpx;float:left;position: relative;top:10rpx;}
	radio{transform:scale(0.7);}
	radio-group{width:100%;height:50rpx;line-height: 50rpx;}
	.label{width:125rpx;height:50rpx;line-height: 50rpx;float:left;}
	.radiobtn{width:55rpx;height:50rpx;line-height: 50rpx;float:left;}
	.sex{width:70rpx;height:50rpx;float:left;color:#7a7a7a;position: relative;top:5rpx;}
	.button{width: 400rpx;height: 80rpx;background: linear-gradient(119deg,#63d6e5 0%, #5cc2cf 100%);border-radius: 53rpx;margin:80rpx auto 0;text-align: center;line-height: 80rpx;color:#fff;}
</style>
