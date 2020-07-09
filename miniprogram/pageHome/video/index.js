// miniprogram/pages/home/video/index.js
Page({

     /**
      * 页面的初始数据
      */
     data: {
          hiddenLoading: false, //loading状态
          videoIndex: null,
		videoList: [],//视频数据
		skip: 0, //分页开始取值
          limit: 20, //在小程序端默认及最大上限为 20，在云函数端默认及最大上限为 1000
          more: false, //没有更多数据
               
     },
     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
		this.getCount()

          this.getVideoData()
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {
     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {

     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {
		this.getCount()
          wx.showNavigationBarLoading();
          this.setData({
               skip: 0,
               photoData: [],
               more: false
          })
          this.getVideoData();
          wx.stopPullDownRefresh(); //停止下拉元点
     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {
		console.log(!this.data.more)
          if (!this.data.more) {
               wx.showNavigationBarLoading();
               this.getVideoData();
          }
     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

	},

	// 获取总条数
     getCount() {
          wx.cloud.callFunction({
                    name: 'getCount',
                    data: {
                         db: "video"
                    }
               })
               .then(res => {
                    wx.setNavigationBarTitle({
                         title: `视频(${res.result.total})`
                    })
               })
     },
	
	// 获取数据导航
     getVideoData() {
          console.log("this.data.skip", this.data.skip)
          wx.cloud.callFunction({
                    name: "getCloud",
                    data: {
                         db: "video",
                         skip: this.data.skip, //条件限制，根据需要传参
                         limit: this.data.limit
                    }
               }).then(res => {
                    console.log(res)
                    let data = res.result.data
                    console.log(data)
                    //urls 用来接收查看图片集合
                    let urls = []
                    //判断返回条数
                    if (data.length === this.data.limit) {
                         this.setData({
                              skip: this.data.skip + this.data.limit
                         })
                    } else {
                         //more=true 没有数据啦
                         this.setData({
                              more: true
                         })
                    }
                    let videoList = this.data.videoList
                    if (videoList.length !== 0) {
                         //不是第一次获取 ES6 展开运算或数组拼接
                         //photoData.concat(data)
                         //[...photoData,...data]   
                         photoData = [...videoList, ...data]
                    } else {
                         //第一次直接赋值
                         videoList = data
                         urls = data.map(item => item.cloud)

                    }
                    console.log('videoList', videoList)

                    this.setData({
                         videoList,
                         hiddenLoading: true
                    })
                    wx.hideNavigationBarLoading()
                    // console.clear()
               })
               .catch(res => {
                    console.log(res)
                    wx.hideNavigationBarLoading()
               })

     },
     loadedmetaData(e){
          let direction=e.detail.width>e.detail.height?90:0
          this.videoContext = wx.createVideoContext('video'+this.data.videoIndex, this);
          this.videoContext.requestFullScreen({ direction: direction });
     },
    
     //播放视频
     playVideo(){
          wx.navigateTo({
               url:'./details'
          })
     },
	//原本没有upStatus这个字段，所以默认值为false
	upDown(event) {
		var index = event.currentTarget.dataset['index'];
		this.data.videoList[index].upStatus = !this.data.videoList[index].upStatus;
		this.setData({
			videoList: this.data.videoList
		})
	},
	
	//播放视频
	videoPlay(event) {
		var length = this.data.videoList.length;
          var index = event.currentTarget.dataset['index'];
		if (!this.data.videoIndex) { // 没有播放时播放视频
			this.setData({
				videoIndex: index
			})
			var videoContext = wx.createVideoContext('video' + index)
			videoContext.play()
		} else {
			//停止正在播放的视频
			var videoContextPrev = wx.createVideoContext('video' + this.data.videoIndex)
			videoContextPrev.stop()
			//将点击视频进行播放
			this.setData({
				videoIndex: index
			})
			var videoContextCurrent = wx.createVideoContext('video' + index)
			videoContextCurrent.play()
		}
	},

})