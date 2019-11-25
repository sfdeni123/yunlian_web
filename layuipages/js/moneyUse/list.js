layui.use(['form', 'layer', 'table', 'util', 'mcfish'], function () {

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
	var mywidth = IsPC()?"500px":window.screen.width+"px";
	var myheight = IsPC()?"200px":window.screen.height/5+"px";
//  var useList;
//
//  mcfish.get("money/getFormData",null,function (res) {
//      useList = res.data.useList;
//  },false);

    //用户列表
    var tableIns = table.render({
        elem: '#moneyUseList'
        ,url: mcfish.getReqUri() + '/money/getMoneyUseList'
        ,headers: {token: layui.sessionData("hdcm_operation").user.token,id:layui.sessionData("hdcm_operation").user.id}
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
        ,toolbar: '#infoBar'
        ,defaultToolbar: ["filter"]
        ,id: "adsListTable"
        ,cols: [[
            {field: 'id', title: 'ID', minWidth: 220}
            ,{field: 'adminName', title: '添加/修改'}
            ,{field: 'name', title: '用途'}
            ,{field: 'status', title: '状态', width:100, templet: "#statusTpl" }
            ,{field: 'createTime', title: '记录时间', minWidth:160, templet: function (d) {
                    return util.toDateString(d.createTime);
                }
            }
            ,{title: '操作', width: 300, align: "center", toolbar: '#barDemo'}
        ]]
    });

 	function editUseStatus(data, index) {
        mcfish.post('money/editMoneyUse',data,function () {
            tableIns.reload();
            layer.close(index);
        })
   	}
 
 	function addUse(data, index) {
        mcfish.post('money/addMoneyUse',data,function () {
            tableIns.reload();
            layer.close(index);
        })
   	} 
 
    //监听工具条
    table.on('tool(moneyUseList)', function (obj) {
       if(obj.event === 'edit'){
            layer.open({
                title: "编辑"
                ,type: 1
                ,content: `<div class="layui-form pad10">
				<div class="layui-form-item">
					<label class="layui-form-label">用途</label>
					<div class="layui-input-block">
						<input name="use"  placeholder="请输入用途" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>
			</div>`
                ,maxmin: true
                ,offset: '10px'
                ,area: [mywidth, myheight]
                ,btn: ['确定', '取消']
                ,btnAlign: 'c'
                ,success: function (layero,index) {
                	console.log(layero);
                	  $("[name='use']").val(obj.data.name);
                }
                ,yes: function(index, layero){
                	var data = obj.data;
                	data.name =  $("[name='use']").val();
                	delete data.status;
				    mcfish.post('money/editMoneyUse',data,function () {
			            tableIns.reload();
			            layer.close(index);
			        })
				}
                ,btn2: function(index,layero){
                	layer.close(index);
                }
            })
        }else if(obj.event === 'yes'){
        	var data = obj.data;
            layer.msg('确定对状态进行修改', {
                    time: 20000 //20s后自动关闭
                    ,btn: ['确定',  '取消']
                    ,btnAlign: 'c'
                    ,yes: function (index) {
                        data.status = 0;
                        console.log(data)
                        editUseStatus(data, index);
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
                        editUseStatus(data, index);
                    }
                    ,btn2: function () {
                        return true;
                    }
                });
        }else if(obj.event === 'del'){
        	var data = obj.data;
            layer.msg('确定对该条数据进行删除?', {
                    time: 20000 //20s后自动关闭
                    ,btn: ['确定',  '取消']
                    ,btnAlign: 'c'
                    ,yes: function (index) {
                        mcfish.post('money/delMoneyUse',data,function () {
				            tableIns.reload();
				            layer.close(index);
				        })
                    }
                    ,btn2: function () {
                        return true;
                    }
                });
        }
    });


    //发布
    form.on('submit(addInfo)', function(){
         layer.open({
                title: "新增"
                ,type: 1
                ,content: `<div class="layui-form pad10">
				<div class="layui-form-item">
					<label class="layui-form-label">用途</label>
					<div class="layui-input-block">
						<input name="adduse"  placeholder="请输入用途" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>
			</div>`
                ,maxmin: true
                ,offset: '10px'
                ,area: [mywidth, myheight]
                ,btn: ['确定', '取消']
                ,btnAlign: 'c'
                ,success: function (layero,index) {
                	
                }
                ,yes: function(index, layero){
                	var data = {};
                	data.name =  $("[name='adduse']").val();
				    mcfish.post('money/addMoneyUse',data,function () {
			            tableIns.reload();
			            layer.close(index);
			        })
				}
                ,btn2: function(index,layero){
                	layer.close(index);
                }
            })
    });

    //监听搜索按钮
    form.on('submit(submit)', function(data){
        table.reload('adsListTable', {
            page: {
                curr: 1 //重新从第 1 页开始
            },
            where: data.field
        });
    });
    
	
	
	function handleTouchEvent(event) {
	    if (event.touches.length == 1) {
	        switch (event.type) {
	            case "touchstart":
	 				var icon = parent.layui.$("#LAY_app_flexible");
	              	if(event.touches[0].clientX > window.screen.width/2){
	              		icon.removeClass("layui-icon-shrink-right");
            			icon.addClass("layui-icon-spread-left")
	              		parent.layui.$(".layui-layout-admin").addClass("showMenu");
                		parent.layui.$(".layui-layout-left").css({left:"0px"});
	              	}
					
	                break;
	
	        }
	    }
	}
	document.addEventListener("touchstart", handleTouchEvent, false);


});
