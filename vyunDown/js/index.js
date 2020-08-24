
function yangshi(){
    $(".swiper-slide").height($(window).height())
    $(".main_slide").animate({"top":-($(".now").index()) * $(".swiper-slide").height()},100)
    $(".swiper-container").height($(window).height())
    // if($(".now").index()==0){
    //     $(".main_slide").position().top==0
    //     $(".main_slide").animate({"top":0},100)

    // }
//    $(".flex_wrap").height($(window).height() - $(".header_wrap").height() - 200)
}
window.scrollTo(0,0)
yangshi()
$(window).resize(yangshi)
$(".nav_piece").click(function () {
    $(".nav_piece").removeClass("now")
    $(this).addClass("now")
    $(".main_slide").animate({
        "top": -($(".now").index()) * $(".swiper-slide").height()
    })
})


//判断用户是用浏览器还是手机打开页面的

    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ['Android', 'iPhone',
            'SymbianOS', 'Windows Phone',
            'iPad', 'iPod'
        ];
        var flag = true;
        for (var i = 0; i < Agents.length; i++) {
            if (userAgentInfo.indexOf(Agents[i]) != -1) {
                flag = false;
                break;
            }
        }
       
        return flag;
    }
    if(!IsPC()) {
        window.location.href = './indexMobile.html';
    }

    var oIs = true;
    $(window).bind('mousewheel',function(event){
 
        if(oIs){
            if(event.originalEvent.deltaY>0&&$(".main_slide").position().top>=-3*$(".swiper-slide").height()){//下滑
            //position()相当于offset()
            oIs=false;
                var oTop=$(".main_slide").position().top
               
                console.log(oTop-$(window).height())
                $(".main_slide").animate({"top":oTop-$(window).height()},1000,function(){
                    oIs = true;
                    
                })
                if(bb != 0){
                    document.body.scrollTop
                }
              
                    var bb=$(".main_slide").position().top/-$(".swiper-slide").height()
                    //滑轮事件对应到我上面导航栏下的点的
                   
                    $(".nav_piece").removeClass("now")
                    $(".nav_piece").eq(bb+1).addClass("now")
                    
                 
            }
            if(event.originalEvent.deltaY<0&&$(".main_slide").position().top<0){//上
                oIs=false;
                var oTop=$(".main_slide").position().top
                
                console.log(oTop+$(window).height())
                $(".main_slide").animate({"top":oTop+$(window).height()},1000,function(){
                    oIs = true;
                })
                
                    var bb=$(".main_slide").position().top/-$(".swiper-slide").height()
                    $(".nav_piece").removeClass("now")
                    $(".nav_piece").eq(bb -1).addClass("now")
                   
            }
        }
    })
    