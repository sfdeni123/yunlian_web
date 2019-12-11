 //声明全局数据，当前页面数据，和新增数据/编辑数据
var tabledatas = [];
//layui
layui.use(['form', 'table', 'laydate','mcfish','util'], function () {
    var $ = layui.jquery,
        form = layui.form,
        mcfish = layui.mcfish,
        util = layui.util,
        table = layui.table;
    var laydate = layui.laydate;
	
    laydate.render({
        elem: '#createTime' //指定元素
    });
    laydate.render({
        elem: '#startTime' //指定元素
    });
    laydate.render({
        elem: '#endTime' //指定元素
    });
    var myurl = mcfish.parseURL(window.location.href);
	var projectId = myurl.params["projectId"];

	var mywidth = mcfish.IsPC()?"800px":window.screen.width+"px";
	var myheight = mcfish.IsPC()?"500px":window.screen.height/1.8+"px";
	
    var tableIns = table.render({
    	elem: '#currentTableId'
    	,cellMinWidth: 95
        ,where:{projectId:projectId}
        ,limit: 10
        ,headers: {id:layui.data("yunlian_user").user.id}
        ,defaultToolbar: ["filter"]
        ,id: "currentTableId"
        ,toolbar:"#infoBar"
        ,url: mcfish.getReqUri() + '/project/getProjectItemList'
        //url: '../../api/tablejson.json', //假数据
        ,cols: [
            [
//          	{
//                  type: "checkbox",
//                  width: 50,
//                  fixed: "left"
//              },
                {
                    field: 'id',
                    width: 80,
                    title: 'ID',
                    sort: true
                },
                {
                    field: 'projectId',
                    width: 100,
                    title: '项目id'
//                  sort: true
                },
                {
                    field: 'name',
                    width: 180,
                    title: '子项'
                },
                {
                    field: 'budgetPrice',
                    width: 100,
                    title: '单价',
                    templet: function (d) {
                    	return mcfish.toMoney(d.budgetPrice);
             	 	}
                },
                {
                    field: 'budgetCount',
                    width: 80,
                    title: '数量'
                },
                {
                    field: 'budgetPriceSum',
                    width: 120,
                    title: '合计',
                    templet: function (d) {
                    	return mcfish.toMoney(d.budgetPriceSum);
             	 	}
                },
                {
                    field: 'plan',
                    width: 180,
                    title: '计划'
                },
                {
                    field: 'expect',
                    width: 180,
                    title: '期望值'
                },
                {
                    field: 'createTime',
                    width: 180,
                    title: '计划日期',
                    templet: function (d) {
                    	return util.toDateString(d.createTime,'yyyy-MM-dd');
                	}
                },
                {
                    field: 'startTime',
                    width: 180,
                    title: '开始日期',
                    templet: function (d) {
                    	return util.toDateString(d.startTime,'yyyy-MM-dd');
                	}
                },
                {
                    field: 'endTime',
                    width: 180,
                    title: '结束日期',
                    templet: function (d) {
                    	return util.toDateString(d.endTime,'yyyy-MM-dd');
                	}
                },
                {
                    title: '操作',
                    minWidth: 120,
                    templet: '#currentTableBar',
                    fixed: "right",
                    align: "center"
                }
            ]
        ],
        page: true
    });
    


    // 监听搜索操作
    form.on('submit(data-search-btn)', function (data) {
        var result = JSON.stringify(data.field);
        layer.alert(result, {
            title: '最终的搜索信息'
        });

        //执行搜索重载
        table.reload('currentTableId', {
            page: {
                curr: 1
            },
            where: {
                searchParams: result
            }
        }, 'data');

        return false;
    });

	var index;
    // 监听添加操作
    $(".data-add-btn").on("click", function () {
    	
    });
    
table.on('toolbar(currentTableFilter)', function(obj){
	 var checkStatus = table.checkStatus(obj.config.id);
	 switch(obj.event){
	    case 'add':
		 	$("#itemId").css("display","none");
	    	form.val("formTest",{
	    		"id":null
	    		,"name":null
	    		,"budgetPrice":null
	    		,"budgetCount":null
	    		,"plan":null
	    		,"expect":null
	    		,"createTime":null
	    		,"startTime":null
	    		,"endTime":null
	    	});
	    	
	        //弹框，弹出添加数据的div
	        index = layer.open({
	            type: 1,
	            title: "新增项目",
	            closeBtn: 1,
	            shift: 2,
	            id:"addItemLayer",
	            area: [mywidth, myheight],
	            shadeClose: true,
	            content: $("#add-main"),
	            success: function (layero, index) {},
	            yes: function () {
					
	            }
	        });
	    break;
	  };
})
    		
    		
    //保存
    form.on("submit(save)",function (data) {
    	console.log(data);
        var requestUrl = "project/addProjectItem";
        if(data.field.id != null && data.field.id != undefined && data.field.id != ""){
            requestUrl = "project/updateProjectItem";
        }
        data.field.budgetPrice = data.field.budgetPrice * 100;
        data.field.projectId = projectId;
        mcfish.post(requestUrl,data.field,function () {
            layer.close(index);
			table.reload('currentTableId');
        });
    });
    
    //关闭弹窗
    $("#closeBtn").on("click", function () {
    	layer.close(index);
    });


//  // 监听删除操作
//  $(".data-delete-btn").on("click", function () {
//      var checkStatus = table.checkStatus('currentTableId'),
//          data = checkStatus.data;
//      layer.alert(JSON.stringify(data));
//      data.forEach(dataitem => {
//          var delurl = jsonurl + "/" + dataitem.id;
//          fetch(delurl, {
//              method: "delete"
//          }).then(res => res.json);
//      });
//  });


    //监听表格复选框选择
    table.on('checkbox(currentTableFilter)', function (obj) {
        console.log(obj)
    });


    table.on('tool(currentTableFilter)', function (obj) {
        var data = obj.data;
        console.log(data);
        if (obj.event === 'edit') {
            //layer.alert('编辑行：<br>' + JSON.stringify(data));
            //弹框，弹出添加数据的div
            $("#itemId").css("display","block");
            index = layer.open({
                type: 1,
                title: "编辑项目",
                closeBtn: 1,
                shift: 2,
                area: [mywidth, myheight],
                shadeClose: true,
                content: $("#add-main"),
                success: function (layero, index) {
                	data.startTime = util.toDateString(data.startTime,'yyyy-MM-dd');
                	data.endTime = util.toDateString(data.endTime,'yyyy-MM-dd');
                	data.createTime = util.toDateString(data.createTime,'yyyy-MM-dd');
                	data.budgetPrice = data.budgetPrice/100;//因为数据库金钱单位是分
                	form.val("formTest",data);
                },
                yes: function () {
                	
                }
            });
        } else if (obj.event === 'delete') {
            layer.confirm('真的删除行么', function (index) {
                obj.del();
                layer.close(index);
            });
        }
    });


	function getTotal(){
 		mcfish.get("project/getMoneyTotal", {projectId:projectId}, function() {
	 	});
 	}


});