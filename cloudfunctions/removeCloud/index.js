// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();



// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const res = await db.collection(event.db)
    .doc(event._id)
    .remove()
  return {
    event,
    res
  }
}

// 调用用法
// wx.cloud.callFunction({
//     name: '云函数名称',
//     data: {
//       db: "数据库名称",
//       _id: '标识id'
//     }
//   })
//   .then(res => {
//     console.error('[云函数] [删除记录] 成功：', res);
//   })
//   .catch(err => {
//     console.error('[云函数] [删除记录] 失败：', err);
//   })