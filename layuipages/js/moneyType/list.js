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
    //用户列表
    var tableIns = table.render({
        elem: '#moneyTypeList'
        ,url: mcfish.getReqUri() + '/money/getMoneyTypeList'
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

 	function editTypeStatus(data, index) {
        mcfish.post('money/editMoneyType',data,function () {
            tableIns.reload();
            layer.close(index);
        })
   	}
 
 	function addType(data, index) {
        mcfish.post('money/addMoneyType',data,function () {
            tableIns.reload();
            layer.close(index);
        })
   	} 
 
    //监听工具条
    table.on('tool(moneyTypeList)', function (obj) {
       if(obj.event === 'edit'){
            layer.open({
                title: "编辑"
                ,type: 1
                ,content: `<div class="layui-form pad10">
				<div class="layui-form-item">
					<label class="layui-form-label">项目</label>
					<div class="layui-input-block">
						<input name="type"  placeholder="请输入项目" autocomplete="off" class="layui-input" lay-verify="required">
					</div>
				</div>
			</div>`
                ,maxmin: true
                ,offset: '10px'
                ,area: [mywidth, myheight]
                ,btn: ['确定', '取消']
                ,btnAlign: 'c'
                ,success: function (layero,index) {
                	  $("[name='type']").val(obj.data.name);
                }
                ,yes: function(index, layero){
                	var data = obj.data;
                	data.name =  $("[name='type']").val();
                	delete data.status;
				    mcfish.post('money/editMoneyType',data,function () {
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
                      
                        editTypeStatus(data, index);
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
                        editTypeStatus(data, index);
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
                        mcfish.post('money/delMoneyType',data,function () {
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


    //发布广告
    form.on('submit(addInfo)', function(){
         layer.open({
                title: "新增"
                ,type: 1
                ,content: `<div class="layui-form pad10">
				<div class="layui-form-item">
					<label class="layui-form-label">项目</label>
					<div class="layui-input-block">
						<input name="addType"  placeholder="请输入项目" autocomplete="off" class="layui-input" lay-verify="required">
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
                	data.name =  $("[name='addType']").val();
				    mcfish.post('money/addMoneyType',data,function () {
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
    
    
    /*table.on('toolbar(moneyList)', function (obj) {
        if(obj.event == "payInfo"){
            layer.open({
                title: "付款信息"
                ,type: 1
                ,content:`<div class="layui-fluid payInfo-center">
                            <div class="layui-row layui-col-space5">
                                <div class="layui-col-md4 card">
                                    <div class="layui-elip layui-block">银行账户名：xxxx</div>
                                    <div class="layui-elip layui-block">银行卡号：xxxx</div>
                                    <div class="layui-elip layui-block">开户行名称：xxxx</div>
                                </div>
                                <div class="layui-col-md4">
                                    <div class="">支付宝二维码</div>
                                    <img style="width: 200px;" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548332981149&di=45956b9afac3cc640f6d6dd1f2d41949&imgtype=0&src=http%3A%2F%2Fimgbdb3.bendibao.com%2Fnjbdb%2F201511%2F10%2F2015111014117844.jpg">
                                    <div class="">Elylon</div>
                                </div>
                                <div class="layui-col-md4">
                                    <div class="">微信二维码</div>
                                    <img style="width: 200px" src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548332981149&di=45956b9afac3cc640f6d6dd1f2d41949&imgtype=0&src=http%3A%2F%2Fimgbdb3.bendibao.com%2Fnjbdb%2F201511%2F10%2F2015111014117844.jpg">
                                    <div class="">Elylon</div>
                                </div>
                            </div>
                        </div>`
                ,area: ['800px', '400px']
            })
        }
    })*/
   
   
   
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
