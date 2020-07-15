const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数

   exports.main = async (event, context) => {
     const {
          OPENID,
          APPID
        } = cloud.getWXContext()
     try {
       const result = await cloud.openapi.subscribeMessage.send({
           touser:'ozh_944fCkNgPWzcHuErfsHCtG1k',           //要发送用户的openid
           page: event.page,        //用户通过消息通知点击进入小程序的页面
           lang: 'zh_CN',      //进入小程序查看”的语言类型，支持zh_CN(简体中文)、en_US(英文)、zh_HK(繁体中文)、zh_TW(繁体中文)，默认为zh_CN
           data: event.params,
           templateId: event.templateId,   //订阅消息模板ID
           miniprogramState: event.state   //跳转小程序类型：developer为开发版；trial为体验版；formal为正式版；默认为正式版
   
         })
       return result
     } catch (err) {
       return err
     }
   }
   //使用案例
  //  const templateId = '-rej8CUBzdB6cA8dJw0W1SZQObZJziDqFL4v8lnujBk'; // 订阅消息模版id
  //         wx.cloud.callFunction({
  //                   name: 'pushCloud',
  //                   data: {
  //                        page: '/pageHome/message/index',
  //                        params: { 
  //                             name1: {
  //                                  value:params.userInfo.nickName||'未知' //留言人
  //                             },
  //                             thing2: {
  //                                  value: params.content //留言内容
  //                             },
  //                             time3: {
  //                                  value:params.date//留言时间
  //                             }
  //                        },
  //                        templateId: templateId,
  //                        state: 'developer'
  //                   }
  //              })
  //              .then(res => {
  //                   console.log('push', res)
  //              })