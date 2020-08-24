//获取当前的毫秒数
var timestamp = new Date().getTime();

function ntimestamp() {
    return 't=' + new Date().getTime();
}

//在URL上设置时间戳
function setUrlStamp(url) {
    if (url.indexOf("?") != -1) {
        url = url + "&" + ntimestamp();
    } else {
        url = url + "?" + ntimestamp();
    }
    return url;
}

//首先判断是不是微信浏览器打开的
$(".button").click(function () {
    var winHeight = $(window).height();

    function is_weixin1() {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger" || ua.indexOf(' qq') > -1 && ua.indexOf('mqqbrowser') < 0) {
            return true;
        } else {
            return false;
        }
    }
    var isWeixin = is_weixin1();
    if (isWeixin) {
        $(".weixin-tip").css("height", winHeight);
        $(".weixin-tip").show();
        return;
    }

    function is_weixin() {
        var ua = navigator.userAgent.toLowerCase();

        var browser = {
            versions: function () {
                var u = navigator.userAgent,
                    app = navigator.appVersion;
                return {
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1, //android终端
                };
            }(),
        }

        //如果不是微信就是用的浏览器打开的
        //在判断使用浏览器是IOS还是Android

        if (browser.versions.ios) {
            //如果是ios
            location.href = setUrlStamp("https://app.hsign.net/private/app/#/8f3df25030234025e5525e9d8cca8a3a")
            // location.href = "https://zc.pgyer.com/InNDsS";
            // location.href = "https://app.zsign.net/private/app/#/8f3df25030234025e5525e9d8cca8a3a"
        } else if (browser.versions.android) {
            //如果是android
            // location.href = "https://down.96rmb.cn/VYun2A";
            // location.href = "https://qiniu.dujialive.com/0/680d995fdcf94f239a46c40c9c61a1c7.apk";
            // location.href = "http://vyun.dujialive.com/down/app-release.apk";
            location.href = setUrlStamp("https://www.pgyer.com/kAQV");
        }
    }

    is_weixin();
})
// })