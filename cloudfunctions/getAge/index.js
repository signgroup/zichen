// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();

// 云函数入口函数
exports.main =async (event) => {
  const formatNumber = (num) => num < 10 ? '0' + num : num
  const birthDay = new Date(event.date).getTime();
  const now = new Date().getTime();
  let hours = (now - birthDay) / 1000 / 60 / 60;
  let year = Math.floor(hours / (24 * 30 * 12));
  hours = hours % (24 * 30 * 12);
  let months = formatNumber(Math.floor(hours / (24 * 30)));
  hours = hours % (24 * 30);
  let days = formatNumber(Math.floor(hours / (24)));
  hours = hours % (24);
  let hour = formatNumber(Math.floor(hours));
  hours = hours % (1);
  let minute = formatNumber(Math.floor(hours * 60));
  hours = hours % (1 / 60);
  return await ` ${year}岁${months}月${days}天${hour}时${minute}分`
}

//调用方法
// wx.cloud.callFunction({
//      name: 'getAge',
//      data: {
//           date: "2018-11-11 23:11:00"
//      }
// })
// .then(res => {

// })