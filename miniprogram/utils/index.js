const formatTime = (date,type) => {
     console.log(date)
     const d=new Date(date)
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      const hour = d.getHours()
      const minute = d.getMinutes()
      const second = d.getSeconds()
      const milli = d.getMilliseconds()
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