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
	
	
	var typeList;
	
    mcfish.get("money/getFormData",null,function (res) {
        typeList = res.data.typeList;
    },false);
    
    
    
	
	var mywidth = IsPC()?"800px":window.screen.width+"px";
	var myheight = IsPC()?"500px":window.screen.height/1.8+"px";
	
	layui.use('laydate', function(){
	  var laydate = layui.laydate;
	  //执行一个laydate实例
	  laydate.render({
	    elem: '#start_time' //指定元素
	    ,type: 'datetime'
	    ,trigger: 'click'
	    ,format :'yyyy-MM-dd HH:mm:ss'
	  });
	});
	
	
    //列表
    var tableIns = table.render({
        elem: '#useList'
        ,url: mcfish.getReqUri() + '/money/getMoneyUseList'
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
        ,headers: {id:userId}
        ,toolbar: '#infoBar'
        ,defaultToolbar: ["filter"]
        ,id: "useList"
        ,cols: [[
            {field: 'id', title: '编号', sort: true,width: 80}
            ,{field: 'typeName', title: '项目名', width: 130}
            ,{field: 'name', title: '用途名',width: 130,align: "center"}
            ,{field: 'money', title: '总预算', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.money);
             	 }
            }
            ,{field: 'per_money', title: '单价', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.per_money);
             	 }
            }
            ,{field: 'count', title: '数量', sort: true,width:130}
            ,{field: 'plan', title: '想法', sort: true,width:200}
            ,{field: 'expect', title: '期望', sort: true,width:200}
            ,{field: 'create_time', title: '制定日期', sort: true,width:130,templet: function (d) {
                    return util.toDateString(d.create_time,'yyyy-MM-dd');
                }
            }
            ,{field: 'start_time', title: '预计开始日期', sort: true,width:130,templet: function (d) {
                    return util.toDateString(d.start_time,'yyyy-MM-dd');
                }
            }
            ,{field: 'end_time', title: '预计结束日期', sort: true,width:130,templet: function (d) {
                    return util.toDateString(d.end_time,'yyyy-MM-dd');
                }
            }
            ,{title: '操作',minWidth:130, align: "center", toolbar: '#barDemo'}
        ]]
    });
 	
 	
 	
 	
    //监听工具条
    table.on('tool(typeInfo)', function (obj) {
        if(obj.event === 'edit'){
            layer.open({
                title: "编辑"
                ,type: 2
//              ,content:'http://127.0.0.1:8020/bootstrapvuedemo/page/financial/financial_bill_edit.html' 
                ,content:'http://47.52.34.187/page/financial/financial_bill_edit.html' 
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
//              ,content:'http://127.0.0.1:8020/bootstrapvuedemo/page/financial/financial_bill_edit.html' 
                ,content:'http://47.52.34.187/page/financial/financial_bill_edit.html' 
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






