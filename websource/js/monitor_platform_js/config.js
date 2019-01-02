var develop = {
    debug: true,
    menus_level:3
};
var request_url, request_url_json;


if (develop.debug) {
    request_url = 'http://admincs.yunandawulian.com/appServer/';
    request_url_json = 'http://admincs.yunandawulian.com/appServer/';
} else {
    request_url = 'http://admin.yunandawulian.com/';
    request_url_json = 'http://admin.yunandawulian.com/';
}
;

PROJECT_PATH = {
    index:{url:'index.html',ID:1},
    Elevator_list:{url:"admission_management/Elevator_list.html",ID:10101},
    add_elevator:{url:"admission_management/add_elevator.html",ID:10102}
}

$.ajaxSetup({
    url: request_url+'webApi/rpv1',
    type: "post",
    dataType: "json",
    headers:{
        fromType:'wlzd'
    },
    xhrFields: {withCredentials: true},
    complete: function (XMLHttpRequest, textStatus, xhr) {
        var oauthstatus = XMLHttpRequest.getResponseHeader("oauthstatus");
        if (oauthstatus == '401') {
            self.location.href = "../../../login2.html";
        }

    },
});



if(!sessionStorage.getItem("menus_data")){
    sessionStorage.setItem("menus_data",JSON.stringify(getMenus("0",develop.menus_level)));
};

function getMenus(id,recurrence) {
    recurrence--;
    var getData;
    $.ajax({
        url:request_url+'webApi/rpv1',
        data:{
            methodName:'menus',
            pId:id,
            menuType:3
        },
        async:false,
        success:function (res) {
            getData = res.obj;
            getData.find(function (obj) {
                if(obj.id && recurrence > 0){
                    obj.children=getMenus(obj.id,recurrence)
                }
            });
        }
    });
    return getData;
}
var menus_data = JSON.parse(sessionStorage.getItem("menus_data"));