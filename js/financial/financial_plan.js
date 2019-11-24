layui.use(['form', 'layer', 'table', 'util', 'mcfish'], function () {

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
	
    //列表
    var tableIns = table.render({
        elem: '#typeList'
        ,url: mcfish.getReqUri() + '/money/getMoneyTypeList'
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
        ,headers: {id:userId}
        ,toolbar: '#infoBar'
        ,defaultToolbar: ["filter"]
        ,id: "typeList"
        ,cols: [[
            {field: 'id', title: '项目编号', sort: true,width: 120}
            ,{field: 'name', title: '项目名', width: 140}
            ,{field: 'useNum', title: '用途总数',width: 130,align: "center"}
            ,{field: 'sumMoney', title: '总预算', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.sumMoney);
             	 }
            }
            ,{field: 'sumOut', title: '总支出', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.sumOut);
             	 }
            }
            ,{field: 'sumIn', title: '总收入', sort: true,width:130, templet: function (d) {
                    return mcfish.toMoney(d.sumIn);
             	 }
            }
//          ,{field: 'status', title: '状态', width:100, templet: "#statusTpl" }
            ,{title: '操作',minWidth:130, align: "center", toolbar: '#barDemo'}
        ]]
    });
 	
 	
 	
    //监听工具条
    table.on('tool(typeInfo)', function (obj) {
        if(obj.event === 'edit'){
            layer.open({
                title: "编辑"
                ,type: 1
                ,content: 
                `<div class="layui-form pad10">
					<div class="layui-form-item">
					<label class="layui-form-label">项目名</label>
					<div class="layui-input-block">
						<input name="typeName"  placeholder="请输入项目名" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>`
//              ,maxmin: true
                ,offset: 'auto'
                ,area: 'auto'
                ,btn: ['确定', '取消']
                ,success: function (layero) {
                	$("[name='typeName']").val(obj.data.name);
                }
                ,yes:function(index,layero){
                	var data = obj.data;
                	data.name = $("[name='typeName']").val();
                	if(data.name == null || data.name == ''){
                		layer.msg('项目名不能为空', {
							  icon: 2,
							  time: 1000 //2秒关闭（如果不配置，默认是3秒）
							});
						return;
                	}
                	mcfish.post('money/editMoneyType',data,function () {
			            tableIns.reload();
			            layer.close(index);
			        })
                }
                ,btn2:function(index,layero){
                	layer.close(index);
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
            title: "新增项目"
            ,type: 1
 			,content: 
                `<div class="layui-form pad10">
					<div class="layui-form-item">
					<label class="layui-form-label">项目名</label>
					<div class="layui-input-block">
						<input name="typeName"  placeholder="请输入项目名" class="layui-input">
					</div>
				</div>`
//          ,maxmin: true
            ,offset: 'auto'
            ,area: 'auto'
            ,btn: ['确定', '取消']
            ,success: function (layero) {
            	
            }
            ,end: function(){
            }
            ,yes:function(index,layero){
            	var data = [];
            	data.name = $("[name='typeName']").val();
            	data.userId = userId;
            	if(data.name == null || data.name == ''){
            		layer.msg('项目名不能为空', {
						  icon: 2,
						  time: 1000 //2秒关闭（如果不配置，默认是3秒）
						});
					return;
            	}
            	
            	mcfish.post('money/addMoneyType',data,function () {
		            tableIns.reload();
		            layer.close(index);
		        })
            }
            ,btn2:function(index,layero){
            	layer.close(index);
            }
        })
    });
   	
});






