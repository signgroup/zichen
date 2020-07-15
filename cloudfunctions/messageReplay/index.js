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
  var res ;
  if (event.params) {
    const _ = db.command
    let sql= db.collection("message").doc(event.id)

    if(event.sort>=0){
      
      res = await sql.update(
        {
        data: {
          reply: _.push({
            each: [event.params],
            position: event.sort+1,
          })
        }
      })
    }else{
    res = await sql.update(
      {
      data: {
          reply: _.push(event.params)
      }
    })
  }

  }

  return {
    event,
    res
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