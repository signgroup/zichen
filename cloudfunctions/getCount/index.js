// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection(event.db).count()
}

//调用方法
// wx.cloud.callFunction({
//      name: 'getCount',
//      data: {
//           db: "photo"
//      }
// })
// .then(res => {
    
// })