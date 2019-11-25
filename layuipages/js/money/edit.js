var parentData;
var adminList;
var useList;
var typeList;

layui.use(['form','layer','mcfish','laydate', 'upload'],function(){
    var form = layui.form
        ,layer = layui.layer
        ,mcfish = layui.mcfish
        ,laydate = layui.laydate
        ,upload = layui.upload
        ,$ = layui.jquery;
	
	
	layui.use('laydate', function(){
	  var laydate = layui.laydate;
	  
	  //执行一个laydate实例
	  laydate.render({
	    elem: '#moneyTime' //指定元素
	    ,type: 'datetime'
	    ,trigger: 'click'
	    ,format :'yyyy-MM-dd HH:mm:ss'
	  });
	});



    //表单初始化与赋值
    var imageUrl = '';//上传的图片URL
    var adminDemo = '', useDemo = '',typeDemo = '';
    layui.each(adminList,function(key,value){
        adminDemo += `<option value="${value.id}">${value.name}</option>`;
    });
    $("[name='adminList']").append(adminDemo);

    layui.each(useList,function (key, value) {
        useDemo += `<option value="${value.id}">${value.name}</option>`;
    });
    $("[name='useList']").append(useDemo);
    
    
    layui.each(typeList,function (key, value) {
        typeDemo += `<option value="${value.id}">${value.name}</option>`;
    });
    $("[name='typeList']").append(typeDemo);
    
    
    
    //判断有无数据
    if(!parentData){//没有不处理  新增
		
//	 	$("[name='id']").removeAttr('disabled');
//      $("[name='id']").removeClass('layui-bg-gray');
//      $("[name='id']").removeAttr("readOnly");
    }else{//编辑
    	if (parentData.money){
	        parentData.money = parentData.money / 100;
	    }
	    if (parentData.receivable){
	        parentData.receivable = parentData.receivable / 100;
	    }
	    if (parentData.pay){
	        parentData.pay = parentData.pay / 100;
	    }
    	
    	$(".idItem").show();
    	$(".adminItem").show();
    	$("[name='typeList']").val(parentData.type_id);
    	$("[name='id']").val(parentData.id);
    	$("[name='adminList']").val(parentData.userId);
    	$("[name='useList']").val(parentData.useId);
    	$("[name='category']").val(parentData.category);
    	
    	$("[name='money']").val(parentData.money);
    	$("[name='receivable']").val(parentData.receivable);
    	$("[name='pay']").val(parentData.pay);
    	$("[name='comment']").val(parentData.comment);
    	
    	
        $('.mime').empty();
        
        imageUrl = parentData.image;
        if(imageUrl != ""){
        	layui.each(parentData.image.split(";"), function (index, value) {
				$('.mime').append(`<img  src="${value}" width="120" height="120" class="magb3">`);
        	});
        }

        
//      $('.mime').append(`<img  src="${res.data.url}" width="120" height="120" class="magb3">`);
        
        
        
	    if(parentData.status == 0){//待审核
	    	$("#moneyHide").show();
	    	$("#receivableHide").show();
	    	$("#payHide").show();
	        $('.saveBtn').html('确定');
	        
	       
	    }else if(parentData.status == 1){//通过
	    	$("#moneyHide").show();
	    	$("#receivableHide").show();
	    	$("#payHide").show();
	    	$("[name='type']").attr("disabled","disabled"); 
	    	$("[name='type']").addClass('layui-bg-gray');
	        $('.saveBtn').html('确定');
	        
	        
	        $("[name='money']").attr("disabled","disabled")
	        $("[name='money']").addClass('layui-bg-gray');
	        $("[name='money']").attr("readOnly","readOnly");
	        
	        $("[name='receivable']").attr("disabled","disabled")
	        $("[name='receivable']").addClass('layui-bg-gray');
	        $("[name='receivable']").attr("readOnly","readOnly");
	        
	        $("[name='pay']").attr("disabled","disabled")
	        $("[name='pay']").addClass('layui-bg-gray');
	        $("[name='pay']").attr("readOnly","readOnly");
	    }
	    
	    if(parentData.category == 0){//支出
            $("#moneyHide").show();
    		$("#receivableHide").hide();
    		$("#payHide").hide();
 
        }else if(parentData.category == 1){//收入
           	$("#moneyHide").show();
    		$("#receivableHide").hide();
    		$("#payHide").hide();
        }else if(parentData.category == 2){//债务
           	$("#moneyHide").hide();
    		$("#receivableHide").show();
    		$("#payHide").show();
        }
    }


//加载层索引
    var fileLoadIndex = '';
    
    upload.render({
        elem: "[name='imgUpload']"
        ,url: mcfish.getReqUri() + '/money/fileUpload'
        ,headers: {token: layui.sessionData("hdcm_operation").user.token,id:layui.sessionData("hdcm_operation").user.id}
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
		
	
        data.field.url = imageUrl;
		data.field.userId = data.field.adminList;
		data.field.useId = data.field.useList;
		data.field.typeId = data.field.typeList;
		delete  data.field.adminList;
		delete  data.field.useList;
		delete  data.field.typeList;
		
		data.field.money = data.field.money *100;
		data.field.receivable = data.field.receivable *100;
		data.field.pay = data.field.pay *100;
    
		if(data.field.category == 0 || data.field.category == 1){//支出
			data.field.receivable = 0;
			data.field.pay = 0;
		}else{
			data.field.money = 0;
		}
        var requestUrl = "money/editMoney";
        if(!parentData){
            requestUrl = "money/addMoney";
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

    form.on('select(category)', function (data) {
        if(data.value == 0){//支出
            $("#moneyHide").show();
    		$("#receivableHide").hide();
    		$("#payHide").hide();
 
        }else if(data.value == 1){//收入
//         	$("#moneyHide").hide();
//  		$("#receivableHide").show();
//  		$("#payHide").show();
    		
    		$("#moneyHide").show();
    		$("#receivableHide").hide();
    		$("#payHide").hide();
    		
        }else if(data.value == 2){//债务
           	$("#moneyHide").hide();
    		$("#receivableHide").show();
    		$("#payHide").show();
        }
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
