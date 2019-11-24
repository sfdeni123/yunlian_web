layui.use(['form', 'layer', 'table', 'laydate','util', 'mcfish'], function () {

    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,mcfish = layui.mcfish
        ,util = layui.util
        ,table = layui.table;
	
	var userId = 1;
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
	

    
    
    
	
	var mywidth = IsPC()?"800px":window.screen.width+"px";
	var myheight = IsPC()?"500px":window.screen.height/1.8+"px";
	
    //列表
    var tableIns = table.render({
        elem: '#millList'
        ,url: mcfish.getReqUri() + '/mill/getMillList'
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
        ,headers: {id:userId}
        ,toolbar: '#infoBar'
        ,defaultToolbar: ["filter"]
        ,id: "useList"
        ,cols: [[
            {field: 'id', title: '编号', sort: true,width: 80}
            ,{field: 'name', title: '矿机名称', width: 130}
            ,{field: 'hashrate', title: '算力',width: 130,align: "center",templet: function (d) {
                    return d.hashrate+"T";
             	 }
            }
            ,{field: 'earningPer', title: '每T收益', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.earning_per);
             	 }
            }
            ,{field: 'electricity', title: '电费', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.electricity);
             	 }
            }
            ,{field: 'coin', title: '每日产币', sort: true,width:130}
            ,{field: 'count', title: '数量', sort: true,width:200}
            ,{title: '操作',minWidth:130, align: "center", toolbar: '#barDemo'}
        ]]
    });
 	
 	
 	
 	
    //监听工具条
    table.on('tool(millInfo)', function (obj) {
        if(obj.event === 'edit'){
            layer.open({
                title: "编辑"
                ,type: 2
                ,content:'http://127.0.0.1:8020/bootstrapvuedemo/page/mill/edit.html' 
//              ,content:'http://47.52.34.187/page/mill/edit.html' 
//              ,maxmin: true
                ,offset: 'auto'
//              ,area: 'auto'
                ,area: [mywidth, myheight]
                ,success: function (layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.parentData = obj.data;
//                  iframeWin.adminList = 	adminList;
//                  iframeWin.useList = 	useList;
                    iframeWin.typeList = typeList;
                
                }
            })
        }else if(obj.event === 'delete'){
        	layer.confirm("确定删除吗", {icon: 2, title:'提示'}, function(index){
        		layer.close(index);
        	})
        }
    });


    //发布广告
    form.on('submit(addInfo)', function(){
       layer.open({
                title: "编辑"
                ,type: 2
                ,content:'http://127.0.0.1:8020/bootstrapvuedemo/page/financial/financial_bill_edit.html' 
//              ,content:'http://47.52.34.187/page/mill/edit.html' 
//              ,maxmin: true
                ,offset: 'auto'
                ,area: [mywidth, myheight]
                ,success: function (layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.parentData = '';
                    iframeWin.typeList = typeList;
                
                }
            })
    });
   	
});






