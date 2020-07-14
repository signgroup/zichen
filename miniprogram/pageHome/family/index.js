// miniprogram/pageHome/family/index.js
const app=getApp()
Page({

     /**
      * 页面的初始数据
      */
     data: {
          hiddenLoading: false,
          statusBarHeight: app.globalData.systemInfo.statusBarHeight, //获取导航栏高度，x适配
          background:'',//动态渐变背景
          age:'',//年龄
          me:{},
          dad:{},
          mom:{},
          x: app.globalData.systemInfo.screenWidth - 70,
          y: app.globalData.systemInfo.screenHeight - 120,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          Promise.all([this.getAboutData(), this.getAge()])
          .then(res=>{
               console.log('res',res)
               this.setData({
                  hiddenLoading:true,
               })
          })
          this.randomNum()
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
     //获取年龄
     getAge(){
         return new Promise((resolve, reject) => {
          wx.cloud.callFunction({
               name: "getAge",
               data: {
                    date:'2018-11-11 23:11:00'
               }
               
          }).then(res => {
               console.log(res)
               let age=res.result
               this.setData({age})
               resolve(res)
             
          })
     })
     },
     //获取文本数据
     getAboutData(){
          return  new Promise((resolve, reject) => {
               wx.cloud.callFunction({
                    name: "getCloud",
                    data: {
                         db: 'about',
                    }
               }).then(res => {
                    let {me,dad,mom} =res.result.data[0]
                    this.setData({
                         me,dad,mom
                    })
                    resolve(res)
               })
             })
         
     },
     //随机背景
     randomNum() {
          const _random = (num = 0) => {
               return Math.ceil(Math.random() * num)
          }
          this.setData({
               background: `linear-gradient(to left bottom, hsl(${_random(255)}, 100%, 85%) 0%,hsl(${_random(255)}, 100%, 85%) 100%)`
          })
          this.timer = setInterval(() => {
               this.setData({
                    background:`linear-gradient(to left bottom, hsl(${_random(255)}, 100%, 85%) 0%,hsl(${_random(255)}, 100%, 85%) 100%)`
               })
              
          }, 5000)
     },

     //去往首页
     goHome(){
          wx.switchTab({
               url: '/pages/home/index'
          })
     }
})