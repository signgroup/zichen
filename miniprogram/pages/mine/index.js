// pages/mine/index.js
const db = wx.cloud.database()

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'https://preview.cloud.189.cn/image/imageAction?param=1AE036D09F5874A19A8C9109D02471C084169C1AF18A4B12472FF70DD1BAC63436F5F463D1FEA6C2143215C5930B846CC2D74F14992D825DCFB76CAFD5FF584F3FC6AE644AAE02F17E920A2C7031C2B2B4FF2682813B80C2858A5955', //默认头像
    hiddenLoading: false, //loading是否隐藏
    userInfo: {}, //用户信息
    logged: false, //授权记录
    statusBarHeight: app.globalData.systemInfo.statusBarHeight, //获取导航栏高度，x适配
    users: [], //用户列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('statusBarHeight',this.data.statusBarHeight)
    console.log('onLoad', options)
    console.log('userInfo', app.globalData.userInfo )
    // 获取用户信息
    if (app.globalData.userInfo == undefined) {
      wx.getSetting({
        success: res => {
          console.log('onLoad-getSetting', res)
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log(res)
                this.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  logged: true,
                  userInfo: res.userInfo
                })
                this.addEditUsers(res.userInfo)
                app.globalData.userInfo = res.userInfo

              }
            })
          }
        }
      })
    } else {
      this.setData({
        logged: true,
        userInfo: app.globalData.userInfo
      })
      this.addEditUsers(app.globalData.userInfo)
    }
    this.getWatchUsers()

    // this.onGetOpenid()
    console.log(app.globalData)



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
  goManage() {
    wx.navigateTo({
      url: "./../../pageManage/manage/index"
    })
  },
  // 用户授权登录
  onGetUserInfo: function (e) {
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
  // 添加或修改用户信息
  addEditUsers(data) {
    console.log('data', data)
    wx.setStorage({
      key: "userInfo",
      data: data
    })
    wx.cloud.callFunction({
        name: 'login',
        data: {
          params: data
        },
      })
      .then(res => {
        //console.log(res.result.openid)
        this.setData({
          openid: res.result.openid
        })
        wx.setStorageSync('openId', res.result.openid);
        app.globalData.openId = res.result.openid
      })
      .catch(err => {
        console.log(err)
      })
  },

  // 退出登录
  loginOut() {
    var _this = this
    if (_this.data.logged) {
      wx.showModal({
        title: '提示',
        content: '退出登录',
        success: function (res) {
          if (res.confirm) {
            app.globalData.userInfo = {}
            wx.removeStorageSync('userInfo')
            wx.removeStorageSync('openId')
            _this.setData({
              userInfo: {},
              openid:'',
              avatarUrl: 'https://preview.cloud.189.cn/image/imageAction?param=1AE036D09F5874A19A8C9109D02471C084169C1AF18A4B12472FF70DD1BAC63436F5F463D1FEA6C2143215C5930B846CC2D74F14992D825DCFB76CAFD5FF584F3FC6AE644AAE02F17E920A2C7031C2B2B4FF2682813B80C2858A5955', //默认头像
              logged: false
            })
          }
        }
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请登录',
      })
    }

  },
  //获取用户
  getUsers() {
    wx.cloud.callFunction({
      name: "getCloud",
      data: {
        db: "users",
        orderBy: {
          key: 'currentTime',
          value: 'desc'
        },
        limit:3
      }
    }).then(res => {
      console.log(res.result.data)
      this.setData({
        users: res.result.data
      })
    })
  },

  //监听访客
  getWatchUsers() {
    let _this = this
    //orderBy不生效
     db.collection('users')
      .orderBy('currentTime', 'desc')
      .limit(3)
      .watch({
        onChange: function (snapshot) {
          console.log(snapshot)
          if (snapshot.type === 'init') {
            _this.setData({
              hiddenLoading: true
            })
          }
          _this.getUsers()
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
          _this.setData({
            hiddenLoading: true
          })
        }
      })
      
  },
})