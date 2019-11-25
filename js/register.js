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
			register() {
				console.log(1234)
				var data = {};
				data.phone = $("#register-username").val();
				data.password = $("#register-password").val();
				data.name = $("#register-name").val();
				data.apikey = $("#register-APIKey").val();
				data.secret = $("#register-Secret").val();
				data.passphrase = $("#register-Passphrase").val();
				
				if(isPhoneNo()){
					if(data.password == null || data.password == ''
						|| data.name == null || data.name == ''
						|| data.apikey == null || data.apikey == ''
						|| data.secret == null || data.secret == ''
						|| data.passphrase == null || data.passphrase == '')
					{
						layer.msg("请填写完整信息",{icon: 2});
						return;
					}
					
					addUser(data);
				}
				
				
				
			}
		},
	})


	function isPhoneNo() {
	   var phone=$("#register-username").val();
	   var pattern = /^1[23456789]\d{9}$/;
	   if(!pattern.test(phone)){
	      layer.msg("手机号不正确",{icon: 2});
	      return false
	   }
	   return true
	}

	function addUser(data){
		 mcfish.post("user/addUser",data,function () {
//          var index = parent.layer.getFrameIndex(window.name);
			window.location.href = "login.html";
//          parent.layer.close(index);
        });
	}
});
