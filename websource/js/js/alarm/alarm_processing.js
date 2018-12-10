layui.use(["layer", "laydate", "form"], function () {
    var layer = layui.layer, laydate = layui.laydate, form = layui.form;
    $("#actual").hide();
    var call_the_police_info = new Vue({
        el: "#call_the_police_info",
        data: {
            call_the_police_data: [],
            actual_person: []
        },
        created: function () {

        },
        mounted: function () {

        },
        methods: {},
        beforeCreate: function () {

        }
    });

    var step = new Vue({
        el: "#step",
        data: {
            step_data: {space: 1200, active: 0}
        },
        methods: {}
    });
    step.$watch("step_data.active", function (newVal, oldVal) {
        console.log($("#secRecCorp").val() != alarm_processing_form.$data.elevInfo.serviceCorp)
        if ($("#secRecCorp").val() != alarm_processing_form.$data.elevInfo.serviceCorp) {
            if ($("#secRecCorp").val()) {
                $("#actual").show();
                get_actual_person($("#secRecCorp").val())
            }
        }
    });
    var alarm_processing_form = new Vue({
        el: "#alarm_processing_form",
        data: {
            key: '',
            accidentInfo: [],
            solo_input: [
                {lable: "使用单位名称", type: "text", name: "useCorp", id_name: "", placeholder: "请输入使用单位名称", verify: "required", autocomplete: "off", filter: "next", _value: '', field: 'useCorp'},
                {lable: "使用单位安管员", type: "text", name: "useAdmin", id_name: "", placeholder: "请输入使用单位安管员", verify: "required", autocomplete: "off", filter: "next", _value: '', field: 'useAdmin'},
                {lable: "安管员电话号码", type: "text", name: "useAdminPhone", id_name: "", placeholder: "请输入安管员电话号码", verify: "required", autocomplete: "off", filter: "next", _value: '', field: 'useAdminPhone'},
                {lable: "维保单位的名称", type: "text", name: "serviceCorp", id_name: "", placeholder: "请输入维保单位的名称", verify: "required", autocomplete: "off", filter: "next", _value: '', field: 'serviceCorp'},
                {lable: "维保人员", type: "text", name: "serviceAdmin", id_name: "", placeholder: "请输入维保人员", verify: "required", autocomplete: "off", filter: "next", _value: '', field: 'serviceAdmin'},
                {lable: "维保人员电话号码 ", type: "text", name: "serviceAdminPhone", id_name: "", placeholder: "请输入维保人员电话号码", verify: "required", autocomplete: "off", filter: "next", _value: '', field: 'serviceAdminPhone'},
            ],
            lay_verify: 'required',
            quickCode: null,
            elevInfo: {},
            province: [],
            city: [],
            disable_input: false,
            faultCode:getQueryVariable_2("faultCode").faultCode,
            is_alarm:getQueryVariable_2("isAlarm").isAlarm
        },
        created: function () {

        },
        computed: {},
        mounted: function () {
            var _this = this;

            this.is_empty_obj()
            form.render()
        },
        beforeCreate: function () {

        },
        methods: {
            is_empty_obj: function (obj) {
                return $.isEmptyObject(obj)
            },
            step_status: function () {
                var statu = step.$data.step_data.active;
                return statu;
            }
        },
        updated: function () {
            form.render()
        },
        directives: {
            "lay-verify": {}
        }
    });

    laydate.render({
        elem: "#tel_date",
        type: "datetime",
        done: function () {
            step.$set(step.$data.step_data, 'active', 2)
        }
    });

    laydate.render({
        elem: "#arrive_date",
        type: "datetime",
        done: function () {
            step.$set(step.$data.step_data, 'active', 4)
        }
    });
    laydate.render({
        elem: "#finish_tiem",
        type: "datetime",
        done: function () {
            step.$set(step.$data.step_data, 'active', 5)
        }
    });
    laydate.render({
        elem: "#alarm_tiem",
        type: "datetime",
        done: function () {
            step.$set(step.$data.step_data, 'active', 1)
        }
    });


    var accidentId_parent = getQueryVariable_2("accidentId").accidentId,
        accidentId_iframe = getQueryVariable("accidentId");
    var accidentId = accidentId_parent ? accidentId_parent : accidentId_iframe,
        pageType = accidentId ? 'editPage' : 'addPage';
    if (pageType == 'editPage') {
        initial_data(accidentId, 'alarm')
    }
    ;

    $("#quickCode_sreach").click(function () {
        var quickCode = $("#quickCode").val();
        initial_data(quickCode, 'sreach')
    })

    function initial_data(request_data, request_type) {
        $.ajax({
            data: {
                methodName: "accidentDetail",
                pageType: pageType,
                opId: request_data
            },
            success: function (res) {
                if (res.success) {
                    if (request_type == 'alarm') {
                        var procUnitID = res.obj.accidentInfo.procUnitID;
                        var step_num = procUnitID == 0 ? 0 : procUnitID == 10 ? 1 : procUnitID == 20 ? 2 : procUnitID == 30 ? 3 : 5;
                        alarm_processing_form.$set(alarm_processing_form.$data, "accidentInfo", res.obj.accidentInfo);
                        step.$set(step.step_data, "active", step_num);
                        alarm_processing_form.$set(alarm_processing_form.$data, "disable_input", step_num == 5 ? true : false)
                    }

                    var solo_input = alarm_processing_form.$data.solo_input;
                    for (var j = 0; j < solo_input.length; j++) {
                        alarm_processing_form.$set(solo_input[j], "_value", res.obj.elevInfo[solo_input[j].field]);
                    }
                    // $("#secRecCorp").empty();
                    for (var j = 0; j < res.obj.rescueList.length; j++) {
                        $("#secRecCorp").append("<option value='" + res.obj.rescueList[j].rescueId + "'>" + res.obj.rescueList[j].corpName + "</option>")
                    }
                    alarm_processing_form.$set(alarm_processing_form.$data, "elevInfo", res.obj.elevInfo)

                    call_the_police_info.$set(call_the_police_info.$data, "call_the_police_data", res.obj.rescueList)
                    alarm_processing_form.$forceUpdate()
                } else {
                    layer.alert(res.msg)
                }
            },
            error: function (res) {
                alert_warning()
            }
        });
    };

    form.on("select(secRecCorp)", function (obj) {

        if (obj.value == alarm_processing_form.$data.elevInfo.serviceCorp) {
            alarm_processing_form.$set(alarm_processing_form.$data.accidentInfo, "secRecPerson", alarm_processing_form.$data.elevInfo.serviceAdmin);
            alarm_processing_form.$set(alarm_processing_form.$data.accidentInfo, "secRecPhone", alarm_processing_form.$data.elevInfo.serviceAdminPhone);
            $("#actual").hide();
        } else {
            var copmany_list = call_the_police_info.$data.call_the_police_data;
            copmany_list.find(function (obj_2) {
                if (obj_2.rescueId == obj.value) {
                    $("#secRecPhone").val(obj_2.rescuePhone);
                    $("#secRecPerson").val(obj_2.rescuePerson);
                }
                ;
            });
            if (step.$data.step_data.active > 2) {
                $("#actual").show();
                if (obj.value) {
                    get_actual_person(obj.value);
                }

            }
        }


    });

    form.on("select(specialAccident)", function (obj) {
        var form_itme = $("#alarm_processing_form").find("input,select,textarea");
        if (obj.value == 0) {
            for (var j = 0; j < form_itme.length; j++) {
                form_itme[j].removeAttribute("lay-verify")
            }
        } else {
            for (var j = 0; j < form_itme.length; j++) {
                form_itme[j].setAttribute("lay-verify", "required")
            }
        }
    });
    form.on("select(operationMode)", function (obj) {
        if (obj.value == 1) {
            $("#alarmPerson").val(getCookie("name"))
        }
    })

    form.on("submit(alarm_processing_form)", function (data) {
        var request_data = {
            methodName: "updateAccidentDetail",
            accidentInfo: data.field
        };
        $.extend(request_data.accidentInfo, {"accidentId": accidentId});
        $.extend(request_data.accidentInfo, {"procUnitID": "99"});
        $.ajax({
            url: request_url_json,
            contentType: "application/json",
            data: JSON.stringify(request_data),
            success: function (res) {
                if (res.success) {
                    window.location.replace("alarm_account.html")
                } else {
                    layer.alert(res.msg)
                }
            }
        })
        return false;
    })

    set_city_select("#district", "district", "请选择市/区/县", "330700");

    form.on("select(district)", function (obj) {
        set_city_select("#street", "street", "请选择街道", obj.value);
    })

    $("#update_processing_form").click(function () {
        var processing_form_data = $("#alarm_processing_form").serializeArray(),
            request_data = {
                methodName: "updateAccidentDetail",
                accidentInfo: {}
            };
        for (var j = 0; j < processing_form_data.length; j++) {
            request_data.accidentInfo[processing_form_data[j].name] = processing_form_data[j].value
        }
        ;

        $.extend(request_data.accidentInfo, {"accidentId": accidentId});
        $.extend(request_data.accidentInfo, {"procUnitID": ""});
        console.log(request_data)
        $.ajax({
            url: request_url_json,
            contentType: "application/json",
            data: JSON.stringify(request_data),
            success: function (res) {
                if (res.success) {
                    window.location.replace("alarm_account.html")
                } else {
                    layer.alert(res.msg)
                }
            }
        })

    })

    function get_actual_person(id) {
        $.ajax({
            data: {
                methodName: "viewRescueForceById",
                tbRescueForceId: id
            },
            success: function (res) {
                if (res.success) {
                    var staffs = res.obj.staffs;
                    $("#actual_person").empty();
                    $("#actual_person").append("<option >请选择实际救援人员</option>")
                    for (var j = 0; j < staffs.length; j++) {
                        $("#actual_person").append("<option value='" + staffs[j].staffId + "'>" + staffs[j].staffName + "</option>")
                    }
                    call_the_police_info.$set(call_the_police_info.$data, "actual_person", staffs);
                } else {
                    layer.alert(res.msg);
                    $("#actual").hide();
                }

                form.render()
            }
        });

    };

    form.on("select(actual_person)", function (obj) {
        var staffs = call_the_police_info.$data.actual_person;
        console.log(staffs)
        var staffs_item = staffs.find(function (obj_2) {
            return obj_2.staffId == obj.value
        });
        $("#actual_person_p").val(staffs_item.staffPhone);
        form.render()
    })


    var video_statu = 0;
    $("#startvideo").click(function () {
        var elevCode = alarm_processing_form.$data.elevInfo.elevCode;
        if (elevCode) {
            if (video_statu == 0) {
                var start_sta = startvideo(elevCode);
                if (start_sta == 1) {
                    video_statu = 1;
                    $("#startvideo").css("background", "url('../websource/img/video/stop.png')")
                } else {
                    layer.alert("开启失败");
                }
            } else {
                var stop_sta = stopvideo();
                if (stop_sta == 1) {
                    video_statu = 0;
                    $("#startvideo").css("background", "url('../websource/img/video/play.png')")
                } else {
                    layer.alert("关闭失败");
                }
            }
        } else {
            layer.alert("未获取到电梯信息！<br> 请在左侧查询电梯")
        }
    });

    var talk_statu = 0;
    $("#Microphone").click(function () {
        var elevCode = alarm_processing_form.$data.elevInfo.elevCode;
        if (elevCode) {
            if (talk_statu == 0) {
                var start_sta = starttalk(elevCode);
                if (start_sta == 1) {
                    talk_statu = 1;
                    $("#Microphone").css("background", "url('../websource/img/video/talk_1.png')")
                } else {
                    layer.alert("开启失败");
                }
            } else {
                var stop_sta = stoptalk();
                if (stop_sta == 1) {
                    talk_statu = 0;
                    $("#Microphone").css("background", "url('../websource/img/video/talk.png')")
                } else {
                    layer.alert("关闭失败");
                }
            }
        } else {
            layer.alert("未获取到电梯信息！<br> 请在左侧查询电梯")
        }
    });

    var rec_statu = 0;
    $("#Rec").click(function () {
        if (video_statu == 1) {
            if (rec_statu == 0) {
                var rec_sta = startRec();
                if (rec_sta == 1) {
                    rec_statu = 1;
                    $("#Rec").css("background", "url('../websource/img/video/rec_1.png')")
                } else {
                    layer.alert("开启失败");
                }
            } else {
                var rec_sta = stopRec();
                if (rec_sta == 0) {
                    rec_statu = 0;
                    $("#Rec").css("background", "url('../websource/img/video/rec.png')")
                } else {
                    layer.alert("关闭失败");
                }
            }
        } else {
            layer.alert("请先开始监控视频！");
        }
    });

    $("#message").click(function () {
        var elevCode = alarm_processing_form.$data.elevInfo.elevCode;
        if (accidentId) {
            layer.confirm('你确定发送短信？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                $.ajax({
                    data: {
                        methodName: "sendMsg",
                        accidentId: accidentId
                    },
                    success: function (res) {
                        if (res.success) {
                            layer.alert("发送成功")
                        } else {
                            layer.alert(res.msg)
                        }
                    }
                })
            });
        } else {
            layer.alert("订单号不能为空！")
        }
        ;

    });

    $("#screenshot").click(function () {
        if (video_statu == 1) {
            var SnapShot_sta = Snap_Shot();
            if (SnapShot_sta == 1) {
                layer.alert("截图成功！")
            } else {
                layer.alert("截图失败！")
            }
        } else {
            layer.alert("请先开始监控视频！");
        }

    });

});


function elev_dateil() {
    var elev_code = $("#elevCode").val();
    layer.open({
        type: 2,
        title: "电梯详细信息",
        area: ["1000px", "600px"],
        content: "elev_detail.html?elevCode=" + elev_code
    })
}