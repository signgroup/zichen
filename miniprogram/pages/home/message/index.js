import util from './../../../utils/index'

const app = getApp()

const db = wx.cloud.database()
const mb = db.collection('message')
Page({

     /**
      * 页面的初始数据
      */
     data: {
          content: '',
          paging: 20,
          messageList: [],
          isNotData: false,
          isGetAllList: true,
          voteArr: [],
          currentTime: 60,
          disabled: false,
          textFocus: true,
          timer: null,
          firstRender: true,
          textNum: 0,
          loading: true,
          StatusBar: app.globalData.StatusBar,
          CustomBar: app.globalData.CustomBar,
          Custom: app.globalData.Custom,
          hiddenLoading: false,
          state: false,
          isLoad: false, //下拉加载状态
          replyState: true,
          replyPlace: '爱评论的人比较有修养！',
          inputDisabled: false,
          inputContent: '',
          currentMessage: {},
          messageId: '',
          replyIndex: -1,
          replyType: '',
          openid: wx.getStorageSync('openId'),
          examineState:false,
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.getState()
          this.getCount()
          this.messageQuery()


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
          console.log("进入程序")
          wx.showNavigationBarLoading();
          this.setData({
               firstRender: true,
               paging: 20
          });
          // this.messageQuery()
          //小程序后台后继续根据时间戳比较倒计时--非第一次
          if (app.globalData.nts) {
               var ts = new Date().getTime(); //获取当前时间戳--非第一次
               console.log('onshow ts', ts)
               if (app.globalData.nts > ts) {
                    var ts_diff = app.globalData.nts - ts;
                    console.log(parseInt(ts_diff / 1000))
                    this.setData({
                         currentTime: parseInt(ts_diff / 1000)
                    })
                    this.interval();
               } else {
                    clearInterval(this.timer)
                    this.setData({
                         currentTime: 60,
                         disabled: false
                    })
               }
          }
     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {
          console.log('进入后台')
          if (this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
               clearInterval(this.timer); //关闭
          }
     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload() {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {
          wx.showLoading({
               title: '加载中…',
          })
          wx.showNavigationBarLoading();
          this.setData({
               paging: 20,
               isLoad: false,
               isGetAllList: true,
               isNotData: false,
               messageTimer: null
          })
          this.messageQuery();
          wx.stopPullDownRefresh(); //停止下拉元点
          wx.hideLoading();
     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {
          if (!this.data.isNotData) {
               wx.showNavigationBarLoading()
               var temp = []
               console.log(this.data.paging)
               mb.skip(this.data.paging)
                    .limit(20)
                    .orderBy('date', 'desc')
                    .get()
                    .then(res => {
                         console.log(res)

                         wx.hideNavigationBarLoading();
                         if (res.data.length) {
                              for (var i = 0; i < res.data.length; i++) {
                                   var tempTopic = res.data[i];
                                   this.data.messageList.push(tempTopic);
                              }
                              console.log(this.data.messageList)
                              this.setData({

                                   messageList: this.data.messageList,
                                   paging: this.data.paging + 20
                              })
                         } else {
                              this.setData({
                                   isLoad: true,
                                   isGetAllList: false,
                                   isNotData: true
                              })

                         }

                    })
                    .catch(
                         wx.hideNavigationBarLoading()
                    )
          }

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     },

     //获取留言状态
     getState(){
          wx.cloud.callFunction({
               name: 'getCloud',
               data: {
                    db: "all_state"
               }
          })
          .then(res => {
               console.log(res.result.data[0].status)
               this.setData({
                    examineState:res.result.data[0].status
               })
          })
     },
     // 获取总条数
     getCount() {
          wx.cloud.callFunction({
                    name: 'getCount',
                    data: {
                         db: "message"
                    }
               })
               .then(res => {
                    wx.setNavigationBarTitle({
                         title: `我的留言(${res.result.total})`
                    })
               })
     },
     //获取文本域内容
     bindTextArea: function (e) {
          this.setData({
               content: e.detail.value,
               textNum: e.detail.value.length
          })
          console.log(e.detail.value)
          console.log(e.detail.value.length)
     },



     //添加留言内容
     addMessage() {

          let params = {
               content: this.data.content,
               state: this.data.examineState,
               openId: wx.getStorageSync('openId'),
               userInfo: wx.getStorageSync('userInfo'),
               date: util.formatTime(new Date())
          }
          console.log('params',params)

          wx.cloud.callFunction({
                    name: 'addCloud',
                    data: {
                         db: "message",
                         params: params
                    }
               })
               .then(res => {
                    console.log(res)
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                         title: '留言成功',
                    })
                    this.messageQuery();
                    this.setData({
                         firstRender: true,
                         isLoad: false,
                         paging: 20,
                         content: '',
                         textNum: 0
                    })
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res)
                    let nt = new Date(); //定义一个新时间
                    let nts = nt.setTime(new Date().getTime() + 1000 * 60); //设置新时间比旧时间多一分钟
                    console.log('nts', nts)
                    app.globalData.nts = nts;
                    //留言倒计时
                    this.interval();
                    wx.showNavigationBarLoading();
                    this.pushSubscribeMessage(params)
               })
               .catch(err => {
                    wx.hideToast();
                    wx.hideNavigationBarLoading();
                    wx.showToast({
                         icon: 'none',
                         title: '新增记录失败'
                    });
                    console.error('[数据库] [新增记录] 失败：', err);
               })


     },



     //提交留言
     showTopTips: function () {
          let storageUserInfo = wx.getStorageSync('userInfo')
          let storageOpenId = wx.getStorageSync('openId')

          if (!this.data.content.trim()) {
               wx.showToast({
                    icon: 'none',
                    title: '留言为空'
               });
               this.setData({
                    textFocus: true
               });
          } else if (storageUserInfo && storageOpenId) {
               console.log('this.data.content', this.data.content.trim());
               //防止新增时点击多次
               this.setData({
                    disabled: true
               });
               let _this = this
               let cheResult = _this.checkoutText(_this.data.content.trim())
               cheResult.then((res) => {
                    if (res ?.error ?.errCode === 87014) {
                         console.log('敏感')
                         wx.showModal({
                              content: '内容含有违法违规内容',
                              showCancel: false,
                              success: function (res) {
                                   if (res.confirm) {
                                        console.log('用户点击确定')
                                        _this.setData({
                                             disabled: false
                                        });

                                   }
                              }
                         });
                    } else {
                         _this.addMessage()
                    }
               })

          } else {
               wx.showModal({
                    content: '留言失败，请先授权登录',
                    showCancel: false,
                    success: function (res) {
                         if (res.confirm) {
                              console.log('用户点击确定')
                              wx.switchTab({
                                   url: '../../pages/mine/index'
                              })
                         }
                    }
               });
          }

     },
     //文本安全检测
     checkoutText(content) {
          return new Promise(function (reslove, reject) {
               wx.cloud.callFunction({
                         name: "secCheck",
                         data: {
                              content: content,
                         }
                    }).then((res) => {
                         reslove(res.result)
                    })
                    .catch(err => {
                         return (reject(err))
                    })
          })
     },


     //留言倒计时
     interval() {
          let _this = this;
          var currentTime = _this.data.currentTime;

          _this.timer = setInterval(function () {
               _this.setData({
                    currentTime: currentTime - 1
               })
               currentTime--;
               // console.log(currentTime)
               if (currentTime <= 0) {
                    clearInterval(_this.timer)
                    _this.setData({
                         currentTime: 60,
                         disabled: false
                    })
               } else {
                    _this.setData({
                         disabled: true
                    })
               }
          }, 1000)
     },


     //消息列表查询---前10条
     messageQuery() {
          mb.limit(20)
               //  .where({
               //    state: false
               //  })
               .orderBy('date', 'desc')
               .get()
               .then(res => {
                    console.log(res)
                    if (this.data.firstRender) {
                         this.setData({
                              firstRender: !this.data.firstRender
                         });
                    } else {
                         wx.hideToast();
                    }
                    wx.hideNavigationBarLoading();

                    if (res.data.length) {
                         if (res.data.length < 10) {
                              this.setData({
                                   isLoad: true,
                                   isGetAllList: false,
                                   isNotData: true,
                              })
                         }
                         const newData = res.data.map(item => {
                              item.date = util.formatTime(item.date)
                              return item
                         })
                         console.log(newData)
                         this.setData({
                              messageList: newData,
                              loading: false,
                              hiddenLoading: true
                         })
                    } else {
                         this.setData({
                              isLoad: true,
                              messageList: [],
                              isGetAllList: false,
                              loading: false,
                              isNotData: true,
                              hiddenLoading: true
                         })

                    }

               })
               .catch(err => {
                         console.log(err)
                         wx.hideToast();
                         wx.hideNavigationBarLoading();
                         wx.hideLoading();
                    }


               )
     },

     //文字展开隐藏
     bindOverflow(e) {
          const data = this.data.messageList
          console.log(e.currentTarget.dataset.index)
          const {
               index,
               type,
               replyindex
          } = e.currentTarget.dataset
          if (type === 'reply') {
               console.log(replyindex)
               data[index].reply[replyindex].overflow = !data[index].reply[replyindex].overflow
          } else {
               data[index].overflow = !data[index].overflow
          }

          this.setData({
               messageList: data
          })
     },
     //删除留言
     onRemove: function (counterId) {
          wx.showNavigationBarLoading()
          if (counterId) {
               wx.cloud.callFunction({
                         name: 'removeCloud',
                         data: {
                              db: "message",
                              _id: counterId
                         }
                    })
                    .then(res => {
                         console.log(res)
                         if (res.result.res.stats.removed == 1) {
                              wx.showToast({
                                   title: '删除成功',
                              });
                              this.setData({
                                   paging: 20
                              });
                              this.messageQuery();
                         }
                         wx.hideNavigationBarLoading()
                    })
                    .catch(err => {
                         wx.showToast({
                              icon: 'none',
                              title: '删除失败',
                         });
                         console.error('[云函数] [删除记录] 失败：', err);
                         wx.hideNavigationBarLoading()

                    })
          } else {
               wx.showToast({
                    title: '无记录可删，请见创建一个记录',
               })
          }
     },
     //删除回复
     onRemoveReply(counterId, data) {
          console.log(counterId)
          console.log(data)
          if (counterId) {
               wx.cloud.callFunction({
                         name: 'removeReply',
                         data: {
                              id: counterId,
                              places: {
                                   openId: data.openId,
                                   date: data.date,
                                   content: data.content
                              }
                         }
                    })
                    .then(res => {
                         console.log(res)
                         if (res.result.stats.updated == 1) {
                              wx.showToast({
                                   title: '删除成功',
                              });

                         } else {
                              wx.showToast({
                                   title: '当前留言不存在或已被删除',
                              });
                         }
                         this.setData({
                              paging: 20
                         });
                         this.messageQuery();
                         wx.hideNavigationBarLoading()
                    })
                    .catch(err => {
                         wx.showToast({
                              icon: 'none',
                              title: '删除失败',
                         });
                         console.error('[云函数] [删除记录] 失败：', err);
                         wx.hideNavigationBarLoading()

                    })
          } else {
               wx.showToast({
                    title: '无记录可删，请见创建一个记录',
               })
          }
     },

     //底部弹出
     bottomOpen: function (e) {
          console.log(e)
          let id = e.currentTarget.dataset.id;
          let item = e.currentTarget.dataset.item;

          if (item.openId === wx.getStorageSync('openId') || wx.getStorageSync('openId') == 'ozh_944fCkNgPWzcHuErfsHCtG1k') {
               let _this = this;
               wx.showActionSheet({
                    itemList: ['删除'],
                    success: function (res) {
                         console.log('res', res);
                         _this.onRemove(id);
                    }
               });
          }
          // (global_openId == 'ozh_944fCkNgPWzcHuErfsHCtG1k') 

     },

     //推送
     pushSubscribeMessage(params) {
          const templateId = '-rej8CUBzdB6cA8dJw0W1SZQObZJziDqFL4v8lnujBk'; // 订阅消息模版id
          wx.cloud.callFunction({
                    name: 'pushCloud',
                    data: {
                         page: '/pageHome/message/index',
                         params: {
                              name1: {
                                   value: params.userInfo.nickName || '未知' //留言人
                              },
                              thing2: {
                                   value: params.content //留言内容
                              },
                              time3: {
                                   value: params.date //留言时间
                              }
                         },
                         templateId: templateId,
                         state: 'developer'
                    }
               })
               .then(res => {
                    console.log('push', res)
               })
     },


     // 监听滚动条当前位置
     onPageScroll: function (e) {
          // console.log(e)
          if (e.scrollTop > 400) {
               this.setData({
                    topStatus: true
               });
          } else {
               this.setData({
                    topStatus: false
               });
          }
     },
    
     //管理员删除
     mangeDelete(e) {
          const {
               item,
               id,
               type
          } = e.currentTarget.dataset;
          let _this = this
          wx.showActionSheet({
               itemList: ['删除'],
               success: function (res) {
                    console.log('res', res);
                    if (type === 'reply') {
                         _this.onRemoveReply(id, item)
                    } else {
                         _this.onRemove(id);
                    }
               }
          });
     },
     //显示评论输入框
     replyOpen(e) {
          const {
               item,
               id,
               type,
               index
          } = e.currentTarget.dataset;
          // console.log('item',item)
          // console.log('id',id)
          // console.log('type',type)
          // console.log('index',index)
          if (wx.getStorageSync('openId')) {
               if (item.openId === wx.getStorageSync('openId')) {
                    let _this = this;
                    wx.showActionSheet({
                         itemList: ['删除'],
                         success: function (res) {
                              console.log('res', res);
                              if (type === 'reply') {
                                   _this.onRemoveReply(id, item)
                              } else {
                                   _this.onRemove(id);
                              }
                         }
                    });
               } else {
                    this.setData({
                         replyIndex: index,
                         replyType: type,
                         messageId: id,
                         replyState: false,
                         replyPlace: `回复${item.userInfo.nickName}`,
                         currentMessage: item
                    })
               }
          } else {
               this.setData({
                    replyState: false,
                    inputDisabled: true,
                    replyPlace: '请登录'
               })
          }

     },
     //隐藏评论输入框
     replyClose() {
          this.setData({
               replyState: true
          })
     },
     //获取评论内容
     bindInput(e) {
          // console.log(e.detail.value)
          let inputContent = e.detail.value
          this.setData({
               inputContent
          })
     },
     //评论提交
     replySubmit() {
          console.log('提交')

          const {
               replyType,
               replyIndex,
               currentMessage,
               messageId
          } = this.data


          let params = {
               content: this.data.inputContent,
               state: this.data.examineState,
               date: util.formatTime(new Date()),
               openId: wx.getStorageSync('openId'),
               userInfo: wx.getStorageSync('userInfo')
          }
          if (replyType === 'reply') {
               params.replyName = currentMessage.userInfo.nickName
          }
          console.log('data', currentMessage)
          console.log('params', params)
          console.log('replyType', replyType)
          console.log('replyIndex', replyIndex)
          console.log('messageId', messageId)




          let _this = this
          let cheResult = _this.checkoutText(_this.data.inputContent.trim())
          cheResult.then((res) => {
               if (res ?.error ?.errCode === 87014) {
                    console.log('敏感')
                    wx.showModal({
                         content: '内容含有违法违规内容',
                         showCancel: false,
                         success: function (res) {
                              if (res.confirm) {
                                   console.log('用户点击确定')
                                   _this.setData({
                                        disabled: false
                                   });

                              }
                         }
                    });
               } else {
                    wx.cloud.callFunction({
                              name: 'messageReplay',
                              data: {
                                   id: messageId,
                                   params: params,
                                   sort: replyType === 'reply' ? replyIndex : -1
                              }
                         })
                         .then(res => {
                              console.log(res.result)
                              _this.messageQuery();
                              _this.setData({
                                   inputContent: ''
                              })
                         }).catch((err) => {
                              _this.setData({
                                   inputContent: ''
                              })
                         })
               }
          })




     },

})