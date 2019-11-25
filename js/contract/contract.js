const $tools = mcfish.Tools;
const $api = mcfish.API;
//const myurl = $tools.parseURL(window.location.href);
//var phone = parseInt(myurl.params["phone"]);
var phone = JSON.parse(window.localStorage.getItem("yunlian_user")).user.phone;
console.log("phone"+phone)
var tableIns;
var app = new Vue({
	el: "#app",
	data: {
		coin: "BTC",
		last: "0.00",//当前价
		avg_cost:"0",//开仓均价
		settled_pnl:"0",//已结算
		unrealized_pnl:"0",//未实现盈亏
		usdt_avail:"0.00",//usdt余额
		position:"0",//持仓数量
		liquidation_price:"0",//预估强平
		leverage:"0",//杠杆倍数
		buy_value:"0",//补仓价
		next_buy_usdt:"0",
		nowTime:"",
		comments:"",
		stopValue:"暂停",
		coin_log:"",
		usdt_from:0,
		usdt_from_text:"",
	},
	methods: {
		showAddOrder() {
			showAddOrderPage();
		},
		selectChange(){
			this.coin = $("#selectCoin").val();
			getCoinMsg($("#selectCoin").val());
			getCoinLog($("#selectCoin").val());
			tableIns.reload({
				where:{
					coin:this.coin
				}
			});
		},
		addOrder(){
			var data = {};
        	data.coin = app.$data.coin;
        	data.value =  $("#addOrderValue").val();
        	data.usdt =  $("#addOrderUsdtCount").val();
        	console.log(data);
			mcfish.API.asyncRequest("system/addOrder","POST",data).then(function(res){
				$("#addOrder").modal();
			});
		},
		updateStop(){
			$("#user_password").val("");
			openSurePassword(function(){
				var data = {};
				data.password = $("#user_password").val();
				if($("#user_password").val() == "")
				{
					mizhu.toast("请输入密码");
					return;
				}
				
				mcfish.API.asyncRequest("person/surePassword","POST",data).then(function(res){
					if(res.code != 0){
						mizhu.toast(res.msg);
						return;
					}else{
						
						if(app.$data.stopValue == '暂停'){
							data.value = 1;
						}else if(app.$data.stopValue == '启动'){
							data.value = 0;
						}
						mcfish.API.asyncRequest("system/setStop","POST",data).then(function(res){
							if(app.$data.stopValue == '暂停'){
								app.$data.stopValue = '启动';
							}else{
								app.$data.stopValue = '暂停';
							}
							getCoinLog(app.$data.coin);
						});
					}
				});
			})
			
			
		}
		,updateUsdtNum(){
			$("#changeNextUsdt").modal();
		}
		,sureUpdateUsdtNum(){
			
			
			var data = {};
			$("#user_password").val("");
			openSurePassword(function(){
				var data = {};
				data.password = $("#user_password").val();
				if($("#user_password").val() == "")
				{
					mizhu.toast("请输入密码");
					return;
				}
				
				
				mcfish.API.asyncRequest("person/surePassword","POST",data).then(function(res){
					if(res.code != 0){
						mizhu.toast(res.msg);
						return;
					}else{
						delete data.password;
						data.coin = app.$data.coin;
						data.usdt = $("#usdt_num").val();
//						data.phone = phone;
						if(data.usdt > 0){
							mcfish.API.asyncRequest("main/setNextUsdt","POST",data).then(function(res){
								app.$data.next_buy_usdt = $("#usdt_num").val();
								getCoinLog(app.$data.coin);
								mizhu.toast(res.msg);
							});
						}else{
							mizhu.toast("usdt不能为0");
						}
					}
				});
			})
			
	
			
		}
		,updateFrom(){
			$("#updateFrom").modal();
		}
		
		,sureUpdateFrom(){

			$("#user_password").val("");
			openSurePassword(function(){
				var data = {};
				data.password = $("#user_password").val();
				if($("#user_password").val() == "")
				{
					mizhu.toast("请输入密码");
					return;
				}
				
				
				mcfish.API.asyncRequest("person/surePassword","POST",data).then(function(res){
					if(res.code != 0){
						mizhu.toast(res.msg);
						return;
					}else{
						delete data.password;
						data.coin = app.$data.coin;
						data.value = $("#coinFrom").val();
						data.phone = phone;
						
						mcfish.API.asyncRequest("system/setFrom","POST",data).then(function(res){
							getCoinMsg(app.$data.coin);
							getCoinLog(app.$data.coin);
						});
					}
				});
			})
			
			
			
		}
	},
	watch:{
	},
})


getCoinMsg("BTC");
getCoinLog("BTC");
getLangDate();
getComment();
getStop();




var mccallback;
//弹窗确定事件回调处理
$('.tips_dialog_button').click(function(){
	mccallback();
	mccallback = null;
})

	


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
	app.$data.nowTime = newDate+" "+week;
//	document.getElementById("nowTime").innerHTML = userName + "，" + timeValue + "好！ 欢迎使用运营中心管理系统，当前时间为： " + newDate + "　" + week;
	setTimeout("getLangDate()", 1000);
}


function getComment(){
	mcfish.API.asyncRequest("main/getLast","GET",{coin : app.$data.coin}).then(function(res){
		if(res.data != null && res.data != ''){
    		app.$data.last = res.data;
    		if(app.$data.last <= app.$data.buy_value){
    			app.$data.comments = "正在购买";
    		}else if(app.$data.position == 0){
    			app.$data.comments = "当前无仓位"
    		}else{
    			app.$data.comments = "未达到下次购买价"+app.$data.buy_value;
    		}
    		
	    }
	});
	
//	setTimeout("getComment()", 10000);
}

//打开开仓窗口
function showAddOrderPage(){
	$("#addOrder").modal();
}

function getCoinMsg(coin){
	var data = {};
	data.coin = coin;
	data.phone = phone;
	mcfish.API.asyncRequest("main/getNow","GET",data).then(function(res){
		if(res.data != null && res.data != ''){
    		app.$data.last = res.data.last;
    		app.$data.avg_cost = res.data.avg_cost;
			app.$data.settled_pnl= res.data.settled_pnl;
			app.$data.unrealized_pnl= res.data.ss.unrealized_pnl;
			app.$data.usdt_avail= res.data.usdt_avai.toFixed(3);
			app.$data.position= (res.data.position/ res.data.last * 10).toFixed(2);
			app.$data.liquidation_price = res.data.liquidation_price;
			app.$data.leverage = res.data.leverage;//杠杆倍数
			app.$data.buy_value = res.data.buyValue;
			app.$data.next_buy_usdt = res.data.next_buy_usdt;
			app.$data.usdt_from = res.data.from;
			app.$data.usdt_from_text = res.data.from==0?"币币账户":"资金账户";
			
	    }
	});
}


function getCoinLog(coin){
	$('#log li').remove();
	mcfish.API.asyncRequest("system/getCoinLog","GET",{coin : coin,phone:phone}).then(function(res){
		if(res.data != null && res.data != ''){
    		if(res.data != null && res.data != ''){
    			var tempDate = '';
    			var str = '';
    			var arr = [];
	     		for (i = 0; i < res.data.length; i++) {
	     			if(res.data[i].createTime == tempDate){
	     				str += `<p>
									`+res.data[i].comment+`
								</p>`;
						if(i == res.data.length-1){
							str += `<br />
								</div>
							</li>`;
	     					$("#log").append(str);
						}
	     			}else{
	     				if(i != 0){
	     					str += `<br />
								</div>
							</li>`;
	     					$("#log").append(str);
	     					
	     				}
	     				
	     				tempDate =  res.data[i].createTime;
	     				arr = res.data[i].createTime.split('-');
	     				str = `
	     				<li class="layui-timeline-item">
							<div class="layui-timeline-content layui-text">
								<h3 class="layui-timeline-title">`+arr[0]+'年'+arr[1]+'月'+arr[2]+'日'+`</h3>
								<p>
									`+res.data[i].comment+`
								</p>
								`
								;
	     			}
				}
	     	}
	    }
	});
	
}

function getStop(){
	mcfish.API.asyncRequest("system/getStop","GET",{coin:app.$data.coin}).then(function(res){
		if(res.data == 0){
			app.$data.stopValue = "暂停";
		}else if(res.data == 1){
			app.$data.stopValue = "启动";
		}
	});
}




//打开操作提示小弹窗
function openTipsDialog(title,content,callback){
	$("#tips_dialog_title").html(title);
	$("#tips_dialog_content").html(content);
	$("#tips_dialog_sm").modal("toggle");
	mccallback = callback;
}


function openSurePassword(callback){
	$("#surePassword").modal("toggle");
	mccallback = callback;
}


layui.use(['form', 'layer', 'table', 'laydate','util', 'mcfish'], function () {
    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,mcfish = layui.mcfish
        ,util = layui.util
        ,table = layui.table;
	
	
    //列表
    tableIns = table.render({
        elem: '#coinBuyList'
        ,url: mcfish.getReqUri() + '/person/getUserCoinBuyList'
        ,cellMinWidth: 95
        ,page: true
        ,where:{coin:app.$data.coin}
        ,limit: 10
        ,headers: {id:layui.data("yunlian_user").user.id}
        ,defaultToolbar: ["filter"]
        ,id: "coinBuyList"
        ,cols: [[
            {field: 'id', title: '编号', sort: true,width: 80}
            ,{field: 'value', title: '买入价', width: 120,templet: function (d) {
                    return (d.value*1).toFixed(3);
             	 }
            }
            ,{field: 'value', title: '+5%',width: 120,templet: function (d) {
                    return (d.value * 105 /100).toFixed(3);
             	 }
            }
            ,{field: 'value', title: '+10%', width:120, templet: function (d) {
                    return (d.value * 110 /100).toFixed(3);
             	 }
            }
            ,{field: 'num', title: '数量', width:100,templet:function(d){
            		return parseFloat(d.num).toFixed(3);
           		}
            }
            ,{field: 'sale', title: '卖出', width:70,templet:function(d){
            		return d.sale == 0?"未卖":"已卖"
            	}
            }
            ,{title: '操作',minWidth:130, align: "center", toolbar: '#barDemo'}
        ]]
    });
   	
 	
    //监听工具条
    table.on('tool(coinBuyInfo)', function (obj) {
        if(obj.event === 'edit'){
        	
        	console.log("edit")
        	openSurePassword(function(){
				var data = {};
				data.password = $("#user_password").val();
				if($("#user_password").val() == "")
				{
					mizhu.toast("请输入密码");
					return;
				}
				
        		mcfish.post("person/surePassword",data,function(res){
        			console.log("asdasd")
					if(res.code != 0){
						mizhu.toast(res.msg);
						return;
					}else{
						
	        			data.coinBuyId = obj.data.id;
	        			delete data.password;
						mcfish.post('person/sellCoin',data,function () {
		            		tableIns.reload();
						});
					}
				});

			});
        	
        	
        }
    });

   	
});








