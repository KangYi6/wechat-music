<template>
	<!-- 曲谱搜索 -->
	<view class="head">
		<view class="search">
			<input type="text" @input="searchInput" :value="keyword" placeholder="搜索曲谱" placeholder-style="color:#ABABAB;font-size:28rpx;" @confirm="searchBtn"/>
			<image bindtap="searchBtn" src="@/static/search-btn.png"></image>
		</view>
	</view>
	<!-- 搜索历史 -->
	<view class="cot" v-if="history.length">
		<view class="title">
			<view class="history">搜索历史</view>
			<view class="delicon" @click="delkey()"><i-icon type="trash" size="24"/></view>
		</view>
		<view class="tag">
			<view class="tagtitle" @click="historyBtn(item)" v-for="(item,index) in history" :key="index">{{item}}</view>
		</view>
	</view>
	<view style="height:20rpx;" v-else></view>

	<view class="cot" v-if="!keyword">
		<view class="hottitle">热门榜 <text>HOT</text></view>
		<view class="list" v-for="(item,index) in hot" :key="index" @click="viewXml(item.m_title,item.m_path)">
			<view v-if="index == 0" class="code one">0{{index+1}}</view>
			<view v-else-if="index == 1" class="code two">0{{index+1}}</view>
			<view v-else-if="index == 2" class="code three">0{{index+1}}</view>
			<view v-else="index == 2" class="code">{{index < 9 ? '0':''}}{{index+1}}</view>
			<view class="name">{{item.m_title}}</view>
		</view>
	</view>

	<view class="box" v-else="keyword">
		<view v-if="list.length > 0">
			<view class="list" v-for="(item,index) in list" :key="index">
				<view @click="viewXml(item.m_title,item.m_path)">
					<view class="title">
						<view class="mark xml">xml</view>
						<view class="name">{{item.m_title}}</view>
					</view>
					<view class="desc">
						<view class="auther">作者：{{item.m_nickname ? item.m_nickname :'未知'}}</view>
						<view class="auther">查看：{{item.m_view}}</view>
						<view class="auther">点赞：{{item.m_fabulous}}</view>
						<view class="auther">收藏：{{item.m_collect}}</view>
						<!-- <view class="difficultys">查看：{{item.m_view}}</view> -->
					</view>
				</view>
			</view>
		</view>
		<view class="nocot" v-else-if="list.length == 0">
			<image mode="widthFix" src="@/static/nocot.png"></image>
			<text>暂无内容</text>
		</view>
	</view>
</template>

<script>
	let app = getApp()
	export default {
		data() {
			return {
				keyword:'',
				history:[],
				hot:[],
				list:[],
				totalPage:'', //总页
				curPage:0, //当前页面
				dataAll:false, //数据是否加载完
				name:'',
				auther:'',
				src:'',
			}
		},
		onLoad(){
			let history = wx.getStorageSync('history')
			this.history = history
			//标题
			wx.setNavigationBarTitle({
				title: 'AI智能曲谱'
			})
			this.hotXml()
		},
		methods: {
			searchInput: function(event) {
				this.keyword = event.target.value;
			},
			//搜索
			searchBtn(){
				if (this.keywords == '') {
					uni.showToast({
						title: '请输入关键词',
						icon: 'none'
					})
					return;
				}
				let history = new Array()
				//记录历史，仅保留8条记录
				if (this.history) {
					history = this.history
				}
				let exist = false;
				//判断是否存在，如果存在，移到第一位
				for (let i = 0; i < history.length; i++) {
					const element = history[i]
					if (element == this.keyword) {
						//删除当前
						history.splice(i,1);
						//首位添加
						history.unshift(this.keyword)
						exist = true;
					}
				}
				if (!exist) {
					if (history.length >= 8) {
						//移除最后一位
						history.splice(7,1)
					}
					//首位添加
					history.unshift(this.keyword)
				}
				//写入缓存
				uni.setStorageSync('history', history)
				this.history = history
				this.curPage = 0
				this.getListData()
			},
			//热门曲谱
			hotXml(){
				this.$request({
					url: this.$baseUrl + "/musiccourse/index/hotxml.html",
					method: "POST",
				}).then((res)=>{
					if (res.data.code == 1000) {
						this.hot = res.data.data
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
			//历史搜索
			historyBtn:function(keyword){
				this.keyword = keyword
				this.curPage = 0
				this.getListData()
			},
			//删除历史记录
			delkey: function(){
				uni.showModal({
					title: '提示',
					content: '确定要删除搜索记录吗？',
					success (res) {
						if (res.confirm) {
							uni.removeStorage({
								key: 'history',
								success (res) {
									this.history = []
								}
							})
						}
					}
				})
			},
			//获取数据列表
			getListData(){
				this.$request({
					url: "/musiccourse/index/musicxml.html",
					data:{
						keyword:this.keyword,
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
			viewXml(title,path){
				uni.navigateTo({
					url:'../musicxmldetail/musicxmldetail?title='+title+'&path='+path
				})
			}
		},
		/**
		 * 页面相关事件处理函数--监听用户下拉动作
		 */
		onPullDownRefresh: function () {
			if (this.keyword) {
				this.curPage = 0
				this.getListData()
			} else {
				uni.stopPullDownRefresh()
			}
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom: function () {
			if (this.keyword) {
				if (this.curPage < this.totalPage) {
					this.getListData()
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
	page{padding-bottom:130rpx;}
	.head{width:670rpx;overflow: hidden;padding:40rpx;background:#00C2DB;}
	.search{width:670rpx;height:auto;float:left;color:#7a7a7a;position: relative;}
	.search input{width:560rpx;height:auto;background:#fff;border-radius: 40rpx;padding:20rpx 90rpx 20rpx 30rpx;font-size:30rpx;}
	.search image{width:60rpx;height:60rpx;position: absolute;right:10rpx;top:15rpx;}
	/* 搜索历史 */
	.cot{width:700rpx;overflow: hidden;padding:25rpx;}
	.title{width:100%;height:auto;overflow: hidden;margin-bottom:15rpx;}
	.history{width:60%;height:auto;float:left;color:#000;font-weight: bold;text-align: left;font-size:32rpx;}
	.delicon{width:40%;height:auto;float:right;color:#929292;text-align: right;}
	.tag{width:100%;height:auto;overflow: hidden;}
	.tag .tagtitle{background: #f7f7f7;padding:10rpx 20rpx;border-radius: 30rpx;text-align: center;color:#afadb9;margin:0 10rpx 10rpx 0;font-size:26rpx;float:left;}
	/* 热门 */
	.hottitle{width:100%;height:auto;float:left;color:#000;font-weight: bold;text-align: left;font-size:32rpx;padding-bottom:20rpx;}
	.hottitle text{color:#f00;font-size:26rpx;}
	.cot .list{width:100%;height:auto;overflow: hidden;padding:30rpx 0;border-bottom:1rpx #eee solid;font-size:30rpx;position: relative;}
	.cot .list:last-child{border-bottom:none;}
	.cot .code{width:80rpx;height:auto;float:left;color:#707070;font-weight: bold;}
	.cot .name{width:calc(100% - 140rpx);height:auto;float:left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
	.cot .one{color:#47a3ff;}
	.cot .two{color:#a178ff;}
	.cot .three{color:#feb150;}
	/* 曲谱列表 */
	.box{width:700rpx;height:auto;padding:25rpx;}
	.tab{width:100%;height:auto;padding-bottom:60rpx;}
	.tab text{font-size:32rpx;color:#afadb9;text-align: center;margin-right:40rpx;border-bottom:5rpx #fff solid;padding-bottom:5rpx;}
	.tab .cur{border-bottom:5rpx #00c2db solid;color:#000;}
	.box .list{width:700rpx;height:auto;padding-bottom:30rpx;border-bottom:1rpx #eee solid;font-size:30rpx;margin-bottom:30rpx;position: relative;}
	.box .list:last-child{border-bottom: none;}

	.mark{color:#fff;padding:0;text-align: center;border-radius: 10rpx;width:50rpx;height:auto;float:left;font-size:24rpx;margin-right: 10rpx;position: relative;top:5rpx;}
	.pdf{background:#f00;}
	.xml{background:#00c2db;}
	.name{width:570rpx;height:auto;float:left;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
	.play1{width:60rpx;height:auto;float:right;text-align: right;position: absolute;top:21rpx;right:0;}
	.play2{width:60rpx;height:auto;float:right;text-align: right;position: absolute;top:-8rpx;right:0;}
	.desc{width:100%;height:auto;color:#afadb9;font-size:24rpx;overflow: hidden;}
	.auther{padding-right:40rpx;width:auto;float:left;}
	.difficultys{width:auto;float:left;}
	.star{color:#ff7526;position: relative;top:-3rpx;}

	.nocot {margin: 30rpx auto;}

	.audio{width:700rpx;height:auto;position: fixed;bottom:5rpx;left:25rpx;text-align: center;overflow: hidden;}
	audio{text-align: left;width: 100%;overflow: hidden;}

</style>
