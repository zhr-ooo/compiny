import Vue from "vue";
import * as dayjs from "dayjs";

// Vue.filter('NumberFormat', function (value) {
//   if (!value) {
//     return '0'
//   }
//   let intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') //将整数部分逢三一断
//   return intPartFormat

// })
Vue.filter('NumberFormat', function(value) {
  if(!value) return '0';
  var intPart = Number(value).toFixed(0); //获取整数部分
  var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'); //将整数部分逢三一断
  var floatPart = ""; //预定义小数部分
  var value2Array = value.toString().split(".");
  //=2表示数据有小数位
  if(value2Array.length == 2) {
   floatPart = value2Array[1].toString(); //拿到小数部分
   if(floatPart.length == 1) { //补0,实际上用不着
    return intPartFormat + "." + floatPart + '0';
   } else {
    return intPartFormat + "." + floatPart;
   }
  } else {
   return intPartFormat + floatPart;
  }
 })
//保留两位小数四舍五入
Vue.filter('YearFormat', function (value) {
  if (!value) return '0.00';
  var num = value / 1;
  num = num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return num
})
// 将秒转换为时分秒
Vue.filter('SeondFormat', function (value) {
  let result = parseInt(value)
  let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
  let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
  let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

  let res = '';
  if(h !== '00') res += `${h}时`;
  if(m !== '00') res += `${m}分`;
  res += `${s}秒`;
  return res;
}),
//  将小数点转换为百分比
Vue.filter('toPercentage', function (point) {
  var str = Number(point);
  str += "%";
  return str;
}),


Vue.filter('dayjs', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
}),

Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(dataStr).format(pattern)
}),

/** 字符串超长截取省略号显示 */
Vue.filter('ellipsis', function (value, vlength = 25) {
  if(!value){
    return "";
  }
  console.log('vlength: '+ vlength);
  if (value.length > vlength) {
    return value.slice(0, vlength) + '...'
  }
  return value
})