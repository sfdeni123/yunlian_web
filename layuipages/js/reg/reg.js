
var maxtime = 60; //一个小时，按秒计算，自己调整!
var timer;
layui.use(['form','layer','mcfish','laydate', 'upload'],function(){
    var form = layui.form
        ,layer = layui.layer
        ,mcfish = layui.mcfish
        ,laydate = layui.laydate
        ,upload = layui.upload
        ,$ = layui.jquery;
	
		
		layui.use('laydate', function(){
		  var laydate = layui.laydate;
		  //执行一个laydate实例
		  laydate.render({
		    elem: '#moneyTime' //指定元素
		    ,type: 'datetime'
		    ,trigger: 'click'
		    ,format :'yyyy-MM-dd HH:mm:ss'
		  });
		});


	function CountDown() {
 		console.log(maxtime);
 		if (maxtime >= 0) {
        	msg = maxtime + "秒后重发";
 			document.getElementById("pushCode").innerHTML = msg;
 			
 			if (maxtime > 0){
        	 	--maxtime;
 			} else{
 				document.getElementById("pushCode").innerHTML = "发送验证码";
				$("#pushCode").removeAttr("disabled"); 
				$("#pushCode").removeAttr("readOnly"); 
				$("#pushCode").attr("style","");
     			clearInterval(timer);
    		}
 		}
 	}


    
    form.on("submit(pushCode)",function (data) {
    	
    	if(!(/^1[2345789]\d{9}$/.test($("[name='phone']").val()))){ 
        	layer.msg('手机号不正确', {icon: 7}); 
        	return false; 
   		 } 
    
    	
    
		var param = {};
		param.phone = data.field.phone;
		param.type = 1;
		maxtime = 60;
        mcfish.post("user/phoneCode",param,function () {
//          var index = parent.layer.getFrameIndex(window.name);
//          parent.layer.close(index);
			$("#pushCode").attr("disabled","disabled"); 
			$("#pushCode").attr("readOnly","readOnly"); 
			$("#pushCode").css("cursor","not-allowed");
			
			timer = setInterval(function(){
				CountDown();
			}, 1000);
        });
    });
    
    
    form.on("submit(save)",function (data) {

		if(data.field.password != data.field.sure_password){
			layer.msg('两次次密码不相同', {icon: 2}); 
			return;
		}
		
		if(data.field.password.length < 6){
			layer.msg('密码长度不少于6位', {icon: 7}); 
			return;
		}
        mcfish.post("user/addUser",data.field,function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
        });
    });

});

