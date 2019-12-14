//获取系统时间
//var newDate = '';
//var userName = '';
//var n = 0;
//getLangDate();
////值小于10时，在前面补0
//function dateFilter(date) {
//	if(date < 10) {
//		return "0" + date;
//	}
//	return date;
//}
//
//function getLangDate() {
//	var dateObj = new Date(); //表示当前系统时间的Date对象
//	var year = dateObj.getFullYear(); //当前系统时间的完整年份值
//	var month = dateObj.getMonth() + 1; //当前系统时间的月份值
//	var date = dateObj.getDate(); //当前系统时间的月份中的日
//	var day = dateObj.getDay(); //当前系统时间中的星期值
//	var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
//	var week = weeks[day]; //根据星期值，从数组中获取对应的星期字符串
//	var hour = dateObj.getHours(); //当前系统时间的小时值
//	var minute = dateObj.getMinutes(); //当前系统时间的分钟值
//	var second = dateObj.getSeconds(); //当前系统时间的秒钟值
//	var timeValue = "" + ((hour >= 12) ? (hour >= 18) ? "晚上" : "下午" : "上午"); //当前时间属于上午、晚上还是下午
//	newDate = dateFilter(year) + "年" + dateFilter(month) + "月" + dateFilter(date) + "日 " + " " + dateFilter(hour) + ":" + dateFilter(minute) + ":" + dateFilter(second);
//	n++;
//	if(n === 1) {
//		userName = layui.sessionData("hdcm_operation").staff.name;
//	}
//	document.getElementById("nowTime").innerHTML = userName + "，" + timeValue + "好！ 欢迎使用运营中心管理系统，当前时间为： " + newDate + "　" + week;
//	setTimeout("getLangDate()", 1000);
//}

layui.use(['element', 'layer', 'jquery', 'mcfish', 'form'], function() {
	var layer = layui.layer
		,element = layui.element
        ,$ = layui.jquery
        ,form = layui.form
        ,mcfish = layui.mcfish;


    //构建出三个柱状图需要的时间下拉选择组件
    //获取当前年月
    let array = [];
    let date = new Date();
    let nowYear = date.getFullYear();
    let nowMonth = date.getMonth() + 1;

    //开始时间2018-12
    let startYear = 2019;
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


	mcfish.get("poolin/getWorder",{},function(res){
		var jsonRet = $.parseJSON(res.data);
		console.log(jsonRet);
		$(".workers_active").html(jsonRet.data.workers_active);
		$(".shares_15m").html(jsonRet.data.shares_15m);
		$(".workers_active").html(jsonRet.data.workers_active);
		
		
	});
	
    form.on('select(time1)', function(){
        getEverydayUserRecord();
    });
    
    getEverydayUserRecord();

    function getEverydayUserRecord(){
        var sdata = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var xdata = [1,'',3,'',5,'',7,'',9,'',11,'',13,'',15,'',17,'',19,'',21,'',23,'',25,'',27,'',29,'',31];
        
        var myChart = echarts.init(document.getElementById("textEcharts"),'infographic');
        let option = {
            title: {
                text: '本月算力',
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
                data:['算力'],
                x: 'left'
            },
            toolbox: {
                show: true,
                feature: {
                    dataView: {readOnly: true},
                    magicType : {show: true, type: ['bar', 'line']},
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
                    name: '算力(PH/s)',
                    min:0,
                    splitLine: {
                        show: true
                    }
                }
            ],
            series: [
                {
                    name:'实时算力',
                    type:'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data:sdata

                },

            ]
        };
 		
   	    mcfish.get("poolin/getWorderList",{time:$("[name='time1']").val()},function (res) {
            var count = 0;
            layui.each(res.data, function (k, v) {
                sdata[parseInt(v.day)-1] = v.shares_24h;
                count += v.count;
            });
            myChart.setOption(option,true);
        })
    }


    form.on('select(time2)', function(){
        getEverydayProfits();
    });
    getEverydayProfits();

    function getEverydayProfits(){
        var sdata = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var xdata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var myChart = echarts.init(document.getElementById("textEcharts2"),'infographic');
        let option = {
            title: {
                text: '本月收益',
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
                data:['收益'],
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
                    name: '收益',
                    min:0,
                    splitLine: {
                        show: true
                    }
                }
            ],
            series: [
                {
                    name:'该日总收益',
                    type:'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data:sdata

                },

            ]
        };

        mcfish.get("poolin/getPaymentList",{time:$("[name='time2']").val()},function (res) {
            layui.each(res.data, function (k, v) {
            	if(parseInt(v.day) > 0){
            		sdata[parseInt(v.day)-1] = v.yesterday_amount/100000000;
            	}
            });
            myChart.setOption(option,true);
        })

    }
    
    
    
    form.on('select(time3)', function(){
        getAllNet();
    });
    getAllNet();

    function getAllNet(){
        var sdata = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var xdata = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
        var myChart = echarts.init(document.getElementById("textEcharts3"),'infographic');
        let option = {
            title: {
                text: '全网算力',
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
                data:['算力'],
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
                    name: '算力(EH/s)',
                    min:0,
                    splitLine: {
                        show: true
                    }
                }
            ],
            series: [
                {
                    name:'算力',
                    type:'line',
                    showSymbol: false,
                    hoverAnimation: false,
                    data:sdata
                },
            ]
        };

        mcfish.get("poolin/getBlockList",{time:$("[name='time3']").val()},function (res) {
            layui.each(res.data, function (k, v) {
            	if(parseInt(v.day) > 0){
            		sdata[parseInt(v.day)-1] = v.net_hash/1000000000000000000;
            	}
            });
            myChart.setOption(option,true);
        })

    }
});
