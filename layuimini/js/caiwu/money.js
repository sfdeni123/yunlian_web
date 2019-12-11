layui.use(['form', 'layer', 'table', 'util', 'mcfish'], function () {

    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,mcfish = layui.mcfish
        ,util = layui.util
        ,table = layui.table;

    var projectList = [];
	var itemList = [];
	
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
	
    mcfish.get("project/getFormData",null,function (res) {
        projectList = res.data.projectList;
        itemList = res.data.itemList;
    },true);
    
    function getProject( projectId ){
    	var str;
    	projectList.forEach(v=>{
		    if(v.id == projectId){
		    	str = v.name;
		    }
		});
		return str;
    }

    function getItem( itemId ){
    	var str;
    	itemList.forEach(v=>{  
		    if(v.id == itemId){
		    	str = v.name;
		    }
		});
		return str;
    }
    //列表
    var tableIns = table.render({
        elem: '#moneyList'
        ,url: mcfish.getReqUri() + '/project/getMoneyList'
        ,headers: {token: layui.data("yunlian_user").user.token,id:layui.data("yunlian_user").user.id}
        ,cellMinWidth: 95
        ,page: true
        ,limit: 10
//      ,toolbar: '#infoBar'
        ,defaultToolbar: ["filter"]
        ,id: "moneyListTable"
        ,cols: [[
            {field: 'id', title: '记录编号', minWidth: 100}
            ,{field: 'comment', title: '备注',width:150}
            ,{field: 'projectId', title: '项目',templet:function(d){
            		return getProject(d.projectId)
            	}
            }
            ,{field: 'itemId', title: '用途',templet:function(d){
            		return getItem(d.itemId);
            	}
            }
            ,{field: 'image', title: '图片',width:100, toolbar: '#palyToolbar'}
            ,{field: 'category', title: '类型',templet: "#categoryTpl"}
            ,{field: 'moneyTime', title: '账单时间', minWidth:160, templet: function (d) {
                    return util.toDateString(d.moneyTime,'yyyy-MM-dd');
                }
            }
            ,{field: 'budget_price_sum', title: '金额', width:130, templet: function (d) {
                    return mcfish.toMoney(d.budgetPriceSum);
             	 }
            }
            ,{field: 'createTime', title: '记录时间', minWidth:160, templet: function (d) {
                    return util.toDateString(d.createTime);
                }
            }
            ,{title: '操作',width:150, align: "center", toolbar: '#barDemo',fixed: "right",align: "center"}
        ]]
    });

   	var typeDemo = '';
    layui.each(projectList,function(key,value){
        typeDemo += `<option value="${value.id}">${value.name}</option>`;
    });
    $("[name='typeList']").append(typeDemo);
	form.val("moneyFilter",{
		"typeList":typeDemo
	})
	
 	function editAdsStatus(data, index) {
        mcfish.post('money/updateMoneyStatus',data,function () {
            tableIns.reload();
            layer.close(index);
        })
   	} 
 	
   	form.on('select(typeInfo)', function(data){
		var param = {};
		param.projectId = data.value;
		tableIns.reload({
		page: {
		    curr: 1 //重新从第 1 页开始
		}
		,where: param
		});
	});      
      
    
    //监听工具条
    table.on('tool(moneyList)', function (obj) {
        if(obj.event === 'yes'){
        	
        }else if(obj.event === 'no'){
        	
        }else if(obj.event === 'edit'){
        	
            layer.open({
                title: "编辑"
                ,type: 2
                ,content: "money_edit.html"
//              ,maxmin: true
                ,offset: '10px'
//              ,area: ['800px', '500px']
                ,area: [mywidth, myheight]
                ,success: function (layero) {
                    var iframeWin = window[layero.find('iframe')[0]['name']];
                    iframeWin.parentData = obj.data;;
	            	iframeWin.projectList = 	projectList;
	            	iframeWin.itemList = 	itemList;
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

    //发布
    form.on('submit(addInfo)', function(){
        layer.open({
            title: "新增记录"
            ,type: 2
            ,content: "money_edit.html"
            ,maxmin: true
            ,offset: '10px'
            ,area: [mywidth, myheight]
            ,success: function (layero) {
            	var iframeWin = window[layero.find('iframe')[0]['name']];
	            iframeWin.parentData = '';
	            iframeWin.projectList = 	projectList;
	            iframeWin.itemList = 	itemList;
            }
            ,end: function(){
//          	var typeDemo = '';
//			    layui.each(typeList,function(key,value){
//			        typeDemo += `<option value="${value.id}">${value.name}</option>`;
//			    });
//			    $("[name='typeList']").append(typeDemo);
            }
        })
    });
});
