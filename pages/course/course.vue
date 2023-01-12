<template>
	<view class="body">
		<view class="tab">
			<text :class="tab == 'course' ? 'tabname cur':'tabname'" @click="tabBtn('course')">我的课程</text>
			<text :class="tab == 'homework' ? 'tabname cur':'tabname'" @click="tabBtn('homework')">我的作业</text>
		</view>
		<view class="course" v-show="tab == 'course'">
			<view class="box" v-if="course.length > 0">
				<view class="list" v-for="(item, index) in course" :key="item.p_id" @click="productDetail(item.p_id)">
					<view class="leftimg">
						<image mode="widthFix" :src="item.p_thumb"></image>
					</view>
					<view class="content">
						<view class="biaoti">{{item.p_title}}</view>
						<view class="desc">{{item.p_desc}}</view>
						<view class="price">已购买</view>
						<view class="buy">查看详情</view>
					</view>
				</view>
				<!-- 加载完 -->
				<view class="dataend" v-if="courseConfig.dataAll">没有更多了!</view>
			</view>
			<view class="nocot" v-else>
				<image mode="widthFix" src="@/static/nocot.png"></image>
				<text>暂无内容</text>
			</view>
		</view>
		<view class="homework" v-show="tab == 'homework'">
			<view class="box" v-if="homework.length > 0">
				<view class="list" v-for="(item,index) in homework" :key="index" @click="homeworkDetail(item.h_id)">
					<view class="title">{{item.h_title}}</view>
					<view class="time">{{item.h_date}}</view>
					<view class="text">{{item.h_desc}}</view>
					<view class="order">
						<view class="teacher" v-if="item.u_name"><image src="@/static/teacher-icon.png"></image>老师：{{item.u_name}}</view>
						<view class="teacher" v-else><image src="@/static/teacher-icon.png"></image>老师：{{item.u_nickname}}</view>
						<view class="grade"><image src="@/static/grade-icon.png"></image>班级：{{item.g_name}}</view>
					</view>
					<view class="mark" v-if="item.h_finish">
						<image mode="widthFix" src="@/static/status-readed-bg.png"></image>
						<text>已阅读</text>   
					</view>
					<view class="mark" v-else>
						<image mode="widthFix" src="@/static/status-noread-bg.png"></image>
						<text>未阅读</text>
					</view>
				</view>
				<!-- 加载完 -->
				<view class="dataend" v-if="homeworkConfig.dataAll">没有更多了!</view>
			</view>
			<view class="nocot" v-else>
				<image mode="widthFix" src="@/static/nocot.png"></image>
				<text>暂无内容</text>
			</view>
		</view>
		<!-- 登录按钮 -->
		<button class="nologin" v-if="!login"><image mode="widthFix" src="@/static/user-icon.png"></image>请登录</button>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				login:false,
				tab:'course', //类型
				homework:[], //列表数据
				homeworkConfig:{
					totalPage:'', //总页
					curPage:1, //当前页面
					dataAll:false, //数据是否加载完
				},
				course:[],
				courseConfig:{
					totalPage:'', //总页
					curPage:1, //当前页面
					dataAll:false, //数据是否加载完
				}
			}
		},
		onLoad(){
			if (app.globalData.login) {
				this.login = true
			}
			this.courseListData()
			this.homeworkListData()
		},
		methods: {
			//Tab切换
			tabBtn(type){
				this.tab = type
			},
			//获取作业数据
			homeworkListData: function() {
				this.$request({
					url: "/musiccourse/homework/list.html",
					data:{
						page:this.homeworkConfig.curPage,
						limit:10,
					},
					method: "POST",
				}).then((res)=>{
					uni.stopPullDownRefresh();
					if (res.data.code == 1000) {
						let homework = this.homework
						if (this.homeworkConfig.curPage == 1) {
							homework = res.data.data.data
						} else {
							homework = homework.concat(res.data.data.data)
						}
						this.homework = homework
						this.homeworkConfig.totalPage = res.data.data.last_page
						this.homeworkConfig.curPage = res.data.data.current_page
						if (res.data.data.current_page >= res.data.data.last_page) {
							this.homeworkConfig.dataAll = true
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
					}
				})
			},
			//作业详情
			homeworkDetail(id){
				uni.navigateTo({
					url:'../homeworkdetail/homeworkdetail?id='+id
				})
			},
			//课程详情
			productDetail(id){
				uni.navigateTo({
					url:"/pages/productdetail/productdetail?id="+id
				})
			},
			//获取课程数据
			courseListData: function() {
				this.$request({
					url: "/musiccourse/course/list.html",
					data:{
						page:this.courseConfig.curPage,
						limit:10,
					},
					method: "POST",
				}).then((res)=>{
					uni.stopPullDownRefresh();
					if (res.data.code == 1000) {
						let course = this.course
						if (this.courseConfig.curPage == 1) {
							course = res.data.data.data
						} else {
							course = course.concat(res.data.data.data)
						}
						this.course = course
						this.courseConfig.totalPage = res.data.data.last_page
						this.courseConfig.curPage = res.data.data.current_page
						if (res.data.data.current_page >= res.data.data.last_page) {
							this.courseConfig.dataAll = true
						}
					} else {
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
					}
				})
			},
			//课程详情
			courseDetail(id){
				uni.navigateTo({
					url:'../pages/coursedetail/coursedetail?id='+id,
				})
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			if (this.tab == 'homework') {
				this.homeworkConfig.curPage = 1
				this.homeworkListData();
			} else if (this.tab == 'course') {
				this.courseConfig.curPage = 1
				this.courseListData();
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {
			if (this.tab == 'homework') {
				if (this.homeworkConfig.curPage < this.homeworkConfig.totalPage) {
					this.homeworkListData();
				}
			} else if (this.tab == 'course') {
				if (this.courseConfig.curPage < this.courseConfig.totalPage) {
					this.courseListData();
				}
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
	page{background:#f0f0f5;height:100%;}
	.body{width:750rpx;height:calc(100% - 30px);background: url('https://files.thedream.tech/live/mini/images/page-head-bg.png') no-repeat top;background-size:100%;padding-top:30rpx;}
	.tab{width:750rpx;height:auto;text-align: center;margin-bottom:30rpx;}
	.tab .tabname{width:auto;height:auto;margin:0 20rpx;font-size:32rpx;color:#fff;display: inline-block;padding-bottom:10rpx;}
	.tab .cur{border-bottom:2rpx #fff solid;}
	.homework .list{width:660rpx;height:auto;background:#fff;border-radius:40rpx;position: relative;margin:0 25rpx 30rpx;padding:20rpx;overflow: hidden;}
	.homework .title{width:100%;height:auto;margin:0 auto;font-size:35rpx;font-weight: bold;color:#000;line-height: 60rpx;}
	.homework .time{width:100%;height:auto;color:#7a7a7a;font-size:28rpx;line-height: 50rpx;opacity: 0.47;}
	.homework .text{width:100%;height:80rpx;color:#7a7a7a;font-size:26rpx;line-height: 40rpx;overflow: hidden;}
	.homework .order{width:100%;height:auto;border-top:1px #EFEFEF solid;padding-top:5rpx;margin-top:10rpx;}
	.homework .teacher{width:auto;height:auto;display: inline-block;font-size:26rpx;color:#7a7a7a;margin-right:30rpx;}
	.homework .teacher image{width:40rpx;height:40rpx;position: relative;top:10rpx;}
	.homework .grade{width:auto;height:auto;display: inline-block;font-size:26rpx;color:#7a7a7a;}
	.homework .grade image{width:40rpx;height:40rpx;position: relative;top:10rpx;}
	.homework .mark{position: absolute;top:0;right:0;width:150rpx;height:auto;}
	.homework .mark image{max-width:100%;}
	.homework .mark text{width:100%;height:auto;font-size:30rpx;line-height:40rpx;color:#fff;position: absolute;top:8rpx;right:0;text-align: center;font-size:24rpx;}
	.course .box{width:700rpx;height:auto;margin:0 auto;}
	.course .list{width:calc(100% - 40rpx);height:auto;background:#fff;border-radius:15rpx;padding:20rpx;overflow: hidden;margin-bottom:20rpx;}
	.course .leftimg{width:280rpx;height:166rpx;float:left;}
	.course .leftimg image{width:280rpx;height:166rpx;border-radius:10rpx;}
	.course .content{width:360rpx;height:auto;float:left;padding:0 0 0 20rpx;}
	.course .content .biaoti{width:100%;max-height:80rpx;color:#353535;font-size:30rpx;font-weight: bold;padding-bottom:10rpx;overflow: hidden;}
	.course .content .desc{width:100%;height:32rpx;overflow: hidden;color:#999;line-height: 36rpx;font-size:24rpx;}
	.course .price{width:200rpx;height:auto;float:left;color:#f00;margin-top:10rpx;font-size:26rpx;}
	.course .buy{width: 150rpx;height: 36rpx;text-align: right;line-height: 36rpx;color:#009db1;font-size:24rpx;margin-top:10rpx;float:right;}
</style>
