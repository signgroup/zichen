// pageMine/manage/index.js
const app = getApp()
let x, y, x1, y1, x2, y2;

Page({

     /**
      * 页面的初始数据
      */
     data: {
          statusBarHeight: app.globalData.systemInfo.statusBarHeight, //获取导航栏高度，x适配
          hiddenLoading: false, //loading是否隐藏
          appList: [
              
          ],

     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {

          this.getManageApp()
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

      //图片懒加载
      onLazyLoad(e) {
          // console.log(e)
          if (e.detail.width) {
               this.data.appList[e.currentTarget.dataset.index].load = true
               setTimeout(() => {
                    this.setData({
                         appList: this.data.appList
                    })
               }, 300);
          }
     },
//获取图标数据
     getManageApp(){
          wx.cloud.callFunction({
               name: "getCloud",
               data: {
                    db: "manage_app"
               }
          }).then(res => {
               console.log(res.result.data)

               this.setData({
                    hiddenLoading: true,
                    appList:res.result.data
               })


          })
     },

     //消息订阅
     subMsg() {
          const templateId = '-rej8CUBzdB6cA8dJw0W1SZQObZJziDqFL4v8lnujBk'; // 订阅消息模版id
          wx.requestSubscribeMessage({
               tmplIds: [templateId],
               success(res) {
                    console.log(res)
                    if (res[templateId] == 'accept') {
                         //用户同意了订阅，允许订阅消息
                         wx.showToast({
                              title: '订阅成功'
                         })
                    } else {
                         //用户拒绝了订阅，禁用订阅消息
                         wx.showToast({
                              title: '订阅失败'
                         })
                    }
               },
               fail(res) {
                    console.log(res)
               },
               complete(res) {
                    console.log(res)
               }
          })
     },

     //点击跳转

     jumpClick(e) {
          let {
               item
          } = e.currentTarget.dataset
          if (item.type === 1) {
               if (item.state === 'tab') {
                    wx.switchTab({
                         url: item.url
                    })
               } else {
                    wx.navigateTo({
                         url: item.url
                    })
               }
          } else {
               this.subMsg()
          }
     },

})