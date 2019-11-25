layui.use(['form', 'layer', 'jquery', 'mcfish'], function () {
	var form = layui.form,
		layer = parent.layer === undefined ? layui.layer : top.layer,
		$ = layui.jquery,
		mcfish = layui.mcfish;

	//表单输入效果
	$(".loginBody .input-item").click(function (e) {
		e.stopPropagation();
		$(this).addClass("layui-input-focus").find(".layui-input").focus();
	});
	$(".loginBody .layui-form-item .layui-input").focus(function () {
		$(this).parent().addClass("layui-input-focus");
	});
	$(".loginBody .layui-form-item .layui-input").blur(function () {
		$(this).parent().removeClass("layui-input-focus");
		if ($(this).val() != '') {
			$(this).parent().addClass("layui-input-active");
		} else {
			$(this).parent().removeClass("layui-input-active");
		}
	});



	//验证码
	/*	$("#imgCode img").click(function(e) {
	        layui.stope(e)
	        console.log(this.src)
			this.src = "http://127.0.0.1:9000/user/captcha?rnd=" + Math.random();
		});

		$("#imgCode img").trigger("click"); */
	//登录按钮
	form.on("submit(login)", function (data) {

		$("#login").text("登录中...").attr("disabled", "disabled").addClass("layui-disabled");
		$.ajax({
			//url: "http://127.0.0.1:9000/user/login",
			url: "http://47.52.34.187:9000/user/login",
			//url: "http://localhost:3000/loginresult",
			type: "post",
			data: data.field,
			scriptCharset: 'UTF-8',
			success: function (ret) {
				ret = '{"code":0,"data":{"id":8,"identity":0,"menuList":[{"comment":"http://47.52.34.187/page/main.html","createTime":1574670824000,"icon":"layui-icon layui-icon-component","id":1,"link":"../contract/contract.html","name":"平台首页","orderNum":1000,"status":1},{"createTime":1568082231000,"icon":"layui-icon layui-icon-component","id":2,"link":"http://47.52.34.187/page/money/list.html","name":"财务管理","orderNum":100,"status":1},{"createTime":1568082234000,"icon":"layui-icon layui-icon-component","id":3,"link":"http://47.52.34.187/page/moneyUse/list.html","name":"资金用途","orderNum":100,"status":1},{"createTime":1569229898000,"icon":"layui-icon layui-icon-component","id":4,"link":"http://127.0.0.1:8020/YUNLIAN_PAGE/page/money/list.html","name":"财务管理本地","orderNum":100,"status":0},{"comment":"http://47.52.34.187/page/main.html","createTime":1569229898000,"icon":"layui-icon layui-icon-component","id":5,"link":"http://127.0.0.1:8020/YUNLIAN_PAGE/page/main.html","name":"平台首页本地","orderNum":1000,"status":0},{"createTime":1569229898000,"icon":"layui-icon layui-icon-component","id":6,"link":"http://127.0.0.1:8020/YUNLIAN_PAGE/page/moneyUse/list.html","name":"资金用途本地","orderNum":100,"status":0},{"createTime":1569229898000,"icon":"layui-icon layui-icon-component","id":7,"link":"http://127.0.0.1:8020/YUNLIAN_PAGE/page/moneyType/list.html","name":"资金项目本地","orderNum":100,"status":0},{"createTime":1568082237000,"icon":"layui-icon layui-icon-component","id":8,"link":"http://47.52.34.187/page/moneyType/list.html","name":"资金项目","orderNum":100,"status":1},{"comment":"","createTime":1568082966000,"icon":"layui-icon layui-icon-component","id":10,"link":"http://47.52.34.187/page/coin/ltc.html","name":"持仓状态","orderNum":100,"status":1}],"name":"11","phone":"17340204360","pwd":"***","status":0,"token":"644e45137714bed5a2bedfe9d08239c1"},"msg":"SUCCESS","totalrow":1}';
				var result = $.parseJSON(ret);

				if (result.code != 0) {
					$("#login").text("登录").removeAttr("disabled").removeClass("layui-disabled");
					layer.msg(result.msg);
					$("#code").val("");
					$("#imgCode img").trigger("click");
				} else {
					console.log(result);
					layui.sessionData("hdcm_operation", {
						key: "user",
						value: result.data
					});
					layui.data("hdcm_operation", {
						key: "user",
						value: result.data
					});
					var href = window.location.href;
					if (href.indexOf("index") != -1) {
						window.location.reload();
					} else {
						//                      window.location.href = this.src+"/index";
						window.location.href = "index.html";
						//						window.location.href = "http://47.52.34.187/page/index.html?__hbt=1565833822726";
					}
				}
			},
			error: function (xmlHttpRequest) {
				$("#login").text("登录").removeAttr("disabled").removeClass("layui-disabled");
				outMsg(xmlHttpRequest);
			}
		});
		return false;
	});

	function outMsg(xmlHttpRequest) {
		// 状态码
		console.log(xmlHttpRequest.status);
		// 返回信息
		var jsonObj = $.parseJSON(xmlHttpRequest.responseText);
		console.log(jsonObj.msg);
		layer.msg(jsonObj.msg);
	}




	$("#reg").click(function () {
		layer.open({
			title: "注册",
			type: 2
				//              ,content: "http://127.0.0.1:8020/YUNLIAN_PAGE/page/reg/reg.html"
				,
			content: "http://47.52.34.187/page/reg/reg.html"
				//              ,maxmin: true
				,
			area: ['500px', '450px']
				//              ,btn:["确定","取消"]
				,
			success: function (layero) {

			}
		})
	})

})