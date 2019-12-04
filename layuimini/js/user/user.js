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
            {field: 'name', title: '姓名', width: 80,templet: function (d) {
                    return (d.value*1).toFixed(3);
             	 }
            }
            ,{field: 'usdtNum', title: 'USDT余额', width:80,templet:function(d){
            		return parseFloat(d.num).toFixed(3);
           		}
            }
            ,{field: 'buyUsdt', title: '补仓USDT', width:100}
            ,{field: 'positionUsdt', title: '开仓USDT', width:70}
            ,{field: 'positionUsdt', title: '开仓占比', width: 120,templet: function (d) {
            		return parseFloat(positionUsdt)/(parseFloat(positionUsdt)+parseFloat(buyUsdt)+parseFloat(usdtNum))*100;
             	}
            }
        ]]
    });
   	

   	
});








