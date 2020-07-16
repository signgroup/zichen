// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {


  try {
    return await event.ids.forEach((item, index) => {
      db.collection(event.db).doc(item).update({
        data: {
          order: index
        },
        success: function (res) {
          console.log(res.data)
          return res
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
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