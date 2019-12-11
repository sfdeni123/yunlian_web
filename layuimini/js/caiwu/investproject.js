 layui.use(['form', 'table', 'laydate', 'mcfish', 'util','layuimini'], function() {
	 	var $ = layui.jquery,
		 		form = layui.form,
		 		mcfish = layui.mcfish,
		 		util = layui.util,
		 		table = layui.table;
	 	var laydate = layui.laydate;
	
	 	var mywidth = mcfish.IsPC() ? "800px" : window.screen.width + "px";
	 	var myheight = mcfish.IsPC() ? "500px" : window.screen.height / 1.8 + "px";
	
	 	var tableIns = table.render({
		 		elem: '#currentTableId',
		 		cellMinWidth: 95,
		 		limit: 10,
		 		headers: {
		 			id: layui.data("yunlian_user").user.id
		 		},
		 		defaultToolbar: ["filter"],
		 		id: "currentTableId",
		 		toolbar: "#infoBar",
		 		url: mcfish.getReqUri() + '/project/getProjectList',
		 		cols: [
		 			[{
		 					field: 'id',
		 					width: 80,
		 					title: 'ID',
		 					sort: true
		 				},
		 				{
		 					field: 'name',
		 					minwidth: 100,
		 					title: '项目名称'
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
	 	form.on('submit(data-search-btn)', function(data) {
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

		table.on('toolbar(currentTableFilter)', function(obj){
			 var checkStatus = table.checkStatus(obj.config.id);
			 switch(obj.event){
			    case 'add':
			    		console.log(123);
					 		$("#itemId").css("display", "none");
					 		form.val("formTest", {
					 				"id": null,
					 				"name": null
					 		});
					 		//弹框，弹出添加数据的div
					 		index = layer.open({
						 			type: 1,
						 			title: "新增项目",
						 			closeBtn: 1,
						 			shift: 2,
						 			id: "addItemLayer",
						 			area: 'auto',
						 			shadeClose: true,
						 			content: $("#add-main"),
						 			success: function(layero, index) {},
						 			yes: function() {
						
						 			}
					 		});
			    break;
			  };
		})
		
	 	//保存
	 	form.on("submit(save)", function(data) {
		 		console.log(data);
		 		var requestUrl = "project/addProject";
		 		if(data.field.id != null && data.field.id != undefined && data.field.id != "") {
		 				requestUrl = "project/updateProject";
		 		}
//		 		mcfish.post(requestUrl, data.field, function() {
//		 				layer.close(index);
//		 				tableIns.reload();
//		 				if(requestUrl == "project/addProject"){
//		 						mcfish.get("system/getInit",{},function(res){
//									layuimini.init($.parseJSON(res.data));
//								});
//      
//		 				}
//		 		});
	 	});
	
	 	//关闭弹窗
	 	$("#closeBtn").on("click", function() {
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
	 	table.on('checkbox(currentTableFilter)', function(obj) {
	 			console.log(obj)
	 	});
	
	 	table.on('tool(currentTableFilter)', function(obj) {
		 		var data = obj.data;
		 		console.log(data);
		 		if(obj.event === 'edit') {
			 			//layer.alert('编辑行：<br>' + JSON.stringify(data));
			 			//弹框，弹出添加数据的div
			 			$("#itemId").css("display", "block");
			 			index = layer.open({
				 				type: 1,
				 				title: "编辑项目",
				 				closeBtn: 1,
				 				shift: 2,
				 				shadeClose: true,
				 				content: $("#add-main"),
				 				success: function(layero, index) {
				 					form.val("formTest", data);
				 				},
				 				yes: function() {
				
				 				}
			 			});
		 		} else if(obj.event === 'delete') {
		 			layer.confirm('真的删除行么', function(index) {
		 					obj.del();
		 					layer.close(index);
		 			});
		 		}
	 	});
	 	
	 	
	 
 });