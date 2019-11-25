layui.config({
	base: "../js/modules/"
}).extend({
	"bodyTab": "bodyTab"
}).use(['bodyTab', 'form', 'element', 'layer', 'jquery', 'mcfish'], function() {
	var form = layui.form, 
	element = layui.element, 
	$ = layui.$, 
	layer = layui.layer, 
	mcfish = layui.mcfish;

	//退出
	$(".signOut").click(function () {
		window.location.href = mcfish.getReqUri() + "/logout";
    });

	
	//修改密码
	$(".editPwd").click(function () {
        layer.open({
            title: "修改密码"
            ,type: 1
            ,content: `<div class="layui-form pad10">
				<div class="layui-form-item">
					<label class="layui-form-label">原密码</label>
					<div class="layui-input-block">
						<input name="pwd" type="password" placeholder="请输入原先密码" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>
				<div class="layui-form-item">
					<label class="layui-form-label">新密码</label>
					<div class="layui-input-block">
						<input name="newPwd" type="password" placeholder="请输入新密码" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>
				<div class="layui-form-item">
					<label class="layui-form-label">确认新密码</label>
					<div class="layui-input-block">
						<input name="newPwdC" type="password" placeholder="请再次输入新密码" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>
				<div class="layui-form-item saveBtnItem" style="display: none">
                    <div class="layui-input-block">
                        <button class="layui-btn pwdBtn" lay-submit lay-filter="pwdBtn">提交</button>
                    </div>
                </div>
			</div>`
            ,maxmin: true
            ,area: ['400px', '300px']
            ,btn: ['绑定', '取消']
            ,btnAlign: 'c'
            ,success: function(layero, index){
                form.render();
                form.on('submit(pwdBtn)', function(data){
                	if(data.field.newPwd != data.field.newPwdC){
                		layer.msg("两次密码不一致");
                		return;
					}
                    mcfish.post('updatePwd',data.field, function () {
                        layer.close(index);
                    });
                })
            }
            ,yes: function () {
                $(".pwdBtn").trigger("click");
                return false;
            }
        })
    });

    tab = layui.bodyTab({
		openTabNum: "50" //最大可打开窗口数量
	});

	//加载左侧菜单
    dataStr = layui.sessionData("hdcm_operation").user.menuList;
    tab.render();

	//隐藏左侧导航
	$(".hideMenu2").click(function() {
//		if($(".topLevelMenus li.layui-this a").data("url")) {
//			layer.msg("此栏目状态下左侧菜单不可展开"); //主要为了避免左侧显示的内容与顶部菜单不匹配
//			return false;
//		}
		$(".layui-layout-admin").toggleClass("showMenu");
		
		//渲染顶部窗口
		tab.tabMove();

        var i = $(this).find("i");
        console.log(i);
        if(i.hasClass("layui-icon-shrink-right")){
        	$(".layui-layout-left").css({left:"0px"});
            i.removeClass("layui-icon-shrink-right");
            i.addClass("layui-icon-spread-left")
        }else{
        	$(".layui-layout-left").css({left:"200px"});
            i.removeClass("layui-icon-spread-left")
            i.addClass("layui-icon-shrink-right");
        }
	});

	//通过顶部菜单获取左侧二三级菜单（默认）
	$(".topLevelMenus li:first").click();


	function IsPC() {
	   var userAgentInfo = navigator.userAgent;
	   var Agents = ["Android", "iPhone",
	      "SymbianOS", "Windows Phone",
	      "iPad", "iPod"];
	   var flag = true;
	   for (var v = 0; v < Agents.length; v++) {
	      if (userAgentInfo.indexOf(Agents[v]) > 0) {
	         flag = false;
	         break;
	      }
	   }
	   return flag;
	}

	//手机设备的简单适配
//	$('.site-tree-mobile').on('click', function() {
//		$('body').addClass('site-mobile');
//	});
//	
//	$('.site-mobile-shade').on('click', function() {
//		$('body').removeClass('site-mobile');
//	});

	// 添加新窗口
	$("body").on("click", ".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')", function() {
		//如果不存在子级
		if($(this).siblings().length == 0) {
			addTab($(this));
			$('body').removeClass('site-mobile'); //移动端点击菜单关闭菜单层
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	});

	//刷新后还原打开的窗口
	if(cacheStr == "true") {
		if(window.sessionStorage.getItem("menu") != null) {
			menu = JSON.parse(window.sessionStorage.getItem("menu"));
			curmenu = window.sessionStorage.getItem("curmenu");
			var openTitle = '';
			for(var i = 0; i < menu.length; i++) {
				openTitle = '';
				if(menu[i].icon) {
					if(menu[i].icon.split("-")[0] == 'icon') {
						openTitle += '<i class="seraph ' + menu[i].icon + '"></i>';
					} else {
						openTitle += '<i class="'+ menu[i].icon +'"></i>';
					}
				}
				openTitle += '<cite>' + menu[i].title + '</cite>';
				openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
				element.tabAdd("bodyTab", {
					title: openTitle,
					content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
					id: menu[i].layId
				})
				//定位到刷新前的窗口
				if(curmenu != "undefined") {
					if(curmenu == '' || curmenu == "null") { //定位到后台首页
						element.tabChange("bodyTab", '');
					} else if(JSON.parse(curmenu).title == menu[i].title) { //定位到刷新前的页面
						element.tabChange("bodyTab", menu[i].layId);
					}
				} else {
					element.tabChange("bodyTab", menu[menu.length - 1].layId);
				}
			}
			//渲染顶部窗口
			tab.tabMove();
		}
	} else {
		window.sessionStorage.removeItem("menu");
		window.sessionStorage.removeItem("curmenu");
	}
	
	

	function handleTouchEvent(event) {
    //只跟踪一次触摸
    if (event.touches.length == 1) {
        switch (event.type) {
            case "touchstart":
   				var icon = $("#LAY_app_flexible");
                if(event.touches[0].clientX > window.screen.width/2){
                	$(".layui-layout-admin").toggleClass("showMenu");
                	if(icon.hasClass("layui-icon-shrink-right")){
			        	$(".layui-layout-left").css({left:"0px"});
			            icon.removeClass("layui-icon-shrink-right");
			            icon.addClass("layui-icon-spread-left")
			        }else{
			        	$(".layui-layout-left").css({left:"200px"});
			            icon.removeClass("layui-icon-spread-left")
			            icon.addClass("layui-icon-shrink-right");
			        }
                }
		
                break;

	        }
	    }
	}
	document.addEventListener("touchstart", handleTouchEvent, false);
			
			

});


//打开新窗口
function addTab(_this) {
	tab.tabAdd(_this);
}




