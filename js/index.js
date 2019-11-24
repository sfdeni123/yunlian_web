init();
function init(){
	mcfish.API.syncRequest("person/getUserObject","GET",{},function(res){
		if(res.data != null){
			$.each(res.data,function(index,item){
				$("#exampledropdownDropdown").append(`<li :class="{ active:'object`+item.id+`'==current }"><a href="javascript:void(0)" @click="switchObject('object',`+item.id+`)">`+item.name+`</a></li>`);
			})
		}
	})
}
const $tools = mcfish.Tools;
const $api = mcfish.API;
const myurl = $tools.parseURL(window.location.href);

const user = $tools.GetCookie("yunlian_user");
if(user == null || user == undefined){
	window.location.href = "login.html";
}


var phone = JSON.parse(user).phone;


var app = new Vue({
	el:"#app",
	data:{
		current:"contract",//用于判断active的显示 和页面
		
		iframeUrl:"page/contract/contract.html",
	},
	methods:{
		handler(name){
			console.log(name);
			this.current = name;
			
			if(name === 'contract'){
				this.iframeUrl = "page/contract/contract.html?phone"+phone;
			}else if(name == "financial_plan"){
				this.iframeUrl = "page/financial/financial_plan.html";
			}else if(name == "financial_bill"){
				this.iframeUrl = "page/financial/financial_bill.html";
			}else if(name == "financial_own"){
				this.iframeUrl = "page/financial/financial_own.html";
			}else if(name == 'mill'){
				this.iframeUrl = "page/mill/list.html";
			}
		},
		
		switchObject(name,index){
			console.log(name,index);
			this.current = name+index;
			if(name === 'object'){
				this.iframeUrl = "page/digCoin/digCoin.html?typeId="+index;
			}
			
		},
		logout(){
			console.log("out")
			layui.data('yunlian_user', {key: 'user',remove: true});
	        $tools.DelCookie("yunlian_user");
	        window.location.href = "login.html";
		}
	}
})


