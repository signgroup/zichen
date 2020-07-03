// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

// 云函数入口函数
exports.main = async(event, context) => {
  const _ =db.command;
  const wxContext = cloud.getWXContext();
  var sql = db.collection(event.db);
  /**
   *db 数据库表名
   *skip 分页从第几条开始
   *limit 限度返回个数
   *不能与doc一起使用
   */
  if (event.skip) {
    sql = sql.skip(event.skip);
  }
  if (event.limit) {
    sql = sql.limit(event.limit);
  }
  if (event.lte) { 
    //当天时间24点前-标准时间  new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
    sql = sql.where({
      date: _.lte(new Date())
    })
  }
  if (event.orderBy){
    sql=sql.orderBy(event.orderBy.key, event.orderBy.value);
  }
  if (event.doc){
    sql=sql.doc(event.doc);
  }

  var obj = {};
//对象key动态赋值
  if (event.where) {
    Object.defineProperty(obj, event.where.key, {
      enumerable: true,
      configurable: true,
      writable: false,
      value: event.where.value
    })
    console.log(obj)
    sql = sql.where(obj)
  }
  if (event.RegExp){
    sql = sql.where({
      title: db.RegExp({
        regexp: '.*' + event.RegExp.value,
        options: 'i',//大小写不敏感
      })
    })
    
  }
  
  let res = await sql.get()
  //  var res;
  // if (event.orderBy) {
  //    res = await db.collection(event.db)
  //     .skip(event.skip)
  //     .limit(event.limit).orderBy(event.orderBy.key, event.orderBy.value).get()
  // }else{
  //    res = await db.collection(event.db)
  //     .skip(event.skip)
  //     .limit(event.limit)
  //     .get()
  // }


  return {
    data:res.data
  }
}

//调用方法
// wx.cloud.callFunction({
//    name: 'getCloud',
//    data: {
//       db: "background",
//       skip: 0,//条件限制，根据需要传参
//       limit: 100
//    }
// })
// .then(res => {
//    console.log(res.result.res.data)
// })