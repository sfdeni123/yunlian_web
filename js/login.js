const $tools = mcfish.Tools;
const $api = mcfish.API;
const user = $tools.GetCookie("yunlian_user");
if(user != null && user != undefined){
	window.location.href = "index.html";
}

layui.use(['form', 'layer', 'jquery', 'mcfish'], function() {
	var form = layui.form
    ,layer = parent.layer === undefined ? layui.layer : top.layer
    ,$ = layui.jquery
	,mcfish = layui.mcfish;

	var app = new Vue({
		el: "#app",
		data: {
		},
		methods: {
			login() {
				var data = {};
				data.phone = $("#login-username").val();
				data.password = $("#login-password").val();
				if(data.phone == null || data.phone == '' || data.password == null || data.password == '')
				{
					layer.msg("请填写账号密码");
					return;
				}
				loginPage(data);
				
			},
		},
	})

	function loginPage(data){
		$.ajax({
//			url: "http://127.0.0.1:9000/user/login",
			url: "http://47.52.34.187:9000/user/login",
			type: "post",
			data: data,
			scriptCharset: 'UTF-8',
			success: function(ret) {
				var result = $.parseJSON(ret);
			
	            if(result.code != 0){
	//              $("#login").text("登录").removeAttr("disabled").removeClass("layui-disabled");
	//              layer.msg(result.msg);
	//              $("#code").val("");
	//              $("#imgCode img").trigger("click");
					layer.msg("账号或密码错误");
	            }else{
	          		layui.data("yunlian_user",{key:"user",value:result.data});
//	          		layui.sessionData("yunlian_user",{key:"user",value:result.data});
	        		$tools.SetCookie("yunlian_user",JSON.stringify(result.data),"d7");
	            	var href = window.location.href;
	            	if(href.indexOf("index") != -1){
	            		window.location.reload();
					}else{
						window.location.href = "index.html";
	                }
				}
			},
			error: function(xmlHttpRequest) {
	//			$("#login").text("登录").removeAttr("disabled").removeClass("layui-disabled");
	//			outMsg(xmlHttpRequest);
			}
		});
	}
});
