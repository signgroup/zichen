// pageHome/album/index.js
const app = getApp();

Page({

     /**
      * 页面的初始数据
      */
     data: {
          hiddenLoading: true, //loading状态
          filePath: [], //临时路径
          btnLoading:false,//按钮loading
          iconCamera: "https://preview.cloud.189.cn/image/imageAction?param=532E7935E24A046BC6DEDBA3D73D304B41001810F6D3D7AB98E3182007787D72DAB44AA3AF53C47273269F9D8F9002637E60D6463CFA533D2E8978FB301ABA20481DCC3FF004A9BAA71B9224591C839072D793F055DF50A9D60D21F5", //相机icon
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {},

     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {},

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
     //查看图片
     previewImage: function (e) {
          const url = e.currentTarget.dataset.url;
          wx.previewImage({
               current: url, //当前图片地址
               urls: this.data.filePath, //所有要预览的图片的地址集合 数组形式
               success: function (res) {},
               fail: function (res) {},
               complete: function (res) {},
          })
     },
     //添加图片
     chooseImage: function (e) {
          var that = this;
          wx.chooseImage({
               count: 9,
               sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
               sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
               success: function (res) {
                    // 本地文件路径filePath
                    const filePath = res.tempFilePaths;
                    //生成时间戳
                    let currentTime = new Date().getTime();
                    //云存储图片名字
                    let cloudPath = filePath.map((item, index) => 'img_photo_' + currentTime + index + filePath[index].match(/\.[^.]+?$/)[0])
                    console.log('cloudPath', cloudPath)
                    console.log('filePath', filePath)
                    that.setData({
                         cloudPath: cloudPath,
                         filePath: filePath
                    });
               }
          })
     },

     //添加相片记录
     addPhoto(fileID) {

          let params = {
               title: '',
               cloud: fileID,
               src: '',
               abbreviation: ''
          }

          wx.cloud.callFunction({
                    name: 'addCloud',
                    data: {
                         db: "photo",
                         params: params
                    }
               })
               .then(res => {
                    console.log(res)
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                         title: '上传成功',
                    })
                    this.setData({
                         btnLoading:false,
                         filePath:[],
                         cloudPath:[]

                    })
               })
               .catch(err => {
                    console.log(err)
               })


     },

     //提交-添加图片
     handleConfirm: function () {
          this.setData({
               btnLoading:true
          })
          wx.showNavigationBarLoading();
          wx.showLoading({
               title: '正在上传',
          })
          if (this.data.cloudPath) {


               const uploadFile = async (item, index) => {
                    console.log(index)
                    await wx.cloud.uploadFile({
                         cloudPath: 'album/photo/hundred/' + cloudPath[index], //云存储图片名字
                         filePath: item, //临时路径
                         success: res => {
                              console.log('[上传文件] 成功：', res)
                             
                              this.addPhoto(res.fileID)
                         },
                         fail: e => {
                              console.error('[上传图片] 失败：', e)
                         },
                         complete: () => {

                         }
                    });
               }

               let filePath = this.data.filePath
               let cloudPath = this.data.cloudPath
               filePath.map((item, index) => uploadFile(item, index))

          }

     },

})