const formatTime = (date,type) => {
     console.log(date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      const second = date.getSeconds()
      const milli = date.getMilliseconds()
     let str=""
     if(type==1){
       str = [year, month, day, hour, minute, second, milli].map(formatNumber).join('')
     }else{
       str = [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
     }
      return str
   }
   
   const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
   }

   module.exports = {

     formatTime
   }