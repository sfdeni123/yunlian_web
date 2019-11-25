/**
 * @Name：layui.mcfish 工具集 
 * @Author：ely_lon
 */
layui.define('jquery', function(exports) {
	"use strict";

	var $ = layui.$
	,layer = layui.layer
	,jquery = layui.jquery
	,pName = "HDCM_OPERATION"
	//外部接口
	,mcfish = {
		//回到登录页
		redirectLogin: function() {
            var href = window.location.href;
            if(href.indexOf("tologin") != -1){
                top.window.location.reload();
            }else{
                top.window.location.href = mcfish.getReqUri() + "/tologin";
            }
		}
		,getReqUri: function () {
			if(window.location.href.indexOf(pName) != -1){
//				return "/" + pName;
				return "http://47.52.34.187:0";
//				return "http://127.0.0.1:9000";
			}else{
//				return "http://127.0.0.1:9000";
                return "http://47.52.34.187:9000";
            }
		}
		/** 
		 * @param {string} url 完整的URL地址 
		 * @returns {object} 自定义的对象 
		 * @description 用法示例：var myURL = parseURL('http://abc.com:8080/dir/index.html?id=255&m=hello#top');
		 */
		,parseURL: function(url) {
			var a = document.createElement('a');
			a.href = url;
			return {
				source: url,
				protocol: a.protocol.replace(':', ''),
				host: a.hostname,
				port: a.port,
				query: a.search,
				params: (function() {
					var ret = {},
						seg = a.search.replace(/^\?/, '').split('&'),
						len = seg.length,
						i = 0,
						s;
					for(; i < len; i++) {
						if(!seg[i]) {
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
		}
		/**
		 * @brief 获取cookie
		 */
		,getCookie: function(name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if(arr = document.cookie.match(reg)) {
				return unescape(arr[2]);
			} else {
				return null;
			}
		}
		/**
		 * 设置cookie
		 * @param {Object} name： cookie名称
		 * @param {Object} value: cookie值  ,每个值之间用“,”隔开,如：“123,456,123” 三个值
		 * @param {Object} time: s20是代表20秒  h是指小时，如12小时则是：h12 d是天数，30天则：d30
		 */
		,setCookie: function(name, value, time) {
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
		}
		/**
		 * @brief 删除cookie
		 */
		,delCookie: function(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = mcfish.getCookie(name);
			if(cval != null) {
				document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
			}
		}

		/**
		 * 格式化单位为：分的金钱
		 * @param {Object} money 金钱（单位分）
		 * @param {Object} fix	保留的小数位，默认两位小数
		 */
		,toMoney: function(money, fix) {
			if(fix == undefined || fix == null) {
				fix = 2
			}
			if(money == 'undefined' || money == null ||
				money == 'null' || money == undefined) {
				return "￥" + '0.00';
			}
			money = parseFloat(money) / 100;
			return "￥" + money.toFixed(fix);

		}
		,get:function(url,data,callback,async){
			$.ajax({
				type:'get'
                ,url: mcfish.getReqUri() + "/" + url
                ,async: async==undefined?true:false
				,dataType: "json"
				,data: data
				,beforeSend: function(request) {
		            if(layui.sessionData("hdcm_operation") != null){
						request.setRequestHeader("id",layui.sessionData("hdcm_operation").user.id);
		            	request.setRequestHeader("token",layui.sessionData("hdcm_operation").user.token);
					}
		        }
				,success: function(result) {
					
                    if(result.code === 0) {
                        if(callback != null) {
                            callback(result)
                        } else {
                            layer.msg(result.msg);
                        }
                    } else if(result.code === 1110) {
                        layer.msg('登录已过期', {
                            icon: 4,
                            anim: 5
                        }, function() {
                            mcfish.redirectLogin();
                        });
                    } else {
                        layer.msg(result.msg);
                    }

				}
            	,error: function(XMLHttpRequest) {
                    if(XMLHttpRequest.status === 404){
                        layer.msg('404', {
                            icon: 0
                        });
                    }else{
                        layer.msg('未知错误', {
                            icon: 0
                        });
                    }
				}
            	,failure: function(result) {
					layer.msg(result.msg, {
						icon: 0
					});
				}
			})
		}
		,post:function(url,data,callback,async) {
			$.ajax({
				type: 'post'
				, url: mcfish.getReqUri() + "/" + url
				, async: async == undefined ? true : false
				, dataType: "json"
				, data: data
				,beforeSend: function(request) {
					if(layui.sessionData("hdcm_operation").user != null){
						request.setRequestHeader("id",layui.sessionData("hdcm_operation").user.id);
		            	request.setRequestHeader("token",layui.sessionData("hdcm_operation").user.token);
					}

		        }
				, success: function (result) {
					if (result.code === 0) {
						if (callback != null) {
							callback(result)
						} else {
							layer.msg(result.msg);
						}
					} else if (result.code === 1110) {
						layer.msg('登录已过期', {
							icon: 4,
							anim: 5
						}, function () {
							mcfish.redirectLogin();
						});
					} else {
						layer.msg(result.msg);
					}

				}
				, error: function (XMLHttpRequest) {
					if (XMLHttpRequest.status === 404) {
						layer.msg('404', {
							icon: 0
						});
					}else{
                        layer.msg('未知错误', {
                            icon: 0
                        });
					}
				}
				, failure: function (result) {
					layer.msg(result.msg, {
						icon: 0
					});
				}
			})
		}
	};
	exports('mcfish', mcfish);
});