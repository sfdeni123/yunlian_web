{
    "users": [{
        "id": 1,
        "username": "18180055588",
        "name": "李金远"
    }, {
        "id": 2,
        "username": "15622158666",
        "name": "张三"
    }],
    // 投资项目
    "investprojects": [{
            "id": 1,
            "projectname": "挖矿一期"
        },
        {
            "id": 2,
            "projectname": "挖矿二期"
        }
    ],
    // 项目计划书，一对一，一个项目对应一份计划书
    "investplan": {
        "id": 1,
        "investprojectid": 1,
        "proposal": "项目计划书，富文本，一篇完整的网页文章。",
        "creator":"李金远",
        "createtime":"2019-06-02"
    },
    // 项目预算，列出能想到的即将花钱的地方
    "budgets": [{
            "id": 1,
            "investprojectid": 1,   //对应项目id
            "budgetItem": "购买矿机",   //预算子项
            "budgetPrice": 500,     //单价
            "budgetCount": 360,     //数量
            "budgetPriceSum": 150000,   //总金额
            "plantips": "计划先用低端机器过度", //计划
            "exceptResult": "期望两个月快速回本",   //期望值
            "budgetDate": "2019-06-01", //创建时间
            "planstartdate": "2019-06-02",  //计划开始时间
            "planenddate": "2019-06-10"     //计划结束时间
        },
        {
            "id": 1,
            "investprojectid": 1,   
            "budgetItem": "购买电源",
            "budgetPrice": 500,
            "budgetCount": 360,
            "budgetPriceSum": 150000,
            "plantips": "计划使用低端电源先上",
            "exceptResult": "期望用完卖掉价格持平",
            "budgetDate": "2019-06-01",
            "planstartdate": "2019-06-02",
            "planenddate": "2019-06-10"
        }
    ],
    //项目开支流水
    "billdetails": [{
        "id": 1,
        "investprojectid": 1,   //对应项目id
        "budgetItem": "购买矿机",   //对应子项，可选，其他，录入
        "billtype": "支出", //支出，退款，收入
        "price": 500,   //单价
        "count": 360,   //数量
        "pricesum": 150000, //总计
        "paymethod": "招商银行",    //支付方式
        "paytime": "2019-06-02",    //支付时间
        "payer": "李金远",      //经手人
        "memo": "向黄牛xx采购，约定保算力.",    //备注
        "img": "xxx.jpg",       //打款截图
        "createtime": "2019-06-02",     //录入时间
        "summary": "于xx时候完成，到货之后坏了100个",   //事后总结
        "summarytime": "2019-07-03"     //总结时间
    }],
    //时间线，行动日志
    "timelines": [{
        "id": 1,
        "investprojectid": 1,   //对应项目id
        "datetime": "2019-06-01",   //行动时间
        "actiontype": "上机",       //行动类型
        "actionlog": "去往洪雅矿场上机"     //行动过程
    }],
    //挖矿每日收益
    "coinbills": [{
        "id": 1,
        "investprojectid": 1,   //对应项目id
        "cointype": "BTC",  //币种
        "minercount": 360,  //矿机数量
        "badminercount": 10,    //损坏矿机数量
        "minerpower": "2P", //每日平均总算力
        "coinpert": "0.000019", //每T收益
        "minedate": "2019-06-01",   //日期
        "minecoin": 0.05,   //总挖币数
        "coinprice": 70000, //当天币价
        "mineprice": 3500   //矿机当日价格
    }],
    // 行动规则检查清单
    "actionchecklists":[
        {
            "id":1,
            "principle":"哪一条理论",
            "explain":"理论解释",
            "example":"具体案例",
            "creator":"李金远",
            "createime":"2019-06-01"
        }
    ],
    //矿机价格与收益
    "minerprice":[
        {
            "id":1,
            "minertype":"蚂蚁S9",
            "minerpower":"13.5",
            "coinpert":"0.000019",
            "minerprice":1800,
            "minecoinperdate":0.0002,
            "coinprice":70000,
            "minepriceperdate":20,
            "dianjia":0.26,
            "gonghao":"1400w",
            "dianfei":9,
            "shouyi":11
        }
    ]
}