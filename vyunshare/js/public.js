var hostApi = "http://vyun.dujialive.com/vyun/"; //API接口地址
// var hostApi = "http://192.168.110.62:8080/vyun/"; //API接口地址
// 加密向量
var iv = 'ABCRTHNJRTCNMVTL';
// 手机号校验
var reg = /^1[3-9]\d{9}$/;
var pwdReg = /^[a-zA-Z\d]{8,12}$/;
var payReg = /^\d{6}$/;
//通用的错误返回函数处理
var errorResponse = function(XMLHttpRequest, textStatus, errorThrown) {
	if(XMLHttpRequest.status == "500") {
		layer.msg("攻城狮正在拼命修复中...", {
			time: 1000
		});
	} else if(XMLHttpRequest.status == "400") {
		layer.msg(XMLHttpRequest.responseJSON.message, {
			time: 1000
		});
	}
	return;
}

var ua = navigator.userAgent.toLowerCase();
var browser = {
  versions: function() {
    var u = navigator.userAgent,
      app = navigator.appVersion;
    return {
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
      android: u.indexOf('Android') > -1, //android终端
    };
  }(),
}
function layerMsg(msg, fun, time) {
	layer.msg("<span class='layer_msg_tip'>" + msg + "</span>", {
	    time: time || 2000,
	    offset: "calc(20vw)"
	},fun);
}
function layerMsgCenter(msg, fun, time) {
	layer.msg("<span class='layer_msg_tip'>" + msg + "</span>", {
	    time: time || 2000,
	    offset: "calc(50vw)"
	},fun);
}
//获取连接传参
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return decodeURI(r[2]);
	return null;
}
function get(url, data, callBack) {
  var thisurl = url ? hostApi + url: hostApi;
	$.ajax({
		type: "get",
		async: "flase",
		url: thisurl,
		cache: "false",
		dataType: "json",
		data: data,
		success: callBack,
	});
}


//post请求
function post(url, data, callBack) {
  var posturl = url ? hostApi + url: hostApi;
	$.ajax({
		type: "post",
		async: "false",
		cache: "false",
		url: posturl,
		dataType: "json",
		data: data,
		success: callBack,
		error: errorResponse,
	});
}
/**
 * 接口数据解密函数
 * @param str string 已加密密文
 * @param key string 加密key(16位)
 * @param iv string 加密向量(16位)
 * @returns {*|string} 解密之后的json字符串
 */
function decrypt(str, key, iv) {
	//密钥16位
	var key = CryptoJS.enc.Utf8.parse(key);
	//加密向量16位
	var iv = CryptoJS.enc.Utf8.parse(iv);
	var decrypted = CryptoJS.AES.decrypt(str, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	});
	return decrypted.toString(CryptoJS.enc.Utf8);
}

/**
 * 接口数据加密函数
 * @param str string 需加密的json字符串
 * @param key string 加密key(16位)
 * @param iv string 加密向量(16位)
 * @return string 加密密文字符串
 */
function encrypt(str, key, iv) {
	//密钥16位
	var key = CryptoJS.enc.Utf8.parse(key);
	//加密向量16位
	var iv = CryptoJS.enc.Utf8.parse(iv);
	var encrypted = CryptoJS.AES.encrypt(str, key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.ZeroPadding
	});
	return encrypted;
}

//时间封装函数
function retTimer() {
	var time = new Date();
	var year = time.getFullYear(),
		month = time.getMonth() + 1,
		date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate(),
		hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours(),
		minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes(),
		seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
	if (month < 10) {
		month = "0" + month;
	}
	// 拼接时间字符串(根据后台的要求可能是变化的)
	var tt = year + "" + month + "" + date + "" + hours + "" + minute + "" + seconds + "WB";
	return tt;
}

//加密函数
function encryption(options) {
	//加密
	//获取当前时间戳13位 + 3位字符
	var timestamp = retTimer();
	//加密密钥16位
	var encrypt_key = timestamp;
	//要加密的数据
	var encrypt_string = options;
	//加密后密文（加密函数在public.js文件中）
	var encrypted_string = encrypt(encrypt_string, encrypt_key, iv);
	//将加密密文在页面用标签接收
	$('#hide').val(encrypted_string);
	return encrypt_key;
}

//解密函数
function decrypts(options, parameter) {
	//解密
	//解密密钥16位(解密向量同上)
	var decrypt_key = options;
	//解密密文字符串
	var decrypt_string = parameter;
	//解密后密文（解密函数在public.js文件中）
	var decrypted_string = decrypt(decrypt_string, decrypt_key, iv);
	//解密后的数据转换成json格式
	var datas = JSON.parse(decrypted_string);
	return datas;
}

/**
 * 写入Cookie
 * @param name 名称
 * @param value 值
 * @param expireHours 过期时间
 */
function addCookie(name, value, expireHours) {
	var cookieString = name + "=" + escape(value) + "; path=/";
	//判断是否设置过期时间
	if(expireHours > 0) {
		var date = new Date();
		date.setTime(date.getTime() + expireHours * 3600 * 1000);
		cookieString = cookieString + ";expires=" + date.toGMTString();
	}
	document.cookie = cookieString;
}

/**
 * 获取Cookie值
 * @param name 名称
 * @returns {null}
 */
function getCookie(name) {
	var strcookie = document.cookie;
	var arrcookie = strcookie.split("; ");
	for(var i = 0; i < arrcookie.length; i++) {
		var arr = arrcookie[i].split("=");
		if(arr[0] == name) return unescape(arr[1]);
	}
	return null;
}
