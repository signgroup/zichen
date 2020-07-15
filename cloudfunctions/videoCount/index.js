// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
 const _ = db.command
  return await  db.collection('video').doc(event.id).update({
    data: {
      // 表示指示数据库将字段自增 10
      play: _.inc(1)
    }
  })
}

// 调用方法
// wx.cloud.callFunction({
//   name: 'update',
//   data: {
//     db: "blog",
//     id: id,
//     params: {
//       view:parseInt(view + 1),
//     }
//   }
// })
//   .then(res => {
//     console.log(res.result)
//   })