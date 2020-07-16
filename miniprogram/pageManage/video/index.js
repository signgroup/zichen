const app = getApp()
Page({
     data: {
          optionsListData: [],
          movableViewPosition: {
               x: 0,
               y: 0,
               className: "none",
               data: {}
          },
          scrollPosition: {
               everyOptionCell: 65,
               top: 47,
               scrollTop: 0,
               scrollY: true,
               scrollViewHeight: 1000,
               scrollViewWidth: 375,
               windowViewHeight: 1000,
          },
          selectItemInfo: {
               sName: "",
               sDtSecCode: "",
               sCode: "",
               selectIndex: -1,
               selectPosition: 0,
          },
     },
     bindscroll: function (event) {
          var scrollTop = event.detail.scrollTop;
          this.setData({
               'scrollPosition.scrollTop': scrollTop
          })
     },
     getOptionInfo: function (code) {
          for (var i = 0, j = this.data.optionsListData.length; i < j; i++) {
               var optionData = this.data.optionsListData[i];
               if (optionData._id == code) {
                    optionData.selectIndex = i;
                    return optionData;
               }
          }
          return {};
     },
     getPositionDomByXY: function (potions) {
          var y = potions.y - this.data.scrollPosition.top + this.data.scrollPosition.scrollTop;
          var optionsListData = this.data.optionsListData;
          var everyOptionCell = this.data.scrollPosition.everyOptionCell;
          for (var i = 0, j = optionsListData.length; i < j; i++) {
               if (y >= i * everyOptionCell && y < (i + 1) * everyOptionCell) {
                    return optionsListData[i];
               }
          }
          return optionsListData[0];
     },
     draggleTouch: function (event) {
          var touchType = event.type;
          switch (touchType) {
               case "touchstart":
                    this.scrollTouchStart(event);
                    break;
               case "touchmove":
                    this.scrollTouchMove(event);
                    break;
               case "touchend":
                    this.scrollTouchEnd(event);
                    break;
          }
     },
     scrollTouchStart: function (event) {
          // console.log(event);
          var firstTouchPosition = {
               x: event.changedTouches[0].pageX,
               y: event.changedTouches[0].pageY,
          }
          console.log("firstTouchPosition:", firstTouchPosition);
          var domData = this.getPositionDomByXY(firstTouchPosition);
          console.log("domData:", domData);

          //movable-area滑块位置处理
          var movableX = 0;
          var movableY = firstTouchPosition.y - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2;

          this.setData({
               movableViewPosition: {
                    x: movableX,
                    y: movableY,
                    className: "",
                    data: domData
               }
          })

          var secCode = domData._id;
          var secInfo = this.getOptionInfo(secCode);
          secInfo.selectPosition = event.changedTouches[0].clientY;
          secInfo.selectClass = "dragSelected";

          this.data.optionsListData[secInfo.selectIndex].selectClass = "dragSelected";

          var optionsListData = this.data.optionsListData;

          this.setData({
               'scrollPosition.scrollY': false,
               selectItemInfo: secInfo,
               optionsListData: optionsListData,
               'scrollPosition.selectIndex': secInfo.selectIndex
          })
     },
     scrollTouchMove: function (event) {
          var selectItemInfo = this.data.selectItemInfo;
          var selectPosition = selectItemInfo.selectPosition;
          var moveDistance = event.changedTouches[0].clientY;
          var everyOptionCell = this.data.scrollPosition.everyOptionCell;
          var optionsListData = this.data.optionsListData;
          var selectIndex = selectItemInfo.selectIndex;

          // console.log("event.changedTouches:", event.changedTouches);
          //movable-area滑块位置处理
          var movableX = 0;
          var movableY = event.changedTouches[0].pageY - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2;


          this.setData({
               movableViewPosition: {
                    x: movableX,
                    y: movableY,
                    className: "",
                    data: this.data.movableViewPosition.data
               }
          })

          if (moveDistance - selectPosition > 0 && selectIndex < optionsListData.length - 1) {
               if (optionsListData[selectIndex].sDtSecCode == selectItemInfo.sDtSecCode) {
                    optionsListData.splice(selectIndex, 1);
                    optionsListData.splice(++selectIndex, 0, selectItemInfo);
                    selectPosition += everyOptionCell;
               }
          }

          if (moveDistance - selectPosition < 0 && selectIndex > 0) {
               if (optionsListData[selectIndex].sDtSecCode == selectItemInfo.sDtSecCode) {
                    optionsListData.splice(selectIndex, 1);
                    optionsListData.splice(--selectIndex, 0, selectItemInfo);
                    selectPosition -= everyOptionCell;
               }
          }

          this.setData({
               'selectItemInfo.selectPosition': selectPosition,
               'selectItemInfo.selectIndex': selectIndex,
               optionsListData: optionsListData,
          });
     },
     scrollTouchEnd: function (event) {
          console.log(event);
          var optionsListData = this.optionsDataTranlate(this.data.optionsListData, "");

          this.setData({
               optionsListData: optionsListData,
               'scrollPosition.scrollY': true,
               'movableViewPosition.className': "none"
          })
     },
     optionsDataTranlate: function (optionsList, selectClass) {
          for (var i = 0, j = optionsList.length; i < j; i++) {
               optionsList[i].selectClass = selectClass;
          }
          return optionsList;
     },
     onLoad: function () {
          this.getVideoData()
     },
     getVideoData() {
          wx.cloud.callFunction({
               name: "getCloud",
               data: {
                    db: "video",
                    orderBy: {
                         key: 'order',
                         value: 'desc'
                    },
                    skip: 0, //条件限制，根据需要传参
                    limit: 200
               }
          }).then(res => {
               console.log('res', res.result.data)
               let optionsList = this.optionsDataTranlate(res.result.data, "")
               let scrollViewHeight = app.globalData.systemInfo.windowHeight - 47;
               let scrollViewWidth = app.globalData.systemInfo.windowWidth;
               this.setData({
                    optionsListData: optionsList,
                    'scrollPosition.scrollViewWidth': scrollViewWidth,
                    'scrollPosition.scrollViewHeight': scrollViewHeight,
                    'scrollPosition.windowViewHeight': app.globalData.systemInfo.windowHeight,
               });
          })
     },
     //保存
     btnSave() {
          console.log(this.data.optionsListData)
          let ids = this.data.optionsListData.map(item => item._id)
          console.log(ids)

          wx.cloud.callFunction({
               name: "updateVideo",
               data: {
                    db: "video",
                    ids
               }
          }).then(res => {
               console.log('res', res)
               if (res.errMsg === 'cloud.callFunction:ok') {
                    wx.showToast({
                         title: '更新成功',
                    })
               } else {
                    wx.showToast({
                         title: '更新失败',
                    })
               }
          })
     },

     putOptionTop(e) {
          let {
               index
          } = e.currentTarget.dataset
          let optionsListData = this.data.optionsListData
          optionsListData.unshift(optionsListData.splice(index, 1)[0]);
          this.setData({
               optionsListData
          })


     },
     onShow: function () {
          // 页面显示
          console.log("onShow");

     },
     onReady: function () {
          // 页面渲染完成
          console.log("onReady");
     },
     onHide: function () {
          console.log(22);


          // 页面隐藏
          console.log("onHide");
     },
     onUnload: function () {
          // 页面关闭
          console.log("onUnload");
     },
});