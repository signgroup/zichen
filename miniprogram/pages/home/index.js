const db = wx.cloud.database()
// pages/home/index.js
wx.cloud.init({
     env: 'zichen'
})
Page({

     /**
      * 页面的初始数据
      */
     data: {
          hiddenLoading: false,
          homeNavData: [
               // {"_id":"GW1GFskXiocmddV8qUoRGRsjBh2DFdPiyibIlDnryBTHqA28","name":"我的1","path":"/","state":true},{"_id":"icyRiCa0JwrCofLCm0H3pNiXIDslKZJUXwmQ7sE3gRn7jJ77","name":"我的2","path":"/","state":true},{"_id":"l5IG5Ny76JyDvhcx1k9HteGA9rsSuGJyZ3JK4U0ykPCKO5hs","name":"我的3","path":"/","state":true},{"_id":"ka7kTYo0w8u1Xtyo9eXYNyvC6wvOrchGjBsjBVjeTJ70QR2h","name":"我的4","path":"/","state":true},{"_id":"XX531cRTvfIMg7mawfiZCkZCDqmr9qWsZqIGOXKcY9spMGsJ","name":"我的5","path":"/","state":false},{"_id":"XeMsYHJk73dyiU6LHtS3RCYcDOOwcXiGsOiFG0pm6dBRVU0C","name":"我的6","path":"/","state":true}
          ],
          sceneData:"--hue-1: 100; --hue-2: 147; --hue-3: 219; --alpha-1: 0.13109462719449483; --alpha-2: 0.4809489268013014; --alpha-3: 0.5875160443609215; ",
          startData: [
               "--size: 1.4847320631544942; --x: 44.86773252221434; --y: 66.20778986980615; --duration: 10; --delay: 6;",
               "--size: 0.10856500239837086; --x: 43.18656067723086; --y: 49.92219363368697; --duration: 6; --delay: 7;",
               "--size: 0.6663391888967531; --x: 63.28667233251348; --y: 15.343032400959; --duration: 10; --delay: 5;",
               "--size: 1.7832948236723585; --x: 52.30018127212666; --y: 39.58393689086503; --duration: 10; --delay: 4;",
               "--size: 0.8268868343375111; --x: 23.89040486197045; --y: 82.17185753770508; --duration: 8; --delay: 10;",
               "--size: 0.5131788106414255; --x: 3.595218474459805; --y: 15.98117808517532; --duration: 10; --delay: 10;",
               "--size: 1.5255711097608828; --x: 82.44683690724833; --y: 70.77575644419025; --duration: 10; --delay: 7;",
               "--size: 0.6383565092145997; --x: 37.27748794857069; --y: 78.30840082099455; --duration: 8; --delay: 10;",
               "--size: 0.2301547884397963; --x: 73.24378947395394; --y: 29.13626218276646; --duration: 10; --delay: 6;",
               "--size: 1.8450510455166658; --x: 9.191050293801851; --y: 1.8550256094036932; --duration: 6; --delay: 6;",
               "--size: 0.6185400719959486; --x: 37.697212436032146; --y: 90.30803315925304; --duration: 9; --delay: 4;",
               "--size: 1.3682361350001906; --x: 27.150293837058804; --y: 94.79196543961488; --duration: 5; --delay: 8;",
               "--size: 0.056114746203097976; --x: 20.508458125575004; --y: 89.22121100009683; --duration: 6; --delay: 5;",
               "--size: 1.9687192642244233; --x: 73.05334835572874; --y: 70.81089066666175; --duration: 5; --delay: 4;",
               "--size: 0.01835946456355897; --x: 18.426856610483867; --y: 40.57370028893696; --duration: 8; --delay: 4;",
               "--size: 1.279434467557231; --x: 86.77881775531064; --y: 40.17503616583311; --duration: 10; --delay: 6;",
               "--size: 1.7241576911702525; --x: 21.12680156926117; --y: 82.91919821019033; --duration: 5; --delay: 4;",
               "--size: 1.7200374999340116; --x: 99.52986342373748; --y: 49.25959838966383; --duration: 5; --delay: 7;",
               "--size: 0.715660546067157; --x: 48.133869035224805; --y: 25.879324827772532; --duration: 6; --delay: 6;",
               "--size: 1.4679564771652776; --x: 4.53302704830989; --y: 48.3505387819535; --duration: 6; --delay: 8;",

          ],
          lightData:[
               "--duration: 12; --delay: 10; --x: 1; --y: 7; --scale: 0.07921118959700538;",
		"--duration: 12; --delay: 9; --x: 3; --y: 0; --scale: 0.04309716319846633;",
		"--duration: 10; --delay: 4; --x: 1; --y: 1; --scale: 0.0557277177330812;",
		"--duration: 9; --delay: 4; --x: 0; --y: 3; --scale: 0.09377321963757435;",
		"--duration: 11; --delay: 8; --x: 5; --y: 1; --scale: 0.09187632481269452;",
		"--duration: 15; --delay: 8; --x: 4; --y: 1; --scale: 0.007688490105183976;",
		"--duration: 14; --delay: 6; --x: 1; --y: 4; --scale: 0.027509557443092757;",
		"--duration: 14; --delay: 10; --x: 0; --y: 4; --scale: 0.07100868705735805;",
		"--duration: 10; --delay: 9; --x: 5; --y: 8; --scale: 0.08685544578061577;",
		"--duration: 5; --delay: 4; --x: 5; --y: 9; --scale: 0.07327836438556286;",
		"--duration: 13; --delay: 8; --x: 5; --y: 2; --scale: 0.04715684885611047;",
		"--duration: 11; --delay: 5; --x: 4; --y: 8; --scale: 0.06736733078759569;",
		"--duration: 11; --delay: 6; --x: 0; --y: 5; --scale: 0.05132912295918035;",
		"--duration: 12; --delay: 7; --x: 2; --y: 2; --scale: 0.08327754286747684;",
		"--duration: 7; --delay: 9; --x: 2; --y: 1; --scale: 0.07740974418445934;",
		"--duration: 15; --delay: 5; --x: 4; --y: 10; --scale: 0.07208962978638875;",
		"--duration: 9; --delay: 6; --x: 2; --y: 8; --scale: 0.010963103754125436;",
		"--duration: 14; --delay: 7; --x: 4; --y: 5; --scale: 0.07514123946282121;",
		"--duration: 12; --delay: 9; --x: 4; --y: 7; --scale: 0.02915295831851481;",
		"--duration: 5; --delay: 7; --x: 1; --y: 4; --scale: 0.014061113409662207;",
		"--duration: 11; --delay: 4; --x: 4; --y: 8; --scale: 0.09935179432353788;",
		"--duration: 7; --delay: 10; --x: 1; --y: 2; --scale: 0.0316669651371986;",
		"--duration: 5; --delay: 8; --x: 0; --y: 2; --scale: 0.03878072766633252;",
		"--duration: 7; --delay: 8; --x: 4; --y: 0; --scale: 0.04731737227661679;",
		"--duration: 5; --delay: 6; --x: 3; --y: 2; --scale: 0.04004332746627228;",
		"--duration: 8; --delay: 9; --x: 3; --y: 1; --scale: 0.06148852366721251;",
		"--duration: 15; --delay: 5; --x: 5; --y: 10; --scale: 0.07254457165693358;",
		"--duration: 12; --delay: 10; --x: 3; --y: 8; --scale: 0.09704484059877645;",
		"--duration: 7; --delay: 9; --x: 1; --y: 3; --scale: 0.0055741895438983224;",
		"--duration: 9; --delay: 9; --x: 5; --y: 9; --scale: 0.040727917495630164;",
          ],

     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.getWatchHomeNav()
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
     //监听数据导航
     getWatchHomeNav() {
          let _this = this
          db.collection('home_nav')
          .watch({
               onChange: function (snapshot) {
                    console.log(snapshot)
                    let homeNavData = snapshot.docs
                    _this.setData({
                         homeNavData,
                         hiddenLoading: true
                    })
               },
               onError: function (err) {
                    console.error('the watch closed because of error', err)
               }
          })
     },
     // 点击nav跳转
     ballClick(e) {
         
          let {item} = e.currentTarget.dataset
          if(item.state){
               console.log(e.currentTarget.dataset.item)
               wx.navigateTo({
                    url: item.path
               })
          }
         
     },
})