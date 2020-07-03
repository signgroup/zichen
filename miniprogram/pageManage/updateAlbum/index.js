// pageHome/album/index.js
const app = getApp();

Page({

     /**
      * 页面的初始数据
      */
     data: {
          hiddenLoading: false, //loading状态
          albumData: {}, //详情
          btnLoading: false, //按钮loading
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.getImage(options.id)
     },

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {},

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {},

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {},

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {

     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     },
     //获取输入内容
     handelInput(e) {
          let value = e.detail.value.trim()
          let type = e.currentTarget.dataset.type
          this.data.albumData[type] = value
          this.setData({
               albumData: this.data.albumData
          })
     },
     getImageInfo(data) {
          wx.getImageInfo({
               src: data.cloud,
               success: function (res) {
                    console.log(res)
               }
          })
     },

     //查看图片详情
     getImage(id) {
          console.log('id', id)
          wx.cloud.callFunction({
               name: "getCloud",
               data: {
                    db: "photo",
                    doc: id
               }
          }).then(res => {
               console.log(res.result.data)
               this.setData({
                    albumData: res.result.data,
                    hiddenLoading: true
               })
               this.getImageInfo(res.result.data)
          })
     },
     //图片懒加载
     onLazyLoad(e) {
          // console.log(e)
          if (e.detail.width) {
               this.data.albumData.load = true
               setTimeout(() => {
                    this.setData({
                         albumData: this.data.albumData
                    })
               }, 300);
          }
     },

     //图片查看
     previewImage: function (e) {
          let url = e.currentTarget.dataset.url
          console.log(url)
          if (url) {
               wx.previewImage({
                    current: url, //当前图片地址
                    urls: [url], //所有要预览的图片的地址集合 数组形式
                    success: function (res) {
                         console.log("success", res)
                    },
                    fail: function (res) {},
                    complete: function (res) {},
               })
          }

     },
     //修改图片
     btnUpdate() {
          console.log(this.data.albumData)
          let data = this.data.albumData
          this.setData({
               btnLoading: true
          })
          wx.showNavigationBarLoading()
          wx.cloud.callFunction({
                    name: 'updateCloud',
                    data: {
                         db: "photo",
                         id: data._id,
                         params: {
                              title: data.title,
                              src: data.src
                         }
                    }
               })
               .then(res => {
                    if (res.result.res.stats.updated === 1) {
                         wx.showToast({
                              title: '修改成功',
                              icon: 'success',
                              duration: 2000
                         })
                    }
                    this.setData({
                         btnLoading: false
                    })
                    wx.hideNavigationBarLoading()
               }).catch(err => {
                    this.setData({
                         btnLoading: false
                    })
                    wx.hideNavigationBarLoading()

               })
     }


})