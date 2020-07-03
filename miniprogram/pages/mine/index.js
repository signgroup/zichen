// pages/mine/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    avatarUrl: '//m.cloud.189.cn/downloadFile.action?fileStr=44D06D0CA9C33D329754033FA2E51C5A604F049360640D5C7BEFDFF1A5FF04F5BCEA2539EC90A33E5975CCEF17A09933162B4FB4936F95F0B6D98513&downloadType=1', //默认头像
    hiddenLoading: false, //loading是否隐藏
    userInfo: {}, //用户信息
    logged: false, //授权记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //文本安全检测
    wx.cloud.callFunction({
      name: "secCheck",
      data: {
        content: `ggg`,
      }
    }).then((res) => {
      console.log(res.result ?.error)
      if (res.result ?.error ?.errCode === 87014) {
        wx.showModal({
          title: '提示',
          content: '这是一个模态弹窗',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
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

  //跳转管理
  goManage(){
    wx.navigateTo({
      url: "./../../pageManage/album/index"
    })
  },
    // 用户授权登录
    onGetUserInfo: function(e) {
      console.log(e)
      if (!this.logged && e.detail.userInfo) {
        this.setData({
          logged: true,
          avatarUrl: e.detail.userInfo.avatarUrl,
          userInfo: e.detail.userInfo
        })
        console.log("this.data.openId", this.data.openId)
        console.log("e.detail.userInfo", e.detail.userInfo)
        
        this.addEditUsers(e.detail.userInfo)
        // this.getPersonalInfo(this.data.openId)
        app.globalData.userInfo = e.detail.userInfo
      }
    },
})