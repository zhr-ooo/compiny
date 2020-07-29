// 课程详情接口地址 | 课程评论接口地址
var proUrl = "/product/productNew/findProdInfoById",
	commentUrl = "/product/productNew/findCommentByItemId";
// 获取课程id  邀请人id
var productId = getUrlParam("productId"),
	userId = getUrlParam("userId");
	
// 获取课程详情的请求参数
var getContentData = "";
$(".no_product").show();
// 如果课程id存在, 请求接口获取课程数据
if(productId &&  productId != undefined && productId != "") {
	getContentData = "productId="+productId+"&userId=";
	getComment = 'productId='+productId;
	// 课程详情
	post(proUrl, getContentData, contentBack);
	// 评论
	post(commentUrl, getComment, commentBack);
} else {
	// 否则课程id不存在，跳转到注册页面 （根据有无邀请人id判断有无邀请人）
	// location.href = "./nologin.html?inviteUid="+userId;
	layerMsg('课程不存在');
	$(".no_product").hide();
	$("#comments").css("display", "none");
}

// 获取课程数据的回调函数
function contentBack(res) {
	if(res.status == "success") {
		$(".no_product").hide();
		var result = res.data;
		if(!result || result.length == 0) {
			layerMsg('课程不存在');
			$("#comments").css("display", "none");
			return
		}
		$("#product").show();
		// 作者信息
		var authorInfo = result.authorInfo;
		/* 内容分类，区分新课程和老课程 */
		// 课程类型：1、免费；2、会员；3、付费
		var productType = result.productType;
		// 内容类型：类型1纯文字、2纯图片、3纯视频、4纯音频、5图文、6视频与图文、7音频与图文(仅productType=2时使用)
		var contentType = result.contentType;
		
		$(".pro_avatar").attr("src", authorInfo.header);    // 作者头像
		$("#author").html(authorInfo.nickName);      // 作者姓名
		if (authorInfo.isVip == 1) {     // 是否是vip :vip对应图标是否显示
			$("#pro_isvip").show();
		} else{
			$("#pro_isvip").hide();
		}
		$("#fans").html(authorInfo.fansCount);       //粉丝数量
		$(".pro_title").html(result.title);      // 标题
		if($("#other").width() > $("#all").width()) {
			$("#all").hide();
			$("#other").show().addClass("pro_other");
			$(".title_xiang").show();
		} else {
			$("#all").show();
			$("#other").hide();
			$(".title_xiang").hide();
		}
		// $("#title_content").html(result.title);   // 标题
		$("#view_count").html(result.viewCount);   // 观看量
		$("#comment").html(result.commentCount);   // 评论量
		$("#pro_time").html(result.publishTime);   // 课程发布时间
		
		// 具体内容
		if(result.source && result.source.length>0) {
			typeNew(result.source);
		} else {
			typeOld(result);
		}
		var audios =document.querySelectorAll('.play_audio');
		console.log(audios)
		for(var a=0;a<audios.length;a++) {
			console.log(audios[a].paused)
		}
		// [].forEach.call()是一种快速的方法访问forEach，并将空数组的this换成想要遍历的list。
		// 参考 https://blog.csdn.net/weixin_30257433/article/details/97036070?depth_1-utm_source=distribute.pc_relevant.none-task&utm_source=distribute.pc_relevant.none-task
		[].forEach.call(audios, function(item) {
			item.addEventListener("play", pauseAll.bind(item))
		});
		function pauseAll() {
			var self = this;
			[].forEach.call(audios, function(item) {
				item != self && item.pause();
			});
		}
	}
}
var comHtml = '';
// 获取评论的回调函数
function commentBack(res) {
	if(res.status =="success" && res.data.length>0) {
		for(var com=0;com<res.data.length;com++) {
			comHtml += '<div class="com_div">';
			comHtml += 	'<div class="com_user flex a_c">';
			comHtml += 		'<img src="'+res.data[com]["header"]+'" class="com_user_avatar">';
			comHtml +=      '<div class="com_user_user">';
			comHtml +=			'<div class="com_user_nick">'+res.data[com]["nickName"]+'</div>';
			comHtml +=			'<div class="com_user_time c_999">'+res.data[com]["commentTime"]+'</div>';
			comHtml +=		'</div>';
			comHtml += 	'</div>';
			comHtml +=  '<div class="com_con">'+res.data[com]["comment"]+'</div>';
			comHtml += '</div>';
		}
		document.getElementById("pro_comm_cin").innerHTML = comHtml;
		$("#comments").css("display", "block");
		$("#session").css("border-width", "1px");
	}else {
		$("#comments").css("display", "none");
		$("#session").css("border-width", "0");
	}
}
var sessionHtml = '';
// result.productId < 1555,老版本
function typeOld(result) {
	$("#sess_content").css("display", "block");
	$("#no_data").css("display", "none");
	switch (result.contentType){
		case 1:
			// 纯文字
			sessionHtml +=	'<div style="margin-top: 0.5rem;" class="content_makep">'+result.content+'</div>'
			$("#sess_content").html(sessionHtml);
			break;
		case 2:
			sessionHtml = '';
			// 纯图片
			// 字符串拆分成数组
			var typeImgs = result.images.split(";");
			for (var i = 0; i < typeImgs.length; i++) {
				sessionHtml += '<img src="'+ typeImgs[i] + '" class="content_img" />'
			}
			$("#sess_content").html(sessionHtml);
			break;
		case 3:
			// 纯视频
			sessionHtml = '';
			
			sessionHtml += '<div class="p_r sess_video">';
			if(result.videoImage && result.videoImage != '') {
				sessionHtml += '<img class="video_iframe" src="'+result.videoImage+'" />'
				sessionHtml += '<img class="video_img" src="img/play.png" onclick="toPlay(\''+result.videoUrl+'\')" />'
			} else {
				sessionHtml +=   '<video style="width:100%;height:100%;background:#000;" controls class="play_audio">'
				sessionHtml +=	  '<source src="'+result.videoUrl+'" type="video/mp4">'
				sessionHtml +=   '</video>'
			}
			sessionHtml += '</div>'
			$("#sess_content").html(sessionHtml);
			break;
		case 4:
			// 纯音频
			sessionHtml = '';
			sessionHtml +=	'<audio class="video_audio play_audio" controls style="width: 100%;height:1.68rem;margin-bottom: 0.3rem;">'
			sessionHtml +=	'<source src="' + result.videoUrl + '">'
			sessionHtml +=	'</audio>'
			$("#sess_content").html(sessionHtml);
			break;
		case 5:
			// 图文
			sessionHtml = '';
			sessionHtml +=	'<div style="margin-top: 0.5rem;" class="content_makep">'+result.content+'</div>'
			$("#sess_content").html(sessionHtml);
			break;
		case 6:
			// 视频与图文
			sessionHtml = '';
			
			sessionHtml += '<div class="p_r sess_video">';
			if(result.videoImage && result.videoImage != '') {
				sessionHtml += '<img class="video_iframe" src="'+result.videoImage+'" />'
				sessionHtml += '<img class="video_img" src="img/play.png" onclick="toPlay(\''+result.videoUrl+'\')" />'
			} else {
				sessionHtml +=   '<video style="width:100%;height:100%;background:#000;" controls class="play_audio">'
				sessionHtml +=	  '<source src="'+result.videoUrl+'" type="video/mp4">'
				sessionHtml +=   '</video>'
			}
			sessionHtml += '</div>'
			
			sessionHtml +=	'<div style="margin-top: 0.5rem;" class="content_makep">'+result.content+'</div>'
			$("#sess_content").html(sessionHtml);
			break;
		case 7:
			// 音频与图文
			sessionHtml = '';
			sessionHtml +=	'<audio class="video_audio play_audio" controls style="width: 100%;height:1.68rem;">'
			sessionHtml +=	'<source src="' + result.videoUrl + '">'
			sessionHtml +=	'</audio>'
			sessionHtml +=	'<div style="margin-top: 0.5rem;" class="content_makep">'+result.content+'</div>'
			$("#sess_content").html(sessionHtml);
			break;
		default:
			break;
	}
}
// result.productId > 1555,新版本
function typeNew(source) {
	// 内容无数据
	if(source == [] || source.length == 0) {
		$("#sess_content").css("display", "none");
		$("#no_data").css("display", "block");
	} else {
		// 内容有数据
		$("#sess_content").css("display", "block");
		$("#no_data").css("display", "none");
		sessionHtml = '';
		for (var c = 0; c < source.length; c++) {
			sessionHtml += '<div style="text-align:center;color: #333;">'+source[c]["title"]+'</div>'
			switch (source[c]["type"]){
				case "img":
					sessionHtml += '<img src="'+ source[c]["url"] + '" class="content_img" />'
					break;
				case "audio":
					sessionHtml +=	'<audio class="video_audio play_audio" controls style="width: 100%;height:1.68rem;margin-bottom: 0.3rem;">'
					sessionHtml +=	'<source src="' + source[c]["url"] + '">'
					sessionHtml +=	'</audio>'
					break;
				case "video":
					sessionHtml += '<div class="p_r sess_video">';
					if(source[c]["timeurl"] && source[c]["timeurl"] != '') {
						sessionHtml += '<img class="video_iframe" src="'+source[c]["timeurl"]+'" />'
						sessionHtml += '<img class="video_img" src="img/play.png" onclick="toPlay(\''+source[c]["url"]+'\')" />'
					} else {
						sessionHtml +=   '<video style="width:100%;height:100%;background:#000;" controls class="play_audio">'
						sessionHtml +=	  '<source src="'+source[c]["url"]+'" type="video/mp4">'
						sessionHtml +=   '</video>'
					}
					
					sessionHtml += '</div>'
					break;
				case "text":
					sessionHtml += '<p><span>'+makeBr(source[c]["url"])+'</span></p>'
					break;
				default:
					break;
			}
			$("#sess_content").html(sessionHtml);
		}
	}
}
function makeBr(str) {
	return str.replace(/(\r|\n|\n|\r)/gm, '<br />')
}
function toPlay(thisUrl) {
	window.location.href = thisUrl;
}
// 在app打开：区分有无安装app，没有安装跳转到注册页
function openApp() {
	// 判断浏览器
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
	  //如果是微信
	  if (browser.versions.ios) {
	    //如果是ios   
	    layer.open({
	      type: 1,
	      title: false,
	      closeBtn: 0,
	      area: ['auto'],
	      skin: 'layui-layer-nobg', //没有背景色
	      offset: ['0px','0px'],
	      shadeClose: true,
	      anim: -1,
	      content: $('#isios').html()
	    });
	
	  } else if (browser.versions.android) {
	    //如果是android
	    //如果是ios
	    layer.open({
	      type: 1,
	      title: false,
	      closeBtn: 0,
	      area: ['auto'],
	      skin: 'layui-layer-nobg', //没有背景色
	      offset: ['0px','0px'],
	      shadeClose: true,
	      anim: -1,
	      content: $('#isand')
	    });
	    
	  }
	
	} else {
	  //如果不是微信就是用的浏览器打开的
	  //在判断使用浏览器是IOS还是Android
	
	  if (browser.versions.ios) {
		
		window.location = 'vcloudservice://type=1';
		var loadDateTime = new Date();
		var timeout = setTimeout(function() {
			var timeOutDateTime = new Date();
			if (timeOutDateTime - loadDateTime < 5000) {
				// layer.msg("跳转下载页");
				location.href = "./nologin.html?inviteUid="+userId;
			} else {
				window.close();
			}
		},2000);
		window.onblur = function() {
			clearTimeout(timeout);
		}
	  } else if (browser.versions.android) {
		
		window.location = "vcloudservice://com.cloudqihui.exclusive/open";
		var loadDateTime = new Date();
		var timeout = setTimeout(function() {
			var timeOutDateTime = new Date();
			if (timeOutDateTime - loadDateTime < 3000) {
				// layer.msg("跳转下载页");
				location.href = "./nologin.html?inviteUid="+userId;
			} else {
				window.close();
			}
		},2000);
		window.onblur = function() {
			clearTimeout(timeout);
		}
	  }
	}
}

