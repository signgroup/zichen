// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
     env: cloud.DYNAMIC_CURRENT_ENV
   })

 //引入模块 nodemailer
 const nodemailer = require('nodemailer')


 //引入模块 nodemailer
exports.main = async (event, context) => {

 const config = {
    host: 'smtp.exmail.qq.com',
        secureConnection: true, // use SSL
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
		user: 'admin@13s.top', //邮箱账号
		pass: '5jBYS9bEK6kSwgDT' //邮箱的授权码
    }
 }

 const transporter =await nodemailer.createTransport(config)

  const mail = {
    // 发件人 邮箱  '昵称<发件人邮箱>'
    from: '测试 <admin@13s.top>',
    // 主题
    subject: '发送邮件',
    // 收件人 的邮箱 可以是其他邮箱 不一定是qq邮箱
	//event.email
    to: '641503662@qq.com',
    //这里可以添加html标签
    html: '<p>小程序云开发测试</p>'
 }
 return await transporter.sendMail(mail,(error, info)=>{
	 console.log('error',error)
	 console.log('info',info)
    if(error) {
       message="发送失败"
    }
	if(info.response.includes('Ok')){
		message="发送成功"
	}
    transporter.close()
    console.log('mail sent:', info.response)
	return message
 })

}