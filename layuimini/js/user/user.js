var phone = JSON.parse(window.localStorage.getItem("yunlian_user")).user.phone;
var tableIns;

layui.use(['form', 'layer', 'table', 'laydate','util', 'mcfish'], function () {
    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,mcfish = layui.mcfish
        ,util = layui.util
        ,table = layui.table;
        
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
	console.log("123")
	var mywidth = IsPC()?"800px":window.screen.width+"px";
	var myheight = IsPC()?"500px":window.screen.height/1.8+"px";

    //列表
    tableIns = table.render({
        elem: '#coinBuyList'
        ,url: mcfish.getReqUri() + '/person/getUserList'
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
        ,headers: {id:layui.data("yunlian_user").user.id}
        ,defaultToolbar: ["filter"]
        ,id: "coinBuyList"
        ,cols: [[
            {field: 'name', title: '姓名', width: 80
            }
            ,{field: 'positionUsdt', title: '开仓USDT', width:100,templet: function (d) {
            	if(d.coin == null){
            		return "";
            	}
            	return d.coin+d.positionUsdt;
            }
            }
            ,{field: 'liquidationPrice', title: '爆仓价', width:100}
            ,{field: 'usdtNum', title: 'USDT余额', width:100,templet: function (d) {
            	if(d.usdtNum == null){
            		return 0;
            	}else{
            		return d.usdtNum;
            	}
            }
            }
            ,{field: 'buyUsdt', title: '补仓USDT', width:100,templet: function (d) {
            	if(d.buyUsdt == null){
            		return 0;
            	}else{
            		return d.buyUsdt;
            	}
            }
            }
            ,{field: 'sellUsdt', title: '卖出USDT', width:100,templet: function (d) {
            	if(d.sellUsdt == null){
            		return 0;
            	}else{
            		return (d.sellUsdt*1).toFixed(2);
            	}
            	
            }
            }
            
            ,{field: 'positionUsdt', title: '开仓占比', width: 120,templet: function (d) {
	            	if(d.coin == null){
	            		return "";
	            	}
            		return (parseFloat(d.positionUsdt)/(parseFloat(d.positionUsdt)+parseFloat(d.buyUsdt)+parseFloat(d.usdtNum)-parseFloat(d.sellUsdt))*100).toFixed(2);
             	}
            }
            ,{title: '操作',width:150, align: "center", toolbar: '#barDemo',fixed: "right",align: "center"}
        ]]
    });
   	
   	
   	
   	  //监听工具条
    table.on('tool(coinBuyInfo)', function (obj) {
    	console.log(obj)
        if(obj.event === 'yes'){
        	var data = obj.data;
            layer.msg('确定对状态进行修改', {
                    time: 20000 //20s后自动关闭
                    ,btn: ['确定',  '取消']
                    ,btnAlign: 'c'
                    ,yes: function (index) {
                        data.status = 1;
                        editUserStatus(data, index);
                    }
                    ,btn2: function () {
                        return true;
                    }
                });
        }else if(obj.event === 'no'){
        	var data = obj.data;
            layer.msg('确定对状态进行修改', {
                    time: 20000 //20s后自动关闭
                    ,btn: ['确定',  '取消']
                    ,btnAlign: 'c'
                    ,yes: function (index) {
                        data.status = 1;
                        editUserStatus(data, index);
                    }
                    ,btn2: function () {
                        return true;
                    }
                });
		}
		function editUserStatus(data, index) {
	        mcfish.post('person/updateUser',data,function () {
	            tableIns.reload();
	            layer.close(index);
	        })
	    }
    });

   	
   	
});








