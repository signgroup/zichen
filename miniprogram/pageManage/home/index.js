// miniprogram/pageManage/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenLoading: false, //loading状态

    homeData: [], //首页菜单数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeData()
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

  // 获取数据
  getHomeData() {
    wx.cloud.callFunction({
        name: "getCloud",
        data: {
          db: "home_nav"
        }
      }).then(res => {
        console.log(res)
        let homeData = res.result.data


        this.setData({
          homeData,
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
  switchChange(e) {
    console.log(e.detail.value)
    let {
      item
    } = e.currentTarget.dataset
    console.log(item)
    wx.cloud.callFunction({
        name: 'updateCloud',
        data: {
          db: "home_nav",
          id: item._id,
          params: {
            state:e.detail.value,
          }
        }
      })
      .then(res => {
        console.log(res.result)
        this.getHomeData()
      })
  }
})