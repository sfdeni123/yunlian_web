layui.use(['form', 'layer', 'table', 'util', 'mcfish'], function () {

    var form = layui.form
        ,layer = layui.layer
        ,$ = layui.jquery
        ,mcfish = layui.mcfish;

    var map = new AMap.Map('container',{
        resizeEnable: true
    });

    // 同时引入工具条插件，比例尺插件和鹰眼插件
    AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.MapType',
        'AMap.Geolocation',
    ], function(){
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        map.addControl(new AMap.Scale());

        // 在图面添加类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
        map.addControl(new AMap.MapType());

        // 在图面添加定位控件，用来获取和展示用户主机所在的经纬度位置
        var geolocation = new AMap.Geolocation({
            // 是否使用高精度定位，默认：true
            enableHighAccuracy: true,
            // 设置定位超时时间，默认：无穷大
            timeout: 10000,
            // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
            buttonOffset: new AMap.Pixel(10, 20),
            //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            zoomToAccuracy: true,
            //  定位按钮的排放位置,  RB表示右下
            buttonPosition: 'RB'
        });
        geolocation.getCurrentPosition();
        map.addControl(geolocation);
    });


    map.on('complete', function () {
        console.log("map is complete!");
        drawMap(null);
    });


    function drawMap(data){

        //清除原有的覆盖物
        map.clearMap();

        mcfish.get('map/getAllDevice', data, function (res) {
            if(res.data.length == 0){
                return false;
            }
            layui.each(res.data, function (key, value) {
                if(value.lat != null && value.lng != null){

                    var image = '';
                    if(value.online === 0){//离线
                        image = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png';
                    }else if(value.online === 1){//在线
                        image = 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png';
                    }

                    var marker = new AMap.Marker({
                        icon: new AMap.Icon({
                            image: image
                        })
                        ,position: [value.lng, value.lat]
                        ,offset: new AMap.Pixel(-10, -34)
                        ,zIndex: 101
                        ,title: "设备编号:" + value.sno
                        ,map: map
                    });
                    marker.extData = value;
                    marker.on('click', markerClickInfo);
                    map.setFitView();
                }
            })
        })
    }


    function markerClickInfo(e){
        var extData = e.target.extData;
        console.log(extData)
    }

    //监听搜索按钮
    form.on('submit(submit)', function(data){
        drawMap(data.field);
    });

});
