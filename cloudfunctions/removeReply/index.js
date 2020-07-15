// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
     // API 调用都保持和云函数当前所在环境一致
     env: cloud.DYNAMIC_CURRENT_ENV
   })
   const db = cloud.database();
   const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
     return await db.collection("message").doc(event.id).update({
      data: {
          reply: _.pull({
               openId:_.eq(event.places.openId),
               date: _.eq(event.places.date),
               content:_.eq(event.places.content),
             })
      }
    })

}
//使用案例
// wx.cloud.callFunction({
//      name: 'removeReply',
//      data: {
//           id: counterId,
//           places:{
//                openId:data.openId,
//                date:data.date,
//                content:data.content
//           }
//      }
// })
// .then(res => {})