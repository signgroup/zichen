// miniprogram/pageMine/visitor/index.js
import util from './../../utils/index'
Page({
     /**
      * 页面的初始数据
      */
     data: {
          userData: [], //用户数据
          skip: 0, //分页开始取值
          limit: 100, //在小程序端默认及最大上限为 20，在云函数端默认及最大上限为 1000
          more: false, //没有更多数据
          triggered: false, //自定义下拉状态
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.getUsers()
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
          wx.showNavigationBarLoading();
          this.setData({
               skip: 0,
               userData: [],
               more: false
          })
          this.getUsers();
          wx.stopPullDownRefresh(); //停止下拉元点
     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {
          console.log(!this.data.more)
          if (!this.data.more) {
               wx.showNavigationBarLoading();
               this.getUsers();
          }
     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     },
     //获取用户
     getUsers() {
          console.log("this.data.skip", this.data.skip)
          wx.cloud.callFunction({
                    name: "getCloud",
                    data: {
                         db: "users",
                         orderBy: {
                              key: 'currentTime',
                              value: 'desc'
                         },
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
                    let userData = this.data.userData
                    if (userData.length !== 0) {
                         //不是第一次获取 ES6 展开运算或数组拼接
                         //userData.concat(data)
                         //[...userData,...data]   
                         userData = [...userData, ...data]
                    } else {
                         //第一次直接赋值
                         userData = data
                         urls = data.map(item => item.cloud)

                    }
                    console.log('userData', userData)

                    this.setData({
                         userData,
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
     handelUserInfo(e) {
          let {
               item
          } = e.currentTarget.dataset
          console.log(item)
          let date = util.formatTime(item.currentTime)
          wx.showToast({
               title: `${item.userInfo.nickName}\r\n${date}`,
               icon: 'none',
               mask: true
          })
     }
})