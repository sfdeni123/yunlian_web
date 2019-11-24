var parentData;
var typeList;

layui.use(['form','layer','mcfish','laydate', 'upload','jquery'],function(){
    var form = layui.form
        ,layer = layui.layer
        ,mcfish = layui.mcfish
        ,laydate = layui.laydate
        ,upload = layui.upload
        ,$ = layui.jquery;
 
	
	
    laydate.render({
        elem:"[name='start_time']"
        ,type: 'datetime'
        ,value: parentData.start_time?new Date(parentData.start_time):''
        ,theme: 'molv'
    });
    
    laydate.render({
        elem:"[name='end_time']"
        ,type: 'datetime'
        ,value: parentData.end_time?new Date(parentData.end_time):''
        ,theme: 'molv'
    });
    
    
    
	
    
    
    var typeDemo = '';
	layui.each(typeList,function (key, value) {
        typeDemo += `<option value="${value.id}">${value.name}</option>`;
    });
	$(".typeList").append(typeDemo);
	form.render();
    
    
    //判断有无数据
    if(!parentData){//没有不处理  新增
		$('.typeItem').show();
    }else{//编辑
    	
	   	parentData.money = parentData.money / 100;
	   	parentData.per_money = parentData.per_money / 100;
    	$("[name='name']").val(parentData.name);
    	$("[name='per_money']").val(parentData.per_money);
    	$("[name='count']").val(parentData.count);
    	$("[name='plan']").val(parentData.plan);
    	$("[name='expect']").val(parentData.expect);
    	
    	
    	
    }

    form.on("submit(save)",function (data) {
        var requestUrl = "money/addMoneyUse";
        if(parentData){
        	data.field.id = parentData.id;
            requestUrl = "money/editMoneyUse";
        }
        mcfish.post(requestUrl,data.field,function () {
            var index = parent.layer.getFrameIndex(window.name);
            parent.layer.close(index);
            parent.layui.table.reload('useList');
        });
    });
  
});
