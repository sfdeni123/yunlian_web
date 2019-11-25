layui.use(['form', 'layer', 'table', 'util', 'mcfish'], function () {

    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,mcfish = layui.mcfish
        ,util = layui.util
        ,table = layui.table;

    var adminList;
    var useList;
	var typeList;
	
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
	var myheight = IsPC()?"500px":window.screen.height/2+"px";
	
    mcfish.get("money/getFormData",null,function (res) {
        adminList = res.data.adminList;
        useList = res.data.useList;
        typeList = res.data.typeList;
    },false);
    
	
    //列表
    var tableIns = table.render({
        elem: '#moneyList'
        ,url: mcfish.getReqUri() + '/money/getMoneyList'
        ,headers: {token: layui.sessionData("hdcm_operation").user.token,id:layui.sessionData("hdcm_operation").user.id}
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
        ,toolbar: '#infoBar'
        ,defaultToolbar: ["filter"]
        ,id: "moneyListTable"
        ,cols: [[
            {field: 'id', title: '记录编号', minWidth: 100}
            ,{field: 'comment', title: '备注'}
            ,{field: 'typeName', title: '项目'}
            ,{field: 'useName', title: '用途'}
            ,{field: 'image', title: '图片',width:100, toolbar: '#palyToolbar'}
            ,{field: 'category', title: '类型',templet: "#categoryTpl"}
            ,{field: 'moneyTime', title: '账单时间', minWidth:160, templet: function (d) {
                    return util.toDateString(d.moneyTime);
                }
            }
            ,{field: 'money', title: '金额', width:130, templet: function (d) {
                    return mcfish.toMoney(d.money);
             	 }
            }
            ,{field: 'receivable', title: '应收',width:130,templet: function (d) {
                    return mcfish.toMoney(d.receivable);
            	}
            }
            ,{field: 'pay', title: '实收',width:130, templet: function (d) {
                    return mcfish.toMoney(d.pay);
                }
            }
            ,{field: 'status', title: '状态', width:100, templet: "#statusTpl" }
            ,{field: 'userName', title: '记录者'}
            ,{field: 'createTime', title: '记录时间', minWidth:160, templet: function (d) {
                    return util.toDateString(d.createTime);
                }
            }
            ,{title: '操作',width:250, align: "center", toolbar: '#barDemo'}
        ]]
    });


   	var typeDemo = '';
    layui.each(typeList,function(key,value){
        typeDemo += `<option value="${value.id}">${value.name}</option>`;
    });
    $("[name='typeList']").append(typeDemo);
    

 	function editAdsStatus(data, index) {
        mcfish.post('money/updateMoneyStatus',data,function () {
            tableIns.reload();
            layer.close(index);
        })
   	} 
 	
 	
 	
   	form.on('select(typeInfo)', function(data){
		
		var param = {};
		param.typeId = data.value;
		
		tableIns.reload({
		page: {
		    curr: 1 //重新从第 1 页开始
		}
		,where: param
		});

		var typeDemo = '';
	    layui.each(typeList,function(key,value){
	        typeDemo += `<option value="${value.id}">${value.name}</option>`;
	    });
	    $("[name='typeList']").append(typeDemo);
	    
	    $("[name='typeList']").val(data.value);
	});      
      
    //监听工具条
    table.on('tool(moneyList)', function (obj) {
        if(obj.event === 'yes'){
        	var data = obj.data;
            layer.msg('确定对状态进行修改', {
                    time: 20000 //20s后自动关闭
                    ,btn: ['确定',  '取消']
                    ,btnAlign: 'c'
                    ,yes: function (index) {
                        data.status = 1;
                        editAdsStatus(data, index);
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
                        data.status = 2;
                        editAdsStatus(data, index);
                    }
                    ,btn2: function () {
                        return true;
                    }
                });
        }else if(obj.event === 'edit'){
        	
        	console.log(window.screen.width);
        	
        	console.log(window.screen.height);
            layer.open({
                title: "编辑"
                ,type: 2
//              ,content: mcfish.getReqUri() + "/ads/editPage"
//              ,content: "http://127.0.0.1:8020/YUNLIAN_PAGE/page/money/edit.html"
                ,content: "http://47.52.34.187/page/money/edit.html"
//              ,maxmin: true
                ,offset: '10px'
//              ,area: ['800px', '500px']
                ,area: [mywidth, myheight]
                ,success: function (layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.parentData = obj.data;
                    iframeWin.adminList = 	adminList;
                    iframeWin.useList = 	useList;
                    iframeWin.typeList = typeList;
                }
            })
        }else if(obj.event === 'paly'){
            var content = obj.data.image;
            
            if(content != null && content != ''){
				let imageArray = content.split(";");
				let imageS = '';
				$(imageArray).each(function(index,item){
					let image = `<img src="${item}" width=`+window.screen.width/2.5+`"px" height="400px" style="margin: 5px;border: 1px solid #ccc;padding: 2px;border-radius: 4px;"/>`
						imageS += image;
				});
 				layer.open({
	                type : 1
	                ,content: imageS
	                ,maxmin: true
//	                ,area: ['900px', '600px']
					,area: [mywidth, myheight]
	                ,btn: "关闭"
	            })
			}
//          content =  `<img src="${content}" style="width: 880px;">`;
//          content += content;
        }
    });


    //发布广告
    form.on('submit(addInfo)', function(){
    	
        layer.open({
            title: "新增记录"
            ,type: 2
//          ,content: "http://127.0.0.1:8020/YUNLIAN_PAGE/page/money/edit.html"
            ,content: "http://47.52.34.187/page/money/edit.html"
            ,maxmin: true
            ,offset: '10px'
            ,area: [mywidth, myheight]
            ,success: function (layero) {
            	var iframeWin = window[layero.find('iframe')[0]['name']];
	            iframeWin.parentData = '';
	            iframeWin.adminList = 	adminList;
	            iframeWin.useList = 	useList;
	            iframeWin.typeList = typeList;
            }
            ,end: function(){
            	var typeDemo = '';
			    layui.each(typeList,function(key,value){
			        typeDemo += `<option value="${value.id}">${value.name}</option>`;
			    });
			    $("[name='typeList']").append(typeDemo);
            }
        })
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
