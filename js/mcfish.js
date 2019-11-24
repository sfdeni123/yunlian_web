!function () {
    // 服务器请求地址
    var host = 'localhost';
    var href = window.location.href;
    var temp = href;
//  temp = temp.substring(temp.indexOf("//") + 2,temp.length);
//  temp = temp.substring(temp.indexOf("/") + 1,temp.length);
//  temp = temp.substring(temp.indexOf("/") + 1,temp.length);
//  temp = href.substring(0,href.length - temp.length);
    href = "http://47.52.34.187:9000/";
//  href = "http://127.0.0.1:9000/";
    var agentid = ''
    var CORPID = '';
    var mcfish = {
    	/** 
    	 *  拦截器栈
    	 */
        Interceptor: {
        	/**
        	 * 登录态检测拦截器
        	 * 1.判断是否为公共访问域里的资源，如果是，则放开拦截。否则就判断是否进行了登录
        	 */
        	loginInterceptor:function(){
        		//获取当前所在的资源位置
        		var href = window.location.href;
        		var index = href.lastIndexOf("\/");
        		href = href.substring(index+1,href.length);
        		if(href != "login.html"){
	        		var user = window.sessionStorage.getItem("userinfo");
					if(!user){
						setTimeout(this.comebackURL,100)
						mizhu.toast("你还没有登录，系统将自动前往登录页",100);
					}
        		}
        	},
        	//页面高度计算
        	countHeight:function(){
		    	setTimeout(function(){
		    		var dom = $(".content-wrapper");
		    		//如果是主页调用
		    		if(dom.attr("id") == "leftContenWrapper"){
		    			var mainWidth = $(window).width();
		    			window.sessionStorage["mainWidth"] = mainWidth;
		    			// console.log("主页面宽度:"+mainWidth);
		    			
		    			var mainHeight = $(window).height();
						$('#leftMenu').css({'height': mainHeight,'overflow-y': 'auto'})
						// console.log("主页面高度:"+mainHeight);
		    			return false;
		    		}
					var pageHeight = 0;
					var section = $(".content-wrapper > section");
					for(var i = 0 ; i < section.length; i++){
						pageHeight += section[i].clientHeight;
						// console.log("多section=" + pageHeight);
					}
					dom.css("min-height",pageHeight);
					var childWidth = $(window).width();
					//750 767
					var mWidth = window.sessionStorage.getItem("mainWidth");
					if(mWidth <= 767){
						dom.css("padding-bottom","100px")
					}else{
						if(childWidth >= 750){//50 80 100
							dom.css("padding-bottom","50px")
						}else{
							dom.css("padding-bottom","80px")
						}
					}
					// console.log(pageHeight);
				},50);
		    },
			comebackURL:function(){
				if(window != top){
					top.location.href = href;
				}else{
					window.location.href = href;
				}
			}
        },
        
        API: {

	        /**
	         * 
	         * 用户普通登录
	         * @param {String} login_type:1:账号、密码 3:uid、token
	         *
	         **/
	        userLogin: function(type,account,password,callback) {
	            $.ajax({
	                url: href + "login",
	                type: 'POST',
	                dataType: 'json',
	                data: {
	                    types: type,
	                    username: account,
	                    password: password
	                },
	                async: false,
	                success: function(res){
	                    if (res.code === 0 ) {
	                        if (callback) {
	                            callback(res)
	                        } else {
	                        }
	                    } else {
	                       	mizhu.toast(res.msg,1500);
	                    }
	                },
	                error: function (err) {
	                    mizhu.toast('err:' + JSON.stringify(err),1500);
	                }
	            })   
	        },
	        /**
	         * 用户退出
	         * @param {Object} callback
	         */
	        userLogOut: function(callback){
	        	 $.ajax({
	                url: href + "sharecLoginOut.do",
	                type: 'POST',
	                dataType: 'json',
	                async: false,
	                beforeSend: function(xhr){
						if(window.localStorage.getItem("yunlian_user")){
							xhr.setRequestHeader("id",JSON.parse(window.localStorage.getItem("yunlian_user")).user.id);
							xhr.setRequestHeader("token",JSON.parse(window.localStorage.getItem("yunlian_user")).user.token);
						}
					},
	                success: function(res){
	                    if (res.code === 0 ) {
	                        if (callback) {
	                            callback(res)
	                        } else {
	                            //2.本地清除session中的信息
								sessionStorage.clear();
	                        }
	                    }else{
	                    	sessionStorage.clear();
	                    	mcfish.Tools.comebackURL();
	                    }
	                },
	                error: function (err) {
	                    mizhu.toast('err:' + JSON.stringify(err),1500);
	                }
	            })
	        },
	        /**
        	 * 异步请求接口统一出入口
        	 * @param {Object} url：接口URL
        	 * @param {Object} type：请求方法（POST/GET）
        	 * @param {Object} data：请求参数数组
        	 */
        	asyncRequest: function(url,type,data){
        		return new Promise(function(resolve, reject){
					$.ajax({
						type: type,
						url: href + url,
						async: true,
						dataType: "json",
						data: data,
						beforeSend: function(xhr){
							if(window.localStorage.getItem("yunlian_user")){
								xhr.setRequestHeader("id",JSON.parse(window.localStorage.getItem("yunlian_user")).user.id);
								xhr.setRequestHeader("token",JSON.parse(window.localStorage.getItem("yunlian_user")).user.token);
							}
						},
						success: function(result) {
							mcfish.Tools.requestSuccess(resolve,result,null);
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							mcfish.Tools.errorAction(XMLHttpRequest);
						},
						failure : function(result) {
							mizhu.toast("网络错误",1500);
						}
					})
				})
            },
            /**
        	 * 同步请求接口统一出入口
        	 * @param {Object} url：接口URL
        	 * @param {Object} type：请求方法（POST/GET）
        	 * @param {Object} data：请求参数数组
        	 */
            syncRequest: function(url,type,data,callback){
                $.ajax({
                    type: type,
                    url: href + url,
                    async: false,
                    dataType: "json",
                    data: data,
                    beforeSend: function(xhr){
                        if(window.localStorage.getItem("yunlian_user")){
							xhr.setRequestHeader("id",JSON.parse(window.localStorage.getItem("yunlian_user")).user.id);
							xhr.setRequestHeader("token",JSON.parse(window.localStorage.getItem("yunlian_user")).user.token);
						}
                    },
                    success: function(result) {
                        mcfish.Tools.requestSuccess(null,result,callback)
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        mcfish.Tools.errorAction(XMLHttpRequest);
                    },
                    failure : function(result) {
                        mizhu.toast("网络错误",1500);
                    }
                });
            },
            /**
             * 统一出口上传
             */
            processRequest: function(url,type,data){
        		return new Promise(function(resolve, reject){
					$.ajax({
						type: type,
						url: href + url,
						async: true,
                        processData: false, // FormData
                        contentType: false, // POST 请求--
						data: data,
						beforeSend: function(xhr){
							if(window.localStorage.getItem("yunlian_user")){
								xhr.setRequestHeader("id",JSON.parse(window.localStorage.getItem("yunlian_user")).user.id);
								xhr.setRequestHeader("token",JSON.parse(window.localStorage.getItem("yunlian_user")).user.token);
							}
						},
						success: function(result) {
							mcfish.Tools.requestSuccess(resolve,result,null);
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							mcfish.Tools.errorAction(XMLHttpRequest);
						},
						failure : function(result) {
							mizhu.toast("网络错误",1500);
						}
					})
				})
            },
             /**
        	 * datatable出入口,回调函数callback：1.可以拿到ajax请求到的数据，2.可自定义要解析的数据结构，只需要callback返回要解析的数据，callback如果没
        	 * 有返回值，则默认解析 res.data的数据
        	 * @param {Object} el: jq 实例
        	 * @param {Object} ajaxParams ：ajax 参数对象[api, type, data, asnyc]
        	 * @param {Array} colData: 实例渲染数组
        	 */
            getDataTable: function(el, ajaxParams, colData, callback){
            	var table;
            	//判断是否为页面导出
            	if(ajaxParams.excelExport){
	                table = $(el).DataTable({
	                    "lengthChange" : false,
	                    "ordering" : false, //排序
	                    "info" : true, //
	                    "autoWidth" : false, //宽度自动
	                    "paging" : ajaxParams.paging == undefined?true:ajaxParams.paging?true:false, //分页
	                    "searching" : ajaxParams.searching?true:false, //全局搜索开关
	                    "processing" : true, //开启显示‘正在加载.../processing’
	                    "serverSide" : ajaxParams.serverSide == undefined?true:ajaxParams.serverSide?true:false, //true代表后台处理分页，false代表前台处理分页  
	                    "bJQueryUI" : true,//是否开启主题 
	                    "iDisplayLength":ajaxParams.length?ajaxParams.length:10, //分页数
	                    "destroy": true,//销毁当前上下文中的datatables实例
	                    "ajax" : {
	                        url : href + ajaxParams.api,
	                        type : ajaxParams.type,
	                        data: ajaxParams.data,
	                        beforeSend: function(xhr){
	                            if(window.sessionStorage.getItem("userinfo")){
	                                xhr.setRequestHeader("uid",JSON.parse(window.sessionStorage.getItem("userinfo")).id);
	                                xhr.setRequestHeader("token",JSON.parse(window.sessionStorage.getItem("userinfo")).token);
	                            }
	                        },
	                        dataSrc: function(result) {
	                            if(result.code == 0){
	                            	if(callback){
		                            	var obj = callback(result);
		                            	if(obj){
		                            		return obj;
		                            	}else{
		                            		return result.data?result.data:new Array(0);
		                            	}
	                            	}else{
	                            		return result.data?result.data:new Array(0);
	                            	}
	                            }else if(result.code == 209){
	            					mizhu.toast("暂无权限",1000);
	            					return new Array(0);
	            				}else if(result.code == 110 || result.code == 112){
	                                setTimeout(mcfish.Tools.comebackURL,1000)
	                                mizhu.toast(result.msg,1000);
	                                return new Array(0);
	                            }else{
	                                mizhu.toast(result.msg,1500);
	                                return new Array(0);
	                            }
	                        },
	                        error: function(XMLHttpRequest, textStatus, errorThrown) {
	                            mcfish.Tools.errorAction(XMLHttpRequest);
	                        },
	                        failure : function(result) {
	                            mizhu.toast("网络错误",1500);
	                        }
	                    },
	                    "columns": colData,
	                    "oLanguage" : { // 语言设置  
	                        "sLengthMenu" : "每页显示 _MENU_ 条记录",
	                        "sZeroRecords" : "抱歉， 没有找到",
	                        "sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
	                        "sInfoEmpty" : "没有数据",
	                        "sInfoFiltered" : "(从 _MAX_ 条数据中检索)",
	                        "sZeroRecords" : "没有检索到数据",
	                        "sSearch" : "检索:",
	                        "oPaginate" : {
	                            "sFirst" : "首页",
	                            "sPrevious" : "前一页",
	                            "sNext" : "后一页",
	                            "sLast" : "尾页"
	                        }
	                    },
	                    "dom": 'Bfrtip',
				        "buttons": ajaxParams.excelExport
	                })
            	}else{
	                table = $(el).DataTable({
	                    "lengthChange" : false,
	                    "ordering" : false, //排序
	                    "info" : true, //
	                    "autoWidth" : false, //宽度自动
	                    "paging" : ajaxParams.paging == undefined?true:ajaxParams.paging?true:false, //分页
	                    "searching" : ajaxParams.searching?true:false, //全局搜索开关
	                    "processing" : true, //开启显示‘正在加载.../processing’
	                    "serverSide" : ajaxParams.serverSide == undefined?true:ajaxParams.serverSide?true:false, //true代表后台处理分页，false代表前台处理分页  
	                    "bJQueryUI" : true,//是否开启主题 
	                    "iDisplayLength":ajaxParams.length?ajaxParams.length:10, //分页数
	                    "destroy": true,//销毁当前上下文中的datatables实例
	                    "ajax" : {
	                        url : href + ajaxParams.api,
	                        type : ajaxParams.type,
	                        data: ajaxParams.data,
	                        beforeSend: function(xhr){
	                            if(window.sessionStorage.getItem("userinfo")){
	                                xhr.setRequestHeader("uid",JSON.parse(window.sessionStorage.getItem("userinfo")).id);
	                                xhr.setRequestHeader("token",JSON.parse(window.sessionStorage.getItem("userinfo")).token);
	                            }
	                        },
	                        dataSrc: function(result) {
	                            if(result.code == 0){
	                            	if(callback){
		                            	var obj = callback(result);
		                            	if(obj){
		                            		return obj;
		                            	}else{
		                            		return result.data?result.data:new Array(0);
		                            	}
	                            	}else{
	                            		return result.data?result.data:new Array(0);
	                            	}
	                            }else if(result.code == 209){
	            					mizhu.toast("暂无权限",1000);
	            					return new Array(0);
	            				}else if(result.code == 110 || result.code == 112){
	                                setTimeout(mcfish.Tools.comebackURL,1000)
	                                mizhu.toast(result.msg,1000);
	                                return new Array(0);
	                            }else{
	                                mizhu.toast(result.msg,1500);
	                                return new Array(0);
	                            }
	                        },
	                        error: function(XMLHttpRequest, textStatus, errorThrown) {
	                            mcfish.Tools.errorAction(XMLHttpRequest);
	                        },
	                        failure : function(result) {
	                            mizhu.toast("网络错误",1500);
	                        }
	                    },
	                    "columns": colData,
	                    "oLanguage" : { // 语言设置  
	                        "sLengthMenu" : "每页显示 _MENU_ 条记录",
	                        "sZeroRecords" : "抱歉， 没有找到",
	                        "sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
	                        "sInfoEmpty" : "没有数据",
	                        "sInfoFiltered" : "(从 _MAX_ 条数据中检索)",
	                        "sZeroRecords" : "没有检索到数据",
	                        "sSearch" : "检索:",
	                        "oPaginate" : {
	                            "sFirst" : "首页",
	                            "sPrevious" : "前一页",
	                            "sNext" : "后一页",
	                            "sLast" : "尾页"
	                        }
	                    }
	                })
            	}
                return table;
            },
			
			//获取登录页关键字
		    getSystemValue:function(url,type,data){
		    	mcfish.API.asyncRequest(url,type,data).then(function(result){
					var res = result.data
					 for(var i=0;i<res.length;i++){
			    		if(res[i].key=="project"){
			    			 $("#project").html(res[i].value);
			    			 $("#indexProjectName").html(res[i].value);
			    		}
			    		if(res[i].key=="copyright"){
			    			 $("#copyright").text(res[i].value);
			    		}
			    		if(res[i].key=="logo" && res[i].value != null && res[i].value != ""){
			    			 $("#logo").attr("src",res[i].value);
			    		}
			    		if(res[i].key=="login_background"){
			    			 $("body").css("background","url(" + res[i].value + ")");
			    			 $("body").css("background-size","cover");
			    		}
			    	}
				});
		    }
        },
        
        /***************************************************************
         ** 
         * @brief 本地辅助函数
         **
         ***************************************************************/
        Handle: {
            /**
             * 
             * @param brief 上传图片方式
             * @param {object} files: input[0].files
             * @param {String} bath : 模块区分，由那个模块调用就传入当前模块名；例： 当前在api/system/... 模块下的接口调用，则bath值为 system
             * 利用promise 异步机制拿到 同步数据
             * 
             * */
            postImgURL: function (files, bath) {
                var file = files;
                if (typeof FileReader == 'undefined') {
                    alert("<p>你的浏览器不支持FileReader接口！</p>");
                }
                if (!/image\/\w+/.test(file.type)) { //检验是否为图像文件  
                    alert("看清楚，这个需要图片！");
                    return false;
                }
                return new Promise(function (resolve, reject) { // 通过 base64 上传
                    let reader = new FileReader()
                    reader.readAsDataURL(file) // base64
                    reader.onload = function () {
                        var initImgSize = this.result.length;
                        var img = new Image();
                        img.src = this.result;
                        if (initImgSize <= (100 * 1024)) { // if >  100kb should upload
                            mcfish.Handle.uploadFileBase64(this.result, bath, function (res) {
                                if (res.code === 0) {
                                    resolve(res.data.fileUrl)
                                } else {
                                    alert("上传失败");
                                }
                            })
                        } else {
                            img.onload = function () { // 当图片加载完成时
                                var compressUrl = compress(img)
                                mcfish.Handle.uploadFileBase64(compressUrl, bath, function (res) {
                                    if (res.code === 0) {
                                        resolve(res.data.fileUrl)
                                    } else {
                                        alert(res.msg);
                                    }
                                })
                            }
                        }
                    }
                })
                function compress(img) { 
                    var initSize = img.src.length;
                    var width = img.width;
                    var height = img.height;
                    var canvas = document.createElement('canvas');
                    var tCanvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d')
                    var tctx = tCanvas.getContext('2d')
                    var ratio;
                    if ((ratio = width * height / 4000000) > 1) { 
                        ratio = Math.sqrt(ratio);
                        width /= ratio;
                        height /= ratio;
                    } else {
                        ratio = 1;
                    }
                    canvas.width = width;
                    canvas.height = height;
                    ctx.fillStyle = "#fff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height); //  铺底色
                    var count;
                    if ((count = width * height / 1000000) > 1) {
                        count = ~~(Math.sqrt(count) + 1); //  计算要分成多少块瓦片
                        var nw = ~~(width / count);
                        var nh = ~~(height / count);
                        tCanvas.width = nw;
                        tCanvas.height = nh;
                        for (var i = 0; i < count; i++) {
                            for (var j = 0; j < count; j++) {
                                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                            }
                        }
                    } else {
                        ctx.drawImage(img, 0, 0, width, height);
                    }
                    var ndata = canvas.toDataURL('image/jpeg', 0.7); // 处理
                    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
                    return ndata;
                }
            },
            /***
             * @brief 图片上传 base64
             * 
             * @param {Obeject} file : file对象
             * @param {String} bath : 模块区分，由那个模块调用就传入当前模块名；例： 当前在api/system/... 模块下的接口调用，则bath值为 system
             */
            uploadFileBase64: function (file, bath, callback) {
                $.ajax({
                    url: href + 'api/system/uploadFileBase64',
                    type: 'POST',
                    data: {
                        data: file,
                        bath: bath
                    },
                    beforeSend: function (request) {
                        if(window.sessionStorage.getItem("userinfo")){
							request.setRequestHeader("uid",JSON.parse(window.sessionStorage.getItem("userinfo")).id);
							request.setRequestHeader("token",JSON.parse(window.sessionStorage.getItem("userinfo")).token);
						}
                    },
                    success: callback,
                    error: function (err) {
                        alert('err:' + JSON.stringify(err));
                    }
                })
            },
        },
        /***************************************************************
         ** 
         * @brief 本地工具函数
         **
         ***************************************************************/
        Tools: {
        	/**
        	 * 获取接口服务器地址
        	 */
        	getServerAddr: function(){
        		return href;
        	},
        	/**
             * 获取项目根路径
             * 获取协议+IP+端口+项目名； 例如：http://localhost:8080/JYTX_ADMIN/
             */
            getBasicUrl: function() {
		 		var href = window.location.href;
		 		var temp = href;
		 		temp = temp.substring(temp.indexOf("//") + 2, temp.length);
		 		temp = temp.substring(temp.indexOf("/") + 1, temp.length);
		 		temp = temp.substring(temp.indexOf("/") + 1, temp.length);
		 		temp = href.substring(0, href.length - temp.length);
		 		return temp;
		 	},
		 	/**
		 	 * 获取协议+IP+端口； 例如：http://localhost:8080/
		 	 */
		 	getBasicAddr: function() {
		 		var href = window.location.href;
		 		var temp = href;
		 		temp = temp.substring(temp.indexOf("//") + 2, temp.length);
		 		temp = temp.substring(temp.indexOf("/") + 1, temp.length);
		 		temp = href.substring(0, href.length - temp.length);
		 		return temp;
		 	},
            /**
             * 获取 SESSION
             */
            is_Session: function(name) {
                if(sessionStorage.getItem(name)) {
                    return JSON.parse(sessionStorage.getItem(name))
                } else {
                    return null
                }
            },
        	/**
			 * 请求成功相关操作
			 */
			requestSuccess:function(resolve,result,callback){
				if(result.code == 0){
					if(resolve != null){
						resolve(result)
					}else if(callback != null){
						callback(result)
					}else{
						mizhu.toast("请求接口js框架错误",1000);
					}
				}else if(result.code == 105){
					mizhu.toast("暂无权限",1000);
				}else if(result.code == 110 || result.code == 112 || result.code == 208){
					mizhu.toast(result.msg,1000);
					setTimeout(this.comebackURL,1000)
				}else{
					mizhu.toast(result.msg,1500);
				}
			},
			/**
			 * 请求失败相关操作
			 */
			errorAction:function(XMLHttpRequest){
				if (XMLHttpRequest.code == 200) {
					
				}else if(XMLHttpRequest.code == 110 || XMLHttpRequest.code == 112 || XMLHttpRequest.code == 208
						|| XMLHttpRequest.code == 108){
					mizhu.toast(result.msg,1000);
					setTimeout(this.comebackURL,1000)
				}else if(XMLHttpRequest.code == 105){
					mizhu.toast("暂无权限",1000);
				}else if(XMLHttpRequest.code == 400) {
					mizhu.toast("你的请求参数有问题！",1000);
				}else if(XMLHttpRequest.code == 404) {
					mizhu.toast("资源没有找到",1500);
				}else if(XMLHttpRequest.code == 405) {
					mizhu.toast("请求方式错误",1500);
				}else if(XMLHttpRequest.code == 500) {
					mizhu.toast("服务器出现问题",1500);
				}else{
					mizhu.toast("未知错误，请联系管理员",1500);
				}
            },
            
            getUrlParams : function(name) { // 不传name返回所有值，否则返回对应值
			    var url = window.location.search;
			    if (url.indexOf('?') == 1) { return false; }
			    url = url.substr(1);
			    url = url.split('&');
			    var name = name || '';
			    var nameres;
			    // 获取全部参数及其值
			    for(var i=0;i<url.length;i++) {
			        var info = url[i].split('=');
			        var obj = {};
			        obj[info[0]] = decodeURI(info[1]);
			        url[i] = obj;
			    }
			    // 如果传入一个参数名称，就匹配其值
			    if (name) {
			        for(var i=0;i<url.length;i++) {
			            for (const key in url[i]) {
			                if (key == name) {
			                    nameres = url[i][key];
			                }
			            }
			        }
			    } else {
			        nameres = url;
			    }
			    // 返回结果
			    return nameres;
			},
			            
            
			/**
			 * 回到登录页
			 */
			comebackURL:function(){
				if(window != top){
					top.location.href = href;
				}else{
					window.location.href = href;
				}
			},
            /** 
             * @param {string} url 完整的URL地址 
             * @returns {object} 自定义的对象 
             * @description 用法示例：var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
             * */
            parseURL: function (url) {
                var a = document.createElement('a');
                a.href = url;
                return {
                    source: url,
                    protocol: a.protocol.replace(':', ''),
                    host: a.hostname,
                    port: a.port,
                    query: a.search,
                    params: (function () {
                        var ret = {},
                            seg = a.search.replace(/^\?/, '').split('&'),
                            len = seg.length,
                            i = 0,
                            s;
                        for (; i < len; i++) {
                            if (!seg[i]) {
                                continue;
                            }
                            s = seg[i].split('=');
                            ret[s[0]] = s[1];
                        }
                        return ret;
                    })(),
                    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
                    hash: a.hash.replace('#', ''),
                    path: a.pathname.replace(/^([^\/])/, '/$1'),
                    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
                    segments: a.pathname.replace(/^\//, '').split('/')
                };
            },
            /**
             * @brief 整数排序
             * */
            intBy: function (name, choice) {
                return function (o, p) {
                    var a, b;
                    if (typeof o === "object" && typeof p === "object" && o && p) {
                        a = parseInt(o[name]);
                        b = parseInt(p[name]);
                        if (a === b) {
                            return 0;
                        }
                        if (choice) { // true: 小序排列 
                            if (typeof a === typeof b ) {
                                return a < b ? -1 : 1;
                            } 
                            return typeof a < typeof b ? -1 : 1;
                        } else { // fasle: 大序排序
                            if (typeof a === typeof b ) {
                                return a > b ? -1 : 1;
                            } 
                            return typeof a > typeof b ? -1 : 1;
                        }
                    } else {
                        throw ("error");
                    }
                }
            },
            /**
             * @brief 手机验证
             * */
            isTel: function (phone) {
                var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
                if (!myreg.test(phone)) {
                    return false;
                } else {
                    return true;
                }
            },
            /**
             * 邮箱校验
             * @param {Object} email 要校验的邮箱
             */
            isEmail: function(email){
            	 var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            	 if(!myreg.test(email)){
            	 	return false;
            	 }else{
            	 	return true;
            	 }
            },
            /**
             * @brief 获取cookie
             * */
            GetCookie: function (name) {
                var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
				if(arr = document.cookie.match(reg)){
					return unescape(arr[2]);
				}else{
					return null;
				}
            },
            /**
             * 设置cookie
             * @param {Object} name： cookie名称
             * @param {Object} value: cookie值  ,每个值之间用“,”隔开,如：“123,456,123” 三个值
             * @param {Object} time: s20是代表20秒  h是指小时，如12小时则是：h12 d是天数，30天则：d30
             */
            SetCookie: function(name,value,time){
            	var strsec = '';
            	var str1 = time.substring(1, time.length) * 1;
				var str2 = time.substring(0, 1);
				if(str2 == "s") {
					strsec = str1 * 1000;
				} else if(str2 == "h") {
					strsec = str1 * 60 * 60 * 1000;
				} else if(str2 == "d") {
					strsec = str1 * 24 * 60 * 60 * 1000;
				}
				var exp = new Date();
				exp.setTime(exp.getTime() + strsec * 1);
				document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
            },
            /**
             * @brief 删除cookie
             * */
            DelCookie: function (name) {
                var exp = new Date();
                exp.setTime(exp.getTime() - 1);
                var cval = this.GetCookie(name);
                if(cval != null){
                	document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
                }
            },
            /**
             * 
             * 秒转 时分秒
             */
            hms: function (seconds) {
                return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0]
            },
            /**
             * 计算 nDay 时间 的后 days天的时间,如果nDay为"",则是获取当前时间的 后面days的日期（若要计算nDay时间的钱days天的时间，days请使用 负数表示。）
             * eg: 计算2018-01-19往后5天的时间： var date = calculateDate("2018-01-19",5)  结果：2018-01-24
             * eg: 计算2018-01-19往前5天的时间： var date = calculateDate("2018-01-19",-5) 结果：2018-01-14
             * 返回格式： yyyy-MM-dd
             * @param {Object} nDay：要计算的时间节点，如果为空则是系统的当前时间。 格式：yyyy-MM-dd
             * @param {Object} days:要计算的时间天数，如果为正数则是计算nDay往后days天的时间，如果为负数则是计算nDay往前days天的时间
             */
            calculateDate: function(nDay,days){
            	if(nDay == "" || nDay == null){
					var now=new Date();  
				}else{
				   var now=new Date(this.stringToDate(nDay).getTime());   
				}
			    if(days != 0 && days != null){
				   now=new Date(now.getTime()+86400000*days); //86400000 = 24小时*60分*60秒*1000毫秒 = 1天
			    }   
			    var yyyy=now.getFullYear(),mm=(now.getMonth()+1).toString(),dd=now.getDate().toString();
			   
			    if(mm.length==1){
				   mm='0'+mm;
			    } 
			    if(dd.length==1){
				    dd='0'+dd;
			     }
			    return (yyyy+'-'+mm+'-'+dd);    
            },
            /**
             * 字符串转时间格式  
             * @param {Object} strDate:要转换的时间字符串
             */
            stringToDate: function(strDate){
            	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
					function(a) {
						return parseInt(a, 10) - 1;
					}).match(/\d+/g) + ')');
				return date;
            },
            /**
             * 格式化时间
             * @param {Object} time： 需要格式化的时间戳
             * @param {Object} type： 需要返回的时间格式 	1：yyyy-MM-dd HH:mm:ss	2：yyyy-MM-dd	3：yyyyMMdd     4：yyyyMMdd-HH:mm:ss
             */
            getMyDate: function(time, type){
            	if(time == undefined || time == null || time == ""){
            		return "";
            	}
            	
				//时间格式：yyyy-MM-dd HH:mm:ss
				if (type == 1) {
					var oDate = new Date(time), oYear = oDate.getFullYear(), oMonth = oDate
							.getMonth() + 1, oDay = oDate.getDate(), oHour = oDate
							.getHours(), oMin = oDate.getMinutes(), oSen = oDate
							.getSeconds(), oTime = oYear + '-' + this.getzf(oMonth)
							+ '-' + this.getzf(oDay) + ' ' + this.getzf(oHour) + ':'
							+ this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间  
					return oTime;
				}
				//时间格式：yyyy-MM-dd
				if (type == 2) {
					var oDate = new Date(time), oYear = oDate.getFullYear(), oMonth = oDate
							.getMonth() + 1, oDay = oDate.getDate(), oTime = oYear
							+ '-' + this.getzf(oMonth) + '-' + this.getzf(oDay);//最后拼接时间  
					return oTime;
				}
				//时间格式：yyyyMMdd
				if (type == 3) {
					var oDate = new Date(time), oYear = oDate.getFullYear(), oMonth = oDate
							.getMonth() + 1, oDay = oDate.getDate(), oTime = oYear + this.getzf(oMonth) + this.getzf(oDay);//最后拼接时间  
					return oTime;
				}
				//时间格式：yyyyMMdd-HH:mm:ss
				if (type == 4) {
					var oDate = new Date(time), oYear = oDate.getFullYear(), oMonth = oDate
							.getMonth() + 1, oDay = oDate.getDate(), oHour = oDate
							.getHours(), oMin = oDate.getMinutes(), oSen = oDate
							.getSeconds(), oTime = oYear + this.getzf(oMonth)
							+ this.getzf(oDay) + '-' + this.getzf(oHour) + ':'
							+ this.getzf(oMin) + ':' + this.getzf(oSen);//最后拼接时间  
					return oTime;
				}
            },
            /**
             * 格式化时间，自定义时间格式
             * @param {Object} date
             * @param {Object} fmt	“yyyy-MM-dd HH:mm:ss”
             */
            dateFormat: function(date, fmt) {
                if(date == null) {
                    return null;
                }
                if(date.constructor == String || date.constructor == Number) {
                    if(!isNaN(date)) {
                        date = Number(date);
					}
                    date = new Date(date);
                }

                var o = {
                    "M+" : date.getMonth()+1,                 //月份
                    "d+" : date.getDate(),                    //日
                    "h+" : date.getHours(),                   //小时
                    "m+" : date.getMinutes(),                 //分
                    "s+" : date.getSeconds(),                 //秒
                    "q+" : Math.floor((date.getMonth()+3)/3), //季度
                    "S"  : date.getMilliseconds()             //毫秒
                };
                if(/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
                }
                for(var k in o) {
                    if(new RegExp("("+ k +")").test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    }
                }
                return fmt;
            },
            /**
             * 获取带星期几的时间格式，
             * @param {Object} otime 要获取格式的时间，如果不传则获取当前的系统时间
             * @param {Object} type 要获取的时间类型 1： 2018年02月01日 星期四
             */
            getWeekDate:function(otime,type){
            	var time;
            	if(otime == null || otime == ""){
            		time=new Date(); 
            	}else{
            		time = new Date(otime);
            	}
				var show_day=new Array('星期一','星期二','星期三','星期四','星期五','星期六','星期日'); 
				var year=time.getFullYear(); 
				var month=time.getMonth() + 1; 
				var date=time.getDate(); 
				var day=time.getDay(); 
				
				month<10?month='0'+month:month; 
				date<10?date='0'+date:date;
				
				if(type == 1){
					return year+'年'+month+'月'+date+'日'+' '+show_day[day-1]; 
				}
            },
            /**
             * 补0操作,当时间数据小于10的时候，给该数据前面加一个0  
             * @param {Object} num
             */
            getzf:function(num){
            	if (parseInt(num) < 10) {
					num = '0' + num;
				}
				return num;
            },
            
            /**
             * 通过图片URL下载图片
             * @param {Object} url 图片URL
             */
            downloadPhoto:function(url){
            	if (this.myBrowser()==="IE"||this.myBrowser()==="Edge"){
		            this.SaveAs5(url);
		        }else{
		            this.downloadImg(url);
		        }
            },
            /**
             * 判断浏览器类型
             */
            myBrowser:function(){
            	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
		        var isOpera = userAgent.indexOf("Opera") > -1;
		        if (isOpera) {
		            return "Opera"
		        }; //判断是否Opera浏览器
		        if (userAgent.indexOf("Firefox") > -1) {
		            return "FF";
		        } //判断是否Firefox浏览器
		        if (userAgent.indexOf("Chrome") > -1){
		            return "Chrome";
		        }
		        if (userAgent.indexOf("Safari") > -1) {
		            return "Safari";
		        } //判断是否Safari浏览器
		        if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
		            return "IE";
		        }; //判断是否IE浏览器
		        if (userAgent.indexOf("Trident") > -1) {
		            return "Edge";
		        } //判断是否Edge浏览器
            },
            /**
             * IE浏览器图片保存本地
             * @param {Object} imgURL 图片路径
             */
            SaveAs5:function(imgURL){
            	var oPop = window.open(imgURL,"","width=1, height=1, top=5000, left=5000");
		        for(; oPop.document.readyState != "complete"; )
		        {
		            if (oPop.document.readyState == "complete")break;
		        }
		        oPop.document.execCommand("SaveAs");
		        oPop.close();
            },
            /**
             * 谷歌，360极速等浏览器下载
             * @param {Object} src 图片路径
             */
            downloadImg:function(src){
            	var $a = document.createElement('a');
		        $a.setAttribute("href", src);
		        $a.setAttribute("download", "");
		
		        var evObj = document.createEvent('MouseEvents');
		        evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
		        $a.dispatchEvent(evObj);
            },
            /**
             * 设置图片
             * @param {Object} obj 放置图片的DOM对象的id
             * @param {Object} url 图片路径
             */
            setImage:function (obj,url){
            	var df = "http://p2mlbub8r.bkt.clouddn.com/project/15198026819510.6884991353254316.png";
            	if( url == undefined || url == null || url == ""){
            		$("#" + obj).attr("src",df);
            	}else{
            		$("#" + obj).attr("src",url);
            	}
            	$("#" + obj).error(function(){
            		$("#" + obj).attr("src",df);
            	})
		    },
		    /**
		     * 检测图片路径是否为空，如果为空返回默认图片
		     * @param {Object} url
		     */
		    toHeadImage:function(url){
		    	if(url == null || url.length < 15){
		    		return this.getBasicUrl() + "dist/mcfish/image/head.png";
		    	}
		    	return url;
		    },
		    /**
			 * 判断文件类型是否是符合规定的类型
			 * @param {Object} file 要判断的文件
			 * @param {Object} data 允许上传的文件类型数组； 例：["word","excel","mp4"]
			 */
			fileTypeJudge:function(file, data){
				if (typeof Array.isArray === "function") {
					if(!Array.isArray(data)){
						throw new Error('not Array!'); 
					}
				}else{
					if(!Object.prototype.toString.call(data) === "[object Array]"){
						throw new Error('not Array!'); 
					}
				}
				var a = 0;
				for(var i = 0 ; i < data.length ; i++){
					if(file.type.indexOf(data[i]) >= 0){
						a = 1;  
					}
				}
				return a===1?true:false;
			},
			/**
			 * 自定义定时器，按指定时间间隔执行指定次
			 * @param {Object} callback	需要执行的函数
			 * @param {Object} times	需要执行的次数
			 * @param {Object} time		每次执行的时间间隔
			 * @param {Object} arr		需要执行的函数的参数数组
			 */
		    timerExecute:function(callback, times, time, arr){
		    	var i = 1;
				var timer;
		    	if(callback){
	    			timer = setInterval(function(){
	    				if(i <= times){
	    					try{
	    						callback.apply(null,arr);
	    						//console.log("函数：" + callback.name + "---执行次数：" + i);
		    					i++;
	    					}catch(e){
	    						clearInterval(timer);
	    						throw new Error("execute callback error")
	    					}
	    				}else{
			    			clearInterval(timer);
			    		}
	    			},time);
		    	}else{
		    		if(timer){
		    			clearInterval(timer);
		    		}
		    		throw new Error("callback not function!")
		    	}
		    },
		    /**
		     * 格式化单位为：分的金钱
		     * @param {Object} money 金钱（单位分）
		     * @param {Object} fix	保留的小数位，默认两位小数
		     */
		    toMoney:function(money,fix){
		    	if(fix == undefined || fix == null){
		    		fix = 2
		    	}
		    	money = parseFloat(money)/100;
				return "￥" + money.toFixed(fix);
		    },
		    /**
			 * 图片上传组件使用
			 * @param {Object} obj
			 */
			uploadImg: function(obj,url){
						
				var file = $(obj)[0].files[0];
				
				if (!file) {
					mizhu.toast('上传文件不能为空')
					return
				}
				if (!$tools.fileTypeJudge(file, ["jpg","png","jpeg"])){
					mizhu.toast('请上传正确格式的文档')
					return
				}
				
				var form = new FormData();    // FormData 对象
				
				form.append("file", file);    // 文件对象
				
				$api.processRequest(url,'POST',form).then(function(res){
					$(obj).parent().parent().parent().parent().find("img").attr("src", res.data.url);
					$(obj).val("");
				})
			},
			deleteImg: function(obj){
				$(obj).parent().parent().parent().find("img").attr("src","" );
				$(obj).prev().find("input").val("");
			},
			/**
			 * 添加图片
			 */
			addImg: function(obj,url){
				$(obj).after("<input type='file' class='form-control' onchange='mcfish.Tools.addImgs(this,\""+ url +"\")'>");
				$(obj).parent().find("input").trigger("click");
			},
			/**
			 * 上传图片
			 * @param {Object} obj
			 */
			addImgs: function(obj,url){
				
				var file = obj.files[0];
				var form = new FormData();    // FormData 对象
				form.append("file", file);    // 文件对象
				
				$api.processRequest(url,'POST',form).then(function(res){
					
					$(obj).parent().find("img").attr("src",res.data.url);
					$(obj).parent().find(".imgs").removeAttr("onclick");
					$(obj).parent().find("img").after("<img src=\"../mcfish/image/icon_remove.png\" class=\"icon_colse\" onclick=\"mcfish.Tools.removeImg(this)\"//>");
					$(obj).parent().after("<div class='addFile'><img src='../mcfish/image/add.png' class='imgs' onclick='mcfish.Tools.addImg(this,\""+ url +"\")'/></div>");
				})
				
			},
			/**
			 * 删除当前图片
			 * @param {Object} obj
			 */
			removeImg:function(obj){
				$(obj).parent().remove();
			}
        }
    }
    window.mcfish = mcfish;
    //当页面尺寸变化时调用countHeight来重新计算页面高度
    $(window).resize(function(){
		 mcfish.Interceptor.countHeight();
	});
	mcfish.Tools.timerExecute(mcfish.Interceptor.countHeight,4,100);
}(window)
