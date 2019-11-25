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

layui.use(['element', 'layer', 'jquery', 'mcfish', 'form'], function() {
	var layer = layui.layer
		,element = layui.element
        ,$ = layui.jquery
        ,form = layui.form
        ,mcfish = layui.mcfish;


    
    mcfish.get("money/getFormData",null,function (res) {
        var typeList = res.data.typeList;
	   	var typeDemo = '';
	    layui.each(typeList,function(key,value){
	        typeDemo += `<option value="${value.id}">${value.name}</option>`;
	    });
	    $("[name='typeList']").append(typeDemo);
    },false);
    
    
    form.on('select(typeInfo)', function(data){
			getMoneyDetail(data.value);
			getEverydayProfits(data.value);
			getEverydayUserRecord(data.value);
	});      
    
	
	function getMoneyDetail(typeId){
		var data = {};
		if(typeId != null && typeId != ''){
			data.typeId = typeId;
		}
		
		mcfish.get("money/getMoneyDetail", data, function (res) {
    	if(res.data != null && res.data != ''){
    		
    		$(".sumOut").html(res.data.sumOut/100);
    		$(".sumIn").html(res.data.sumIn/100);
    		$(".sumReceivable").html(res.data.sumReceivable/100);
    		$(".sumPay").html(res.data.sumPay/100);
    	}
        
    	});
	}
    getMoneyDetail();
   
   
    //构建出三个柱状图需要的时间下拉选择组件
    //获取当前年月
    let array = [];
    let date = new Date();
    let nowYear = date.getFullYear();
    let nowMonth = date.getMonth() + 1;

    //开始时间2018-12
    let startYear = 2018;
    let startMonth = 10;

    let year = nowYear - startYear;

    let month = year * 12 + nowMonth;

    for (let i = startMonth; i <= month; i++) {
        let temp = i % 12 === 0 ? 12 : i % 12;
        if (temp < 10) {
            temp = "0" + temp;
        }
        array.push((startYear + Math.floor((i - 1) / 12)) + "-" + temp);

    }
    for (let i = array.length; i > 0; i--) {
        $(".time").append(`<option value=` + array[i - 1] + `>` + array[i - 1] + `</option>`);
    }
    form.render();

    form.on('select(time1)', function(){
        getEverydayUserRecord();
    });
    getEverydayUserRecord();

    function getEverydayUserRecord(typeId){
        var sdata = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var xdata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var myChart = echarts.init(document.getElementById("textEcharts"),'infographic');
        let option = {
            title: {
                text: '本月支出',
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {
                data:['使用次数'],
                x: 'left'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: true},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true}
                }
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    axisLabel: {
                        interval:0,//横轴信息全部显示
                        splitNumber:0,
                        scale:true,
                        rotate:0
                    },
                    data: xdata
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: '金额',
                    min:0,
                    splitLine: {
                        show: true
                    }
                }
            ],
            series: [
                {
                    name:'该日支出金额',
                    type:'bar',
                    showSymbol: false,
                    hoverAnimation: false,
                    data:sdata

                },

            ]
        };
	
        mcfish.get("money/getMoneyOutEveryDay",{time:$("[name='time1']").val(),typeId:typeId},function (res) {
            var money = 0;
            layui.each(res.data, function (k, v) {
                sdata[parseInt(v.time)-1] = (parseFloat(v.money)/100).toFixed(2);
                money += v.money;
            });
            option.title.text = option.title.text + " "+ (parseFloat(money)/100).toFixed(2);
            myChart.setOption(option,true);

        })

    }


    form.on('select(time2)', function(){
        getEverydayProfits();
    });
    getEverydayProfits();

    function getEverydayProfits(typeId){
        var sdata = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var xdata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var myChart = echarts.init(document.getElementById("textEcharts2"),'infographic');
        let option = {
            title: {
                text: '本月收入',
                x:'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    label: {
                        backgroundColor: '#283b56'
                    }
                }
            },
            legend: {
                data:['金额'],
                x: 'left'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: true},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true}
                }
            },
            dataZoom: {
                show: false,
                start: 0,
                end: 100
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    axisLabel: {
                        interval:0,//横轴信息全部显示
                        splitNumber:0,
                        scale:true,
                        rotate:0
                    },
                    data: xdata
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    name: '金额',
                    min:0,
                    splitLine: {
                        show: true
                    }
                }
            ],
            series: [
                {
                    name:'该日总收入',
                    type:'bar',
                    showSymbol: false,
                    hoverAnimation: false,
                    data:sdata

                },

            ]
        };

        mcfish.get("money/getMoneyInEveryDay",{time:$("[name='time2']").val(),typeId:typeId},function (res) {
            var money = 0;
            layui.each(res.data, function (k, v) {
                sdata[parseInt(v.time)-1] = (parseFloat(v.money)/100).toFixed(2);
                money += v.money;
            });
            
            option.title.text = option.title.text + " "+ (parseFloat(money)/100).toFixed(2);
            myChart.setOption(option,true);
        })

    }

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



