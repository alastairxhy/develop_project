// var request_url = 'http://admincs.yunandawulian.com/appServer/webApi/rpv1',request_url_v2 = 'http://admincs.yunandawulian.com/appServer/webApi/rpv2';
// var request_url_json = 'http://admincs.yunandawulian.com/appServer/webApi/rbv1',request_url_json_v2 = 'http://admincs.yunandawulian.com/appServer/webApi/rbv2',
//     xhrFields = {withCredentials: true},
//     project_path = window.document.location.host,
//     index_map;
//
// const debug = true;
// $(".debug").hide();
// if(debug){
//     $(".debug").show();
// }
//
// $.ajaxSetup({
//     url: "http://admincs.yunandawulian.com/appServer/webApi/rpv1",
//     type: "post",
//     dataType: "json",
//     xhrFields: xhrFields,
//     complete: function (XMLHttpRequest, textStatus, xhr) {
//         var oauthstatus = XMLHttpRequest.getResponseHeader("oauthstatus");
//         if (oauthstatus == '401') {
//             self.location.href = "../../login2.html";
//         }
//
//     },
//     // error:function () {
//     //     alert_warning()
//     // }
// });


//获取Object对象的长度-------------------------
function leng(obj) {
    var count = 0;
    for (var i in obj) {
        count++;
    }
    return count;
}

//设置COOKIE保存的键值对-------------------------------------------
var setCookie = function (Key, value, dataTime) {
    var new_date = new Date();
    new_date.setTime(new_date.getTime()) + (dataTime * 60 * 60 * 1000);
    var expires = "expries=" + new_date.toGMTString();
    document.cookie = Key + "=" + encodeURIComponent(value) + ";" + expires;
}

//获取COOKIE保存的字段的值---------------------------------
var getCookie = function (Key) {
    var Key = Key + "=";
    var CookieIndex = document.cookie.split(";");
    for (var j = 0; j < CookieIndex.length; j++) {
        var value = CookieIndex[j].trim();
        if (value.indexOf(Key) == 0) {
            return decodeURIComponent(value.substring(Key.length, value.length));
        }
    }
    return '';
}

//服务错误警告弹窗---------------------------------
var alert_warning = function () {
    layui.use("layer", function () {
        var layer = layui.layer;
        layer.alert("服务错误！请联系管理员")
    })
}

//获取URL带参参数字段值-------------------------------------
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {

        var pair = vars[i].split("=");

        if (pair[0] == variable) {
            return pair[1];
        }
    }
    ;

    return (false);
};

//获取父级URL带参参数字段值-------------------------------------
function getQueryVariable_2(variable) {
    var pos, str, para, parastr;
    var array = []
    str = document.referrer;
    parastr = str.split("?")[1];
    if (parastr) {
        var arr = parastr.split("&");
        for (var i = 0; i < arr.length; i++) {
            array[arr[i].split("=")[0]] = arr[i].split("=")[1];
        }
    }


    return array[variable];
};


//表格搜索公共函数------------------------------
function table_search(container, parameter, url) {
    /**
     *
     * @param {string} container   查询的table表
     * @param {object} parameter   查询条件的参数
     *
     * **/
    layui.use("table", function () {
        var table = layui.table;
        table.reload(container, {
            url: url ? url : request_url,
            where: parameter,
            page: {
                curr: 1
            }
        });

    })
}

//设置地址选择器-----------------------------------------------
function set_city_select(elem, type, placeholder, code, default_code) {
    /**
     *
     * @param {elem} elem    渲染元素select
     * @param {string} type   选择器类型------省，市，区，街道
     * @param {string} placeholder   初始的提示语
     * @param {string} code 默认渲染的地区代码
     * @param {string} default_code 渲染后默认选中的地区代码
     *
     * **/
    layui.use("form", function () {
        var form = layui.form;
        var _text = placeholder ? placeholder : "";
        $(elem).empty();
        $(elem).append("<option value=''>" + _text + "</option>");
        switch (type) {
            case "province":
                for (var j = 10; j < 99; j++) {
                    if (city_list[j + '0000']) {
                        var selected = (j + "0000") == default_code ? "selected='true'" : "";
                        $(elem).append("<option value='" + j + "0000" + "'" + selected + ">" + city_list[j + '0000'] + "</option>");
                    }
                }
                ;
                break;
            case "city":
                if (code === '110000' || code === '120000' || code === '310000' || code === '500000') {

                    var city_code = code.substr(0, 2) + '01';
                    for (var j = 1; j < 99; j++) {
                        j = j < 10 ? "0" + String(j) : j;
                        if (city_list[city_code + j]) {
                            var selected = (city_code + j) == default_code ? "selected='true'" : "";
                            $(elem).append("<option value='" + city_code + j + "'" + selected + ">" + city_list[city_code + j] + "</option>");
                        }
                    }
                    ;

                } else {
                    var province_code = code.substr(0, 2);
                    for (var j = 1; j < 99; j++) {
                        j = j < 10 ? "0" + j : j;
                        if (city_list[province_code + j + '00']) {
                            var selected = (province_code + j + '00') == default_code ? "selected='true'" : "";
                            $(elem).append("<option value='" + province_code + j + '00' + "'" + selected + ">" + city_list[province_code + j + '00'] + "</option>");
                        }
                    }
                    ;
                }


                break;
            case "district":
                var city_code = code.substr(0, 4);
                for (var j = 1; j < 99; j++) {
                    j = j < 10 ? "0" + String(j) : j;
                    if (city_list[city_code + j]) {
                        var selected = (city_code + j) == default_code ? "selected='true'" : "";
                        $(elem).append("<option value='" + city_code + j + "'" + selected + ">" + city_list[city_code + j] + "</option>");
                    }
                }
                ;
                break;
            case "street":
                $.ajax({
                    data: {
                        methodName: "getStreetList",
                        districtCode: code
                    },
                    success: function (res) {
                        if (res.obj.streetList && res.success) {
                            var streetList_keys = Object.keys(res.obj.streetList);
                            for (var j = 0; j < leng(res.obj.streetList); j++) {
                                var selected = streetList_keys[j] == default_code ? "selected='true'" : "";
                                $(elem).append("<option value='" + streetList_keys[j] + "'" + selected + ">" + res.obj.streetList[streetList_keys[j]] + "</option>")
                            }
                            ;
                            form.render("select");
                        } else if (!res.success) {
                            layer.alert(res.msg)
                        }

                    }
                });
                break;
        }
        ;
        form.render("select");

    })

};

//岗位职责添加成员------------------------------------------------
function add_post_member(member, elem, num, name, phone) {
    /**
     *
     *@param {string} menber  添加的人员类型
     * @param {elem} elem    定位元素
     * @param {number} num   添加的数值
     *
     * **/

    $('<div class="layui-form-item"> <label class="layui-form-label">' + member + ':</label> <div class="layui-input-inline media_lien_input_1"> <input type="text" name="name_' + num + '" required  lay-verify="required" placeholder="请输入' + member + '" autocomplete="off" class="layui-input" value="' + (name ? name : '') + '"> </div> <label class="layui-form-label">' + member + '电话:</label> <div class="layui-input-inline media_lien_input_1"> <input type="text" name="phone_' + num + '" required  lay-verify="required" placeholder="请输入' + member + '电话" autocomplete="off" class="layui-input" value="' + (phone ? phone : '') + '"> </div> <input type="button" class="layui-btn layui-btn-danger layui-btn-sm" lay-filter="add_form_item_1" id="add_form_item_1" style="margin-top: 4px;" onclick="close_member(this)" value="取消"> </div>').insertBefore(elem);

};

//岗位职责取消添加成员---------------------------------------------
function close_member(e) {
    e.parentNode.remove()
}


//关闭iframe表单---------------------------------------------
function close_lay_iframe() {
    layui.use("layer", function () {
        var layer = layui.layer;
        var index = parent.layer.getFrameIndex(window.name);
        parent.layer.close(index);
    })
};

//设置地图覆盖物---水滴坐标------------------------------------
function set_map_marker(lng, lat, map) {
    /**
     *
     *@param {number} lng & lat   经纬度
     * @param {object} map    map对象
     *
     * **/

    var marker = new BMap.Marker(new BMap.Point(lng, lat));//初始坐标
    map.addOverlay(marker)
}


function ser_fault_marker(lng, lat, map, color) {
    /**
     *
     *@param {number} lng & lat   经纬度
     * @param {object} map    map对象
     * @param {string} color   marker颜色    红，绿，灰
     *
     * **/
    var myIcon = new BMap.Icon("websource/wlzd/img/icon/" + color + "_marker.png", new BMap.Size(50, 50));
    var pt = new BMap.Point(lng, lat);
    var marker2 = new BMap.Marker(pt, {icon: myIcon});  // 创建标注
    marker2.setZIndex(999999);
    map.addOverlay(marker2);
    marker2.addEventListener("click", function () {
        console.log(2222)
    })// 将标注添加到地图中
}


//设置地图中心----------------------------
function set_map_core(lng, lat, map, size) {
    /**
     *
     *@param {number} lng & lat 经纬度
     * @param {object} map对象
     * @param {number} 地图大小
     *
     * **/
    var point = new BMap.Point(lng, lat)
    map.centerAndZoom(point, size)
}

//设置地图的初始坐标------------------------

var set_map = function (parameter) {
    /**
     *
     * @param {object} parameter
     * parameter {string} elem map元素id
     *  parameter {bool} position  开启定位
     * parameter {number} lng    初始经度
     * parameter {number} lat   初始纬度
     * parameter {number} size   地图初始大小
     * parameter {string} search  搜索框的元素id
     * parameter {bool}   scroll  是否开启滚轮缩放
     * parameter {string}   input_value  设置绑定input的默认value
     *
     * **/
    var elem = parameter.elem,
        lng = parameter.lng,
        lat = parameter.lat,
        size = parameter.size,
        search = parameter.search,
        is_scroll = parameter.scroll,
        input_value = parameter.input_value;

    var map = new BMap.Map(elem);
    map.enableScrollWheelZoom(is_scroll);//开启滚轮个缩放
    var geoc = new BMap.Geocoder();

    if (parameter.position) {
        function myFun(result) {//获取初始定位
            var cityName = result.name;
            map.setCenter(cityName);
            map.centerAndZoom(result.center, size);
            map.addOverlay(new BMap.Marker(result.center))
        };
        var myCity = new BMap.LocalCity();
        myCity.get(myFun);
    } else {
        var point = new BMap.Point(lng, lat);  // 创建点坐标
        map.centerAndZoom(point, size);
        map.addOverlay(new BMap.Marker(point));//添加定位坐标
    }
    ;

    if (search) {
        var auto_complete = new BMap.Autocomplete({
            "input": search.input_name,
            "location": map
        });
        auto_complete.setInputValue(input_value ? input_value : '');

        function G(id) {
            return document.getElementById(id);
        }

        var myValue;
        auto_complete.addEventListener("onconfirm", function (e) { //鼠标点击下拉列表后的事件
            var _value = e.item.value;
            myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
            G(search.result_panel).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

            setPlace();
        });

        function setPlace() {
            map.clearOverlays(); //清除地图上所有覆盖物
            function myFun() {
                var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
                map.centerAndZoom(pp, 17);
                map.addOverlay(new BMap.Marker(pp)); //添加标注
            }

            var local = new BMap.LocalSearch(map, { //智能搜索
                onSearchComplete: myFun
            });
            local.search(myValue);
            $("#lng").val(point.lng);
            $("#lat").val(point.lat);
        };

        $("#suggestId").blur(function () {
            if ($('#suggestId').val() == '') {
                layui.use("layer", function () {
                    var layer = layui.layer;
                    layer.alert('请填写单位地址');
                })
            }
            var adds = $('#suggestId').val();
            getPoint(adds);
        });

        function getPoint(adds) {
            // 创建地址解析器实例
            var myGeo = new BMap.Geocoder();
            // 将地址解析结果显示在地图上,并调整地图视野
            myGeo.getPoint(adds, function (point) {
                $('#shopcoord').val(JSON.stringify(point));
                console.log(point);
                $("#lng").val(point.lng);
                $("#lat").val(point.lat);
            });
        };
        layui.use("form", function () {
            layui.form.render()
        })

    }

    if (parameter.click_getPoint) {
        map.addEventListener("click", function (e) {
            //通过点击百度地图，可以获取到对应的坐标
            var pt = e.point;
            geoc.getLocation(pt, function (rs) {
                var addComp = rs.addressComponents;
                //          var site = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
                //将对应的HTML元素设置值
                map.centerAndZoom(pt, 17);
                var all_overlay = map.getOverlays();
                for (var j = 0; j < all_overlay.length; j++) {
                    map.removeOverlay(all_overlay[j])
                }
                map.addOverlay(new BMap.Marker(pt));
                (parameter.point_value)(pt)
            });
        });
    }


    return map;
};

function marker_dateil(mp, opint, field, callback) {
    function dateil_lay(point, text) {
        this._point = point;
        this._text = text;
        this._field = field;
        this._name = "dateil_lay";
    };
    dateil_lay.prototype = new BMap.Overlay();
    dateil_lay.prototype.initialize = function (map) {
        this._map = map;
        var _this = this;
        var div = this._div = document.createElement("div");//创建信息框
        div.style.position = "absolute";
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat) + 99999999;
        div.style.backgroundColor = "#fff";
        div.style.border = "1px solid #ababab";
        div.style.borderRadius = "5px";
        div.style.color = "white";
        div.style.width = "350px";
        div.style.padding = "10px 20px";
        div.style.lineHeight = "18px";
        div.style.whiteSpace = "nowrap";
        div.style.MozUserSelect = "none";
        div.style.fontSize = "12px";
        div.scrollWidth = "2";
        div.style.color = "#444";

        var title = this._title = document.createElement("div");//创建标题
        div.appendChild(title);
        title.style.textAlign = "center";
        title.style.fontSize = "18px";
        title.style.padding = "10px 0 15px";
        title.style.color = "#07a4ff";
        title.appendChild(document.createTextNode("电梯详情"));

        var corner_marker = this._corner_marker = document.createElement("div");//创建角标
        corner_marker.style.width = "100px";
        corner_marker.style.height = "50px";
        corner_marker.style.background = "url(websource/wlzd/img/dateil.png) no-repeat";
        corner_marker.style.position = "absolute";
        corner_marker.style.bottom = "-50px";
        corner_marker.style.left = "50px";
        div.appendChild(corner_marker);


        var close = this._close = document.createElement("button");//创建关闭按钮
        close.setAttribute("class", "layui-btn layui-btn-xs layui-btn-normal");
        close.style.position = "absolute";
        close.style.right = "0px";
        close.style.top = "0px";
        close.style.borderRadius = "0px";
        close.style.borderBottomLeftRadius = "5px";
        close.appendChild(document.createTextNode("关闭"));
        div.appendChild(close);

        var cententBox = this._cententBox = document.createElement("div");//创建内容框
        cententBox.setAttribute("class", "layui-form layui-form-pane");
        div.appendChild(cententBox);

        for (var j = 0; j < this._field.length; j++) {
            cententBox.appendChild(new centent(this._field[j].label, this._field[j].value))
        }
        ;


        close.onclick = function () {
            mp.removeOverlay(_dateil_lay)
        };
        mp.getPanes().labelPane.style.zIndex = 700;
        mp.getPanes().labelPane.appendChild(div);
        return div;
    };

    dateil_lay.prototype.draw = function () {
        var map = this._map;
        var pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - 68 + "px";
        this._div.style.top = pixel.y - 585 + "px";
    };

    var _dateil_lay = new dateil_lay(new BMap.Point(opint.lng, opint.lat));
    mp.addOverlay(_dateil_lay);

    function centent(lable_text, text) {
        var cententItem = document.createElement("div"),
            centent = document.createElement("div"),
            value = document.createElement("div"),
            label = document.createElement("label");

        cententItem.setAttribute("class", "layui-form-item");
        cententItem.style.marginBottom = "10px";

        label.setAttribute("class", "layui-form-label");//创建标签
        label.appendChild(document.createTextNode(lable_text));
        label.style.paddingTop = "0";
        label.style.paddingBottom = "0";
        label.style.height = "30px";
        label.style.lineHeight = "30px";
        label.style.padding = "0";


        centent.setAttribute("class", "layui-input-block");//创建文本框
        centent.style.border = "1px solid #E3E3E3";
        centent.style.minHeight = "28px";
        centent.style.marginLeft = "90px";
        centent.style.paddingLeft = "10px";

        value.innerText = String(text ? text : '未知');//文本赋值
        value.style.minHeight = "28x";
        value.style.lineHeight = "28px";
        value.style.maxHeight = "48px";
        value.style.overflow = "hiden"
        value.style.textOverflow = "ellipsis";


        centent.appendChild(value);
        cententItem.appendChild(label);
        cententItem.appendChild(centent);
        return cententItem;
    }


};


function set_object_key(after_data, before_data) {
    var before_data_KEY = Object.keys(before_data);
    for (var j = 0; j < after_data.length; j++) {
        before_data_KEY.find(function (obj) {
            if (after_data[j].field == obj) {
                $.extend(after_data[j], {value: before_data[obj] ? before_data[obj] : "未知"})
            } else {

            }
        })
    }
    ;
    return after_data;
};


//报警提示--------------------------------------------------
function alarm() {
    window.setInterval(alarm_tips, 5000);//每五秒钟请求一次服务器
}

//请求报警弹窗信息
function alarm_tips() {
    $.ajax({
        data: {methodName: "queryAlarm"},
        success: function (res) {
            if (res.success) {
                if (res.obj.list.length > 0) {
                    alarm_alter(res, 0);
                }
                ;
                if (window.location.pathname == "/yunanda_01/yunanda_develop/contingency.html") {
                    var all_overlay = index_map.getOverlays();
                    for (var j = 1; j < all_overlay.length; j++) {//在范围内添加报警
                        for (var i = 0; i < res.obj.list.length; i++) {
                            if (all_overlay[j].point.lat == res.obj.list[i].latitude && all_overlay[j].point.lng == res.obj.list[i].longitude) {
                                index_map.removeOverlay(all_overlay[j]);
                                ser_fault_marker(res.obj.list[i].longitude, res.obj.list[i].latitude, index_map, "red");
                                set_map_core(res.obj.list[i].longitude, res.obj.list[i].latitude, index_map);
                            }
                        }
                    }
                }
            } else {
                layui.use("layer", function () {
                    layui.layer.alert(res.msg)
                })
            }

        }
    });
};

var alarm_alter = function (obj, _index) {
    /**
     * @param {object} obj 报警list
     * @param {number} _index 当前list下标
     * **/
    var data = obj.obj.list;
    layui.use(["layer"], function () {
        layer.closeAll();
//         layer.confirm("", {
//             btn: ["上一个", "点击查看", "下一个"],
//             offset: "rb",
//             shade: false,
//             skin: "confirm_style",
//             title: "警报  <span class='layui-badge layui-bg-badge'>" + data.length + "</span>  <span style='color:white;font-size:12px'>(点击查看消除警报)</span>",
//             area: ["400px", "250px"],
//             content: "<span style='font-size:20px;color:red'>" + (data[_index].faultCode == 100 ? "按钮报警" : data[_index].faultCode == 9000 ? "平层困人" : data[_index].faultCode == 6904 ? "轿厢报警按钮动作" : data[_index].faultCode == 6903 ? "阻挡关门" : data[_index].faultCode == 6902 ? "反复开关门" : data[_index].faultCode == 6901 ? "运行超时" : data[_index].faultCode == 6900 ? "安全回路断路" : data[_index].faultCode == 6600 ? "断电 " : data[_index].faultCode == 6500 ? "轿厢意外移动 " : data[_index].faultCode == 6400 ? "超速  " : data[_index].faultCode == 6300 ? "蹲底  " : data[_index].faultCode == 6200 ? "冲顶  " : data[_index].faultCode == 6100 ? "运行中开门  " : data[_index].faultCode == 6000 ? "开锁区外停梯  " : "错误") + "！</span><br/>时间：" + data[_index].alarmTime + "<br/>地点:" + data[_index].addrDesc,
//             yes: function () {
//                 if (_index - 1 >= 0) {
//                     alarm_alter(obj, _index - 1)
//                 }
//                 return false;
//             },
//             btn2: function () {
//                 // console.log(window.location.pathname);
//                 console.log(window.frames['content_iframe'].window.location.replace("contingency.html?into_type=true&accidentId=" + data[_index].id));
//                 // if(window.location.pathname == "/appServer/contingency.html"){
// // 				if(window.location.pathname == "/yunanda_01/yunanda_develop/contingency.html"){
// // 					window.location.replace("contingency.html?into_type=true&accidentId="+data[_index].id)
// // 				}else{
// // 					window.parent.location.replace("../contingency.html?into_type=true&accidentId="+data[_index].id)
// // 				}
//
//             },
//             btn3: function () {
//                 if (_index + 1 < data.length) {
//                     alarm_alter(obj, _index + 1)
//                 }
//                 return false;
//             },
//         })
        layer.open({
            type: 2,
            title: "报警  <span class='layui-badge layui-bg-badge'>" + data.length + "</span>  <span style='color:white;font-size:12px'>(点击查看消除警报)</span>",
            shade: false,
            offset: "rb",
            area: ["400px", "250px"],
            skin: "confirm_style",
            content: ["alarmAlert.html?faultCode=" + data[_index].faultCode + "&alarmTime=" + data[_index].alarmTime + "&addrDesc=" + encodeURIComponent(data[_index].addrDesc), 'no'],
            btn: ["上一个", "查看", "下一个"],
            yes: function () {
                if (_index - 1 >= 0) {
                    alarm_alter(obj, _index - 1)
                }
                return false;
            },
            btn2: function () {
                console.log(window.frames['content_iframe'].window.location.replace("contingency.html?into_type=true&accidentId=" + data[_index].id));


            },
            btn3: function () {
                if (_index + 1 < data.length) {
                    alarm_alter(obj, _index + 1)
                }
                return false;
            },
        })

    })
}

function asynchronous_render(render) {
    render();
}

function city_name() {
    console.log(city_list_kyes)
}

//开启监控推流
function startvideo(elevCode) {
    var ocx = document.getElementById("Hik");
    var StreamSvrAddr = "120.27.141.66";
    var StreamSvrPort = 9300;
    var RegSvrAddr = "120.27.141.66";
    var RegSvrPort = 9200;
    var DeviceID = elevCode;
    // var DeviceID = "yunanda";
    var StreamType = 0;
    var StreamClass = 0;

    return ocx.StartVideo(StreamSvrAddr, StreamSvrPort, RegSvrAddr,
        RegSvrPort, DeviceID, 1, StreamType, StreamClass);
};

//关闭监控推流
function stopvideo() {
    var ocx = document.getElementById("Hik");
    return ocx.StopVideo();
};

function starttalk(elevCode) {

    var ocx = document.getElementById("Hik");
    var StreamSvrAddr = "120.27.141.66";
    var StreamSvrPort = 9300;
    var RegSvrAddr = "120.27.141.66";
    var RegSvrPort = 9200;
    var DeviceID = elevCode;
    // var DeviceID = "yunanda";
    var StreamType = 0;
    var StreamClass = 1;
    return ocx.StartTalk(StreamSvrAddr, StreamSvrPort, RegSvrAddr, RegSvrPort, DeviceID, 1, StreamType, StreamClass);
}

function stoptalk() {

    var ocx = document.getElementById("Hik");
    return ocx.StopTalk();
}


//开始录像监控视频
function startRec() {
    var ocx = document.getElementById("Hik");
    return ocx.StartRecord()
}

//关闭录像监控视频
function stopRec() {
    var ocx = document.getElementById("Hik");
    return ocx.StopRecord()
}


//页面退出关闭监控 语音推流
function closeMontior() {
    var ocx = document.getElementById("Hik");
    if (ocx.hasOwnProperty("StopVideo")) {
        stoptalk();
        stopvideo();
        stopRec();
    }
}

//监控截屏
function Snap_Shot() {
    var ocx = document.getElementById("Hik");
    return ocx.SnapShot()
};

//解决IE浏览器不支持find()方法的问题
if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
        value: function (predicate) {
            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            var o = Object(this);

            var len = o.length >>> 0;

            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }

            var thisArg = arguments[1];

            var k = 0;

            while (k < len) {
                var kValue = o[k];
                if (predicate.call(thisArg, kValue, k, o)) {
                    return kValue;
                }
                k++;
            }

            return undefined;
        }
    });
}

if (getQueryVariable("navName")) {
    var second_PID = getQueryVariable_2("pid"),
        secondElem = $("cite").parent().siblings("#second"),
        index_MB = $("cite").parent().siblings("#index_MB"),
        isMenus = menus_data.find(function (obj) {
            return obj.id == second_PID;
        });

    $("cite").text(decodeURIComponent(getQueryVariable("navName")));
    secondElem.text(isMenus.text);
    secondElem.click(function () {
        var HtmlURL = isMenus.url.split("/")[1];
        window.top.frames["content_iframe"].window.location.replace(HtmlURL + "?pid=" + isMenus.id);
    });
    index_MB.click(function () {
        console.log(window.top.frames["content_iframe"].window.location.href = pathName + 'contingency.html');
    })

}
;


function ParentAddTab(optoins, param) {
    var tabs = $(".layui-tab-title li", parent.document);
    for (var j = 0; j < tabs.length; j++) {
        if (tabs[j].getAttribute("lay-id") == optoins.ID) {
            parent.layui.element.tabChange("tab", optoins.ID);
            return;
        }
        ;
    }
    ;
    var url = param ? optoins.url + param : optoins.url;


    parent.layui.element.tabAdd("tab", {
        title: optoins.title,
        content: '<iframe src="' + url + '" width="" height="80" class="main" scrolling="auto"  name="content_iframe"></iframe>',
        id: optoins.ID
    });
    parent.layui.element.tabChange("tab", optoins.ID);
}


function FormItem(type) {
    var formItem = document.createElement("div"),
        label = document.createElement('lebel'),
        layuiInputInline = document.createElement("div");
    formItem.setAttribute("class", "layui-form-item");
    label.setAttribute("class", "layui-form-label");
    switch (type) {
        case 'inline':
            layuiInputInline.setAttribute('class', "layui-input-inline");
            break;
        case 'block':
            layuiInputInline.setAttribute('class', "layui-input-block");
            break;
    }

    this.FormItem = formItem;
    this.Label = label;
    this.LayuiInputBox = layuiInputInline;

};

FormItem.prototype.addInput = function (param, label) {
    /*
    *@param {object} param 属性和属性值
    *@param {String} label lebel的文本
    *
    * */
    var _this = this;
    var button = document.createElement("button"),
        div2 = document.createElement("div");
    this.Label.innerText = label;
    div2.setAttribute("class", "layui-form-mid layui-word-aux");
    button.setAttribute("class", "layui-btn layui-btn-danger");
    button.setAttribute("type", "button");
    button.innerText = "取消";
    button.addEventListener("click", function () {
        _this.deleteBnt()
    });
    this.LayuiInputBox.style.width = "565px";
    var input = document.createElement("input");
    for (var i in param) {
        input.setAttribute(i, param[i]);
    }
    div2.appendChild(button);
    this.FormItem.appendChild(this.Label);
    this.FormItem.appendChild(this.LayuiInputBox);
    this.FormItem.appendChild(div2)
    this.LayuiInputBox.appendChild(input);
    return this.FormItem;
};

FormItem.prototype.deleteBnt = function () {
    var index = $("#extPhoneGroup").children().length;
    $("#extPhoneGroup").children()[index - 1].remove();
};


var test = new FormItem("block");



/*
*
* 海康XML数据的函数构造
* XmlDOM（）
* */
function XmlDOM(xmlStr) {
    /*
    * @param {String} xmlStr xml字符串数据
    * */
    this.DOM = $.parseXML(xmlStr);
};

XmlDOM.prototype.getDomValue = function (node) {
    /*
    * @param {String} node xml的节点名称
    * */
    var node =this.DOM.getElementsByTagName(node)[0].childNodes;
    if(node.length == 0){
        return "无数据";
    }else{
        return node[0].nodeValue;
    }
};

XmlDOM.prototype.addDom = function (Str) {
    /*
    * @param {String} Str 需要添加的xml字符串数据
    * */
    var xml =  $.parseXML(Str),Res = xml.getElementsByTagName("Result")[0];
    Res.parentNode.removeChild(Res);
    var messageList = xml.getElementsByTagName("Message")[0].childNodes;
    for(var j=0;j<messageList.length;j++){
        var addItem = messageList[j].cloneNode(true);
        this.DOM.getElementsByTagName("Message")[0].appendChild(addItem)
    };
};


XmlDOM.prototype.setXmlStr = function (obj,FIELD) {
    console.log(obj);

    this.DOM.getElementsByTagName("Cmd")[0].childNodes[0].nodeValue = FIELD;
    this.DOM.getElementsByTagName("Len")[0].childNodes[0].nodeValue = "0000";
    this.DOM.getElementsByTagName("Seq")[0].childNodes[0].nodeValue = "1000";
    var message = this.DOM.getElementsByTagName("Message")[0];
    while(message.hasChildNodes()) //当elem下还存在子节点时 循环继续
    {
        message.removeChild(message.firstChild);
    }
    for(var i in obj){
        var newNode = this.DOM.createElement(i),newNodeText = this.DOM.createTextNode(obj[i]=="无数据"?'':obj[i]);
        newNode.appendChild(newNodeText);
        // xmlDOM.DOM.getElementsByTagName(i)[0].childNodes[0].nodeValue = obj.field[i];
        this.DOM.getElementsByTagName("Message")[0].appendChild(newNode);


    };

    var xmlStr = "<?xml version='1.0'?>"+(new XMLSerializer()).serializeToString(this.DOM);
    xmlStr = xmlStr.replace("<Len>0000</Len>", "<Len>" + padLeft(xmlStr.length, 4) + "</Len>");

    function padLeft(num, n) {
        var len = num.toString().length;
        while (len < n) {
            num = "0" + num;
            len++;
        }
        return num;
    };
    return xmlStr;
};


/*
*
* 基于Date对象重新封装时间对象
*
* */
class Time{
    constructor(){
        this.Date = new Date();
        this.day = this.Date.getDate();
        this.month = this.Date.getMonth()+1;
        this.year = this.Date.getFullYear();
    };
    //获取字符串时间
    getStrTime(Symbol){
        /*@param {string} Symbol 时间划分字符*/
        return this.year+Symbol+this.month+Symbol+this.day;
    };


    //获取当前时间的之前的几个月的时间
    getBeforeMonth(num,Symbol){
        /*
        *@param {number} num 月数时间
        *@param {string} Symbol 时间划分字符
        * */
        var year = this.year,month = this.month;
        var gapYear = Math.floor((month-1-num)/12);
        year = year + gapYear;
        var gapMonth =num%12;
        if(month > gapMonth){
            month = month-gapMonth;
        }else{
            month =12+month-gapMonth;
        };
        return year+Symbol+month+Symbol+this.day;
    };
}

