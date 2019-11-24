var parentData;

layui.use(['form','layer','mcfish','laydate', 'upload','jquery'],function(){
    var form = layui.form
        ,layer = layui.layer
        ,mcfish = layui.mcfish
        ,laydate = layui.laydate
        ,upload = layui.upload
        ,$ = layui.jquery;
 
    
    
//	form.render();
    
    
    //判断有无数据
    if(!parentData){//没有不处理  新增
    	
    }else{//编辑
    	
	   	parentData.earningPer = parentData.earningPer / 100;
	   	parentData.electricity = parentData.electricity / 100;
	   	
	   	
    	$("[name='name']").val(parentData.name);
    	$("[name='hashrate']").val(parentData.hashrate);
    	$("[name='count']").val(parentData.count);
    	
    	$("[name='earningPer']").val(parentData.earningPer);
    	$("[name='electricity']").val(parentData.electricity);
    	$("[name='coinOneDay']").val(parentData.coin);
    	
    	
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
