// 根据id查询用户接口
var getIdUser = "/system/appuser/getInvitation";
// 注册接口
var regiestJson = "/system/appuser/register/json";
var idData = "",    // 传递id的数值
	formData = "";   // 注册的数值
var inviteUid = getUrlParam("inviteUid");

var isId = false;
$(function() {
  if(inviteUid && inviteUid !== '') { 
	idData = "inviteUid="+inviteUid+"&type=0";
	$("#haduser").css("display","none");
	$("#nouser").css("display","block");
	$("#card").css("display","none");
	isId = true;
	post(getIdUser, idData, backId); 
  } else {
	$("#haduser").css("display","block");
	$("#nouser").css("display","none");
  	$("#card").css("display","none");
	inviteUid = "";
	isId = false;
  }
})
// 根据id查询用户返回函数
function backId(res) {
	if(res.status == "success") {
		var result = res.data;
		$("#had_username").html(result.nickName);
		$("#haduser").css("display","none");
		$("#nouser").css("display","block");
		$("#card").css("display","none");
		isId = true;
	}else {
		$("#haduser").css("display","block");
		$("#nouser").css("display","none");
		$("#card").css("display","none");
		isId = false;
	}
}
// 点击显示隐藏按钮的切换
function showHide(obj) {
	var btnType = $(obj)[0]["dataset"]["can"];
	if(btnType === 'hide') {
		$(obj).html('隐藏');
		$(obj)[0]["dataset"]["can"] = "show";
		$(obj).removeClass("show").addClass("hide");
		$("#payPwd").attr("type", "text");
	} else if(btnType === 'show') {
		$(obj).html('显示');
		$(obj)[0]["dataset"]["can"] = "hide";
		$(obj).removeClass("hide").addClass("show");
		$("#payPwd").attr("type", "password");
	}
}
// 获取验证码
var processing = false;
var i;
// 获取验证码接口
var getcapth = "/app/sms/h5send/json";
// 获取验证码
function getCode() {
    var blurmobile = makeMobile();
    //手机号正确,开始请求接口获取验证码
    if (blurmobile) {
        i = 60;
        if (processing) return;
        var data = 'mobile='+$("#mobile").val();
        setTime($("#getcode"));
        post(getcapth, data, function (res) {
            if (res.status == "success") {
                layerMsgCenter(res.message);
            } else {
                layerMsgCenter(res.message);
                i = 0;
                setTime($("#getcode"));
            }
        });
    } else {
        return
    }
}

function setTime(o) {
    if (i == 0) {
        o.removeAttr("disabled");
        processing = false;
        o.val("验证码");
        wait = 30;
    }
    else {
        o.attr("disabled", true);
        o.val(i + "s");
        i--;
        processing = true;
        setTimeout(function () {
            setTime(o)
        }, 1000)
    }
}
// 点击确定,进行注册
function toRegiest() {
	var mobile = $("#mobile").val(),
		captcha = $("#captcha").val(),
		pwd = $("#pwd").val(),
		payPwd = $("#payPwd").val();
	// 邀请人id存在
	if(!isId) {
		var userid = $("#inviteUid").val();
		if(userid && userid != undefined && userid != '') {
			inviteUid = userid;
		} else {
			inviteUid = '';
		}
	}
	if(makeMobile() && makeCaptcha() && makePwd() && makePay()) {
		if(inviteUid!=null && inviteUid!=''){
			formData = "inviteUid="+inviteUid+"&mobile="+mobile+"&captcha="+captcha+"&pwd="+pwd+"&payPwd="+payPwd;
		}else{
			formData = "mobile="+mobile+"&captcha="+captcha+"&pwd="+pwd+"&payPwd="+payPwd;
		}
		
		
		$("#mb").show();
		console.log(formData)
		post(regiestJson, formData, function(res) {
			$("#mb").hide();
			if(res.status == "success") {
				layerMsg("注册成功", function() {
					location.href = "./down.html";
				}, 1000)
			} else {
				layerMsg(res.message);
			}
		})
	}
}
function makeMobile() {
	var mobile = $("#mobile").val();
	if(!mobile || mobile == undefined || mobile == "") {
		layerMsg("手机号不能为空!");
		return false;
	}
	if(!reg.test(mobile)) {
		layerMsg("手机号格式错误,请重新填写!");
		return false;
	}
	return true;
}
function makeCaptcha() {
	var captcha = $("#captcha").val();
	if(!captcha || captcha == undefined || captcha == "") {
		layerMsg("验证码不能为空!");
		return false;
	} else {
		return true;
	}
}
function makePwd() {
	var pwd = $("#pwd").val();
	if(!pwd || pwd == undefined || pwd == "") {
		layerMsg("密码不能为空!");
		return false;
	}
	if(!pwdReg.test(pwd)) {
		layerMsg("密码必须由8-12位数字或字母组成!");
		return false;
	}
	return true;
}
function makePay() {
	var payPwd = $("#payPwd").val();
	if(!payPwd || payPwd == undefined || payPwd == "") {
		layerMsg("请输入支付密码!");
		return false;
	}
	if(!payReg.test(payPwd)) {
		layerMsg("支付密码格式错误，请重新输入!");
		return false;
	}
	return true;
}