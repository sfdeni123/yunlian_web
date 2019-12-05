var parentData;
var itemList;
var projectList;

layui.use(['form','layer','mcfish','laydate', 'upload'],function(){
    var form = layui.form
        ,layer = layui.layer
        ,mcfish = layui.mcfish
        ,laydate = layui.laydate
        ,upload = layui.upload
        ,$ = layui.jquery;
	
	
	  
	  //执行一个laydate实例
//	  laydate.render({
//	    elem: '#moneyTime' //指定元素
//	    ,type: 'datetime'
//	    ,trigger: 'click'
//	    ,format :'yyyy-MM-dd'
//	  });
	  
	laydate.render({
        elem: '#moneyTime' //指定元素
        ,trigger: 'click'
    });

	console.log(parentData)
	console.log(itemList)
	console.log(projectList)
    //表单初始化与赋值
    var imageUrl = '';//上传的图片URL
    var itemDemo = '',projectDemo = '';
    layui.each(projectList,function (key, value) {
        projectDemo += `<option value="${value.id}">${value.name}</option>`;
    });
    $("[name='projectId']").append(projectDemo);
    
    
    //判断有无数据
    if(!parentData){//没有不处理  新增
//	 	$("[name='id']").removeAttr('disabled');
//      $("[name='id']").removeClass('layui-bg-gray');
//      $("[name='id']").removeAttr("readOnly");
    }else{//编辑
    	
    	mcfish.get("project/getProjectItemList",{projectId:parentData.projectId},function (res) {
        	itemList = res.data;
        	layui.each(itemList,function (key, value) {
		        itemDemo += `<option value="${value.id}">${value.name}</option>`;
		    });
		    $("[name='itemId']").append(itemDemo);
	    },false);
	    
	    
    	if (parentData.budgetPrice){
	        parentData.budgetPrice = parentData.budgetPrice / 100;
	    }
	    if (parentData.budgetPriceSum){
	        parentData.budgetPriceSum = parentData.budgetPriceSum / 100;
	    }
    	
    	$(".idItem").show();
    	
    	$("[name='projectId']").val(parentData.projectId);
    	$("[name='id']").val(parentData.id);
    	$("[name='itemId']").val(parentData.itemId);
    	$("[name='category']").val(parentData.category);
    	$("[name='budgetPriceSum']").val(parentData.budgetPriceSum/100);
    	$("[name='comment']").val(parentData.comment);
        
        imageUrl = parentData.image;
        if(imageUrl != "" && imageUrl != null){
        	layui.each(parentData.image.split(";"), function (index, value) {
				$('.mime').append(`<img  src="${value}" width="120" height="120" class="magb3">`);
        	});
        }

        
//      $('.mime').append(`<img  src="${res.data.url}" width="120" height="120" class="magb3">`);
        
//	    if(parentData.status == 0){//待审核
//	        $('.saveBtn').html('确定');
//	       
//	    }else if(parentData.status == 1){//通过
//	    	$("[name='type']").attr("disabled","disabled"); 
//	    	$("[name='type']").addClass('layui-bg-gray');
//	        $('.saveBtn').html('确定');
//	        
//	        
//	        $("[name='money']").attr("disabled","disabled")
//	        $("[name='money']").addClass('layui-bg-gray');
//	        $("[name='money']").attr("readOnly","readOnly");
//	        
//	        
//	        $("[name='pay']").attr("disabled","disabled")
//	        $("[name='pay']").addClass('layui-bg-gray');
//	        $("[name='pay']").attr("readOnly","readOnly");
//	    }
    }


//加载层索引
    var fileLoadIndex = '';
    
    upload.render({
        elem: "[name='imgUpload']"
        ,url: mcfish.getReqUri() + '/project/fileUpload'
//      ,headers: {token: layui.sessionData("hdcm_operation").user.token,id:layui.sessionData("hdcm_operation").user.id}
        ,accept: 'images'
        ,acceptMime: 'image/*'
        ,before: function(obj){
            fileLoadIndex = layer.load();
        }
        ,done: function (res) {
            uploadSuccess(res);
        }
        ,error: function(){
            if(fileLoadIndex){
                layer.close(fileLoadIndex);
            }
            layer.msg("上传文件失败");
        }
    });
    
    function uploadSuccess(res){
        if(fileLoadIndex){
            layer.close(fileLoadIndex);
        }
        if(res.code == 0){

//          $('.mime').empty();
            if(res.data.type === 'image'){
            	imageUrl += imageUrl==''?res.data.url:";"+res.data.url;
            	$('.mime').append(`<img  src="${res.data.url}" width="120" height="120" class="magb3">`);
//          	$('.mime').append(`<img  src="${res.data.url}" width="120" height="120" class="magb3">`);
//              $("[name='adsImg']").show();
//              $("[name='adsImg']").attr('src', parentData.url);
//              $("[name='imgUpload']").show();
//              $(".info").removeClass("layui-hide");
            }
        }else{
            layer.msg(res.msg);
        }
    }
    
    
    form.on("submit(save)",function (data) {
		
        data.field.image = imageUrl;
		data.field.budgetPriceSum = data.field.budgetPriceSum *100;
        var requestUrl = "project/editMoney";
        if(!parentData){
            requestUrl = "project/addMoney";
        }

        mcfish.post(requestUrl,data.field,function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
            parent.layui.table.reload('moneyListTable');
        });
    });


    form.on('select(adminList)', function (data) {
        form.render();
    });
    form.on('select(useList)', function (data) {
        form.render();
    });


	form.on('select(projectList)', function (data) {
        mcfish.get("project/getProjectItemList",{projectId:data.value},function (res) {
        	$("[name='itemId']").find("option").remove();
        	itemList = res.data;
        	itemDemo='';
        	layui.each(itemList,function (key, value) {
		        itemDemo += `<option value="${value.id}">${value.name}</option>`;
		    });
		    $("[name='itemId']").append(itemDemo);
		    form.render();
	    },false);
    });
 
 	
    
    


//  laydate.render({
//      elem:"[name='start']"
//      ,type: 'date'
//      ,value: parentData.start?new Date(parentData.start):new Date()
//      ,theme: 'molv'
//  });

	laydate.render({
        elem:"[name='createTime']"
        ,type: 'datetime'
        ,value: parentData.createTime?new Date(parentData.createTime):new Date()
        ,theme: 'molv'
    });
    laydate.render({
        elem:"[name='moneyTime']"
        ,type: 'datetime'
        ,value: parentData.moneyTime?new Date(parentData.moneyTime):''
        ,theme: 'molv'
    });
    form.render();

    

       form.verify({
//      money: function(value){
//     	 	console.log(value)
//     	 	if(value != "" && value != null)
//	       	{
//	       	 	var str = /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/;
//	       	 	console.log(str.test(value));
//	            if(!str.test(value)){
//	                return '金额只能为正两位小数';
//	            }
//     	 	}
//     	 	
//      }
    })
});
