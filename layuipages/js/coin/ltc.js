//获取系统时间
var newDate = '';
var userName = '';
var n = 0;
getLangDate();
//值小于10时，在前面补0
function dateFilter(date) {
	if(date < 10) {
		return "0" + date;
	}
	return date;
}

function getLangDate() {
	var dateObj = new Date(); //表示当前系统时间的Date对象
	var year = dateObj.getFullYear(); //当前系统时间的完整年份值
	var month = dateObj.getMonth() + 1; //当前系统时间的月份值
	var date = dateObj.getDate(); //当前系统时间的月份中的日
	var day = dateObj.getDay(); //当前系统时间中的星期值
	var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
	var hour = dateObj.getHours(); //当前系统时间的小时值
	var minute = dateObj.getMinutes(); //当前系统时间的分钟值
	var second = dateObj.getSeconds(); //当前系统时间的秒钟值
	var timeValue = "" + ((hour >= 12) ? (hour >= 18) ? "晚上" : "下午" : "上午"); //当前时间属于上午、晚上还是下午
	newDate = dateFilter(year) + "年" + dateFilter(month) + "月" + dateFilter(date) + "日 " + " " + dateFilter(hour) + ":" + dateFilter(minute) + ":" + dateFilter(second);
	n++;
	if(n === 1) {
		userName = layui.sessionData("hdcm_operation").user.name;
	}
	document.getElementById("nowTime").innerHTML = userName + "，" + timeValue + "好！ 欢迎使用运营中心管理系统，当前时间为： " + newDate + "　" + week;
	setTimeout("getLangDate()", 1000);
}

layui.use(['element', 'layer', 'jquery', 'util','mcfish', 'form','table'], function() {
	var layer = layui.layer
		,element = layui.element
        ,$ = layui.jquery
        ,form = layui.form
        ,table = layui.table
        ,util = layui.util
        ,mcfish = layui.mcfish;


	function getNow(){
		
		//USDT地址
	    mcfish.get("system/getNow", null, function (res) {
	    	if(res.data != null && res.data != ''){
	    		$(".equity").html(res.data.ss.equity); //账户权益
	    	
	    		$(".total_avail_balance").html(res.data.ss.total_avail_balance); //账户余额
	    		$(".margin").html(res.data.ss.margin);//已用保证金
//	    		$(".realized_pnl").html(res.data.ss.realized_pnl);//realized_pnl
	    		$(".unrealized_pnl").html(res.data.ss.unrealized_pnl);//未实现盈亏
	    		$(".margin_ratio").html(res.data.ss.margin_ratio);//保证金率
	    		$(".instrument_id").html(res.data.ss.instrument_id);//合约名称
	    	
	    		$(".last").html(res.data.last);//合约名称
	    		$(".liquidation_price").html(res.data.liquidation_price);//预估强平价
	    		$(".position").html((res.data.position/ res.data.last * 10).toFixed(2));//持仓数量
	    		$(".avg_cost").html(res.data.avg_cost);//开仓平均价
	    		$(".settled_pnl").html(res.data.settled_pnl); //已结算收益
	    		
	    	}
	    });
		
	}
	getNow();
    


	
	setInterval(function(){
				getNow();
			}, 10000);
			
			
			
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



 
  

  

