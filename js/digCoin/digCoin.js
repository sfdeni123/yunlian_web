const $tools = mcfish.Tools;
const myurl = $tools.parseURL(window.location.href);
var typeId = parseInt(myurl.params["typeId"]);


typeId = 2;
var index_color = ['#3eb579', '#49cd8b',"#54e69d","#71e9ad",'#44b2d7',"#59c2e6","#71d1f2","#96e5ff"];

var app = new Vue({
	el:"#app",
	data:{
		budget_money:0,//预算投入
		
		out_money:0,//已投入
		out_money_percent:0,
		
		earnings:0,//收益
		earnings_percent:0,
		
		return_equity:0,//回报率
	},
	methods:{
		
	}
})


init();
//getMoneyList();
function init(){
	//获取项目列表
	mcfish.API.syncRequest("money/getMoneyType","GET",{typeId:typeId},function(res){
		if(res.data != null){
			app.$data.selectObject = res.data;
			app.$data.budget_money = res.data.budget_money / 100;
		}
		
		
		
		//获取项目的金钱总计 总支出 总收入等
		mcfish.API.syncRequest("money/getMoneyDetail","GET",{typeId:typeId},function(res){
			if(res.data != null){
				app.$data.out_money = res.data.sumOut / 100; //总支出
				app.$data.earnings = res.data.sumIn /100;//总收入
				
				app.$data.out_money_percent = 		(app.$data.out_money * 100 / app.$data.budget_money).toFixed(0);
				app.$data.earnings_percent = 		(app.$data.earnings * 100 / app.$data.budget_money).toFixed(0);
				
				app.$data.return_equity = (app.$data.earnings * 100 / app.$data.out_money).toFixed(0) +"%";
				
				$("#return_equity").width(app.$data.return_equity);
				$("#out_money").width(app.$data.out_money_percent+"%");
				$("#earnings").width(app.$data.earnings_percent+"%");

			}
		});
	});
	
			
		
	mcfish.API.syncRequest("money/getMoneyByUse","GET",{typeId:typeId},function(res){
		
		
		var labels = [];
		var data = [];
		var color = [];
		$.each(res.data,function(index,item){
			labels[index] = item.name;
			data[index] = item.sumMoney / 100;
			color[index] = index_color[index];
		});

		var myPieChart = new Chart($('#pieChart'), {
	        type: 'doughnut',
	        options: {
	            cutoutPercentage: 80,
//	            legend: {
//	                display: false
//	            }
	        },
	        data: {
				labels: labels,
	            datasets: [
	                {
						data: data,
	                    borderWidth: [0, 0, 0],
						backgroundColor:color,
						hoverBackgroundColor:color
	                }]
	        }
		});
	});
	
	
	//获取一个项目的用途列表
	mcfish.API.syncRequest("money/getMoneyUseList","GET",{typeId:typeId},function(res){
		var str = '';
		app.$data.budget_money = 0;
		$.each(res.data,function(index,item){
			app.$data.budget_money += item.money / 100;
			str += `
				<tr>
	                <th scope="row">`+ ++index+`</th>
	                <td>`+item.name+`</td>
	                <td>`+item.per_money/100+`</td>
	                <td>`+item.count+`</td>
	                <td>`+item.money/100+`</td>
	                <td>`+item.plan+`</td>
	                <td>`+item.expect+`</td>
	                <td>`+ $tools.getMyDate(item.create_time,2)+`</td>
	                <td>`+ $tools.getMyDate(item.start_time,2)+`</td>
	                <td>`+ $tools.getMyDate(item.end_time,2)+`</td>
           		</tr>`;
		});
		
		$("#useList").append(str);
	});
	
	
	//获取一个项目的用途列表
	mcfish.API.syncRequest("money/getMoneyList","GET",{typeId:typeId},function(res){
		console.log(res);
		var outStr= '';
		var inStr= '';
		$.each(res.data,function(index,item){
			if(item.category == 0){
				outStr += `
				<tr>
	                <th scope="row">`+ ++index+`</th>
	                <td>`+item.useName+`</td>
	                <td>`+item.per_money/100+`</td>
	                <td>`+item.count+`</td>
	                <td>`+item.money/100+`</td>
	                <td>`+$tools.getMyDate(item.moneyTime,2)+`</td>
	                <td>`+item.userName+`</td>
	                <td>`+item.comment+`</td>
	                <td><a href="#"> <i class="icon-picture"></i>截图 </a></td>
           		</tr>`;
			}else{
				inStr += `
				<tr>
	                <th scope="row">`+ ++index+`</th>
	                <td>`+item.useName+`</td>
	                <td>`+item.per_money/100+`</td>
	                <td>`+item.count+`</td>
	                <td>`+item.money/100+`</td>
	                <td>`+$tools.getMyDate(item.moneyTime,2)+`</td>
	                <td>`+item.userName+`</td>
	                <td>`+item.comment+`</td>
	                <td><a href="#"> <i class="icon-picture"></i>截图 </a></td>
           		</tr>`;
			}
			
		});
		
		$("#outList").append(outStr);
		$("#inList").append(inStr);
	});
}





