//rem设置 layout_width是layout设计宽度
var layout_width = 1080;
(function (doc, win) {
var docEl = doc.documentElement,
  resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
  recalc = function () {
	var clientWidth = docEl.clientWidth;
	if (!clientWidth) return;
	if (clientWidth >= layout_width) {
	  docEl.style.fontSize = '100px';
	} else {
	  docEl.style.fontSize = 100 * (clientWidth / layout_width) + 'px';
	}
  };

if (!doc.addEventListener) return;
win.addEventListener(resizeEvt, recalc, false);
doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

upCss();
function upCss() {
	var date = new Date();
	var timestamp = Date.parse(date);
	//css
	$('#main_css').attr('href', 'css/main.css?v=' + timestamp);
	$('#login_css').attr('href', 'css/login.css?v=' + timestamp);
	$('#product_css').attr('href', 'css/product.css?v=' + timestamp);
	$('#pay_css').attr('href', 'css/pay.css?v=' + timestamp);
	$('#address_css').attr('href', 'css/address.css?v=' + timestamp);
	//js
	$('#public').attr('src', 'js/public.js?v=' + timestamp);
	$('#down_js').attr('src', 'js/down.js?v=' + timestamp);
	$('#regiest_js').attr('src', 'js/regiest.js?v=' + timestamp);
	$('#product_js').attr('src', 'js/product.js?v=' + timestamp);
}