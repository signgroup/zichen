// pageHome/album/index.js
const app = getApp();

Page({

     /**
      * 页面的初始数据
      */
     data: {
          hiddenLoading: false, //loading状态
          imgType: "", //tab选择类型,照片类型class
          tabData: [{
               word: ["大", "图"],
               type: "large"
          }, {
               word: ["小", "图"],
               type: "small"
          }, {
               word: ["宫", "格"],
               type: "grid"
          }], //图片类型切换数据
          photoData: [], //照片数据
          urls: [], //存放图片url集合['http','http','http']
          skip: 0, //分页开始取值
          limit: 20, //在小程序端默认及最大上限为 20，在云函数端默认及最大上限为 1000
          more: false, //没有更多数据
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          let imgType = app.globalData.imgType ? app.globalData.imgType : "large"
          this.setData({
               imgType
          })

          this.getCount()

          this.getPhotoData()


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
          this.getPhotoData();
          wx.stopPullDownRefresh(); //停止下拉元点
     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {
          console.log(!this.data.more)
          if (!this.data.more) {
               wx.showNavigationBarLoading();
               this.getPhotoData();
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
                         db: "photo"
                    }
               })
               .then(res => {
                    wx.setNavigationBarTitle({
                         title: `照片(${res.result.total})`
                    })
               })
     },
     // 获取数据导航
     getPhotoData() {
          console.log("this.data.skip", this.data.skip)
          wx.cloud.callFunction({
                    name: "getCloud",
                    data: {
                         db: "photo",
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
                    let photoData = this.data.photoData
                    if (photoData.length !== 0) {
                         //不是第一次获取 ES6 展开运算或数组拼接
                         //photoData.concat(data)
                         //[...photoData,...data]   
                         photoData = [...photoData, ...data]
                         urls = [...this.data.urls, ...data.map(item => item.cloud)]
                    } else {
                         //第一次直接赋值
                         photoData = data
                         urls = data.map(item => item.cloud)

                    }
                    console.log('photoData', photoData)

                    this.setData({
                         photoData,
                         urls,
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
     /**
      * 大小图切换
      * type
      * large 大图
      * small 小图
      * grid  宫格
      * 
      */
     switchImg(e) {
          const imgType = e.currentTarget.dataset.type
          if (imgType === this.data.imgType) return;
          app.globalData.imgType = imgType
          this.setData({
               imgType
          })
     },
     //图片懒加载
     onLazyLoad(e) {
          // console.log(e)
          if (e.detail.width) {
               this.data.photoData[e.currentTarget.dataset.index].load = true
               setTimeout(() => {
                    this.setData({
                         photoData: this.data.photoData
                    })
               }, 300);
          }
     },
     //图片查看
     previewImage: function (e) {
          wx.previewImage({
               current: e.currentTarget.dataset.cloud, //当前图片地址
               urls: this.data.urls, //所有要预览的图片的地址集合 数组形式
               success: function (res) {
                    console.log("success", res)
               },
               fail: function (res) {},
               complete: function (res) {},
          })
     },


})