var develop = {
    debug: true,
    menus_level:3
};
var request_url, request_url_json;


if (develop.debug) {
    request_url = 'http://admincs.yunandawulian.com/appServer/webApi/rpv1';
    request_url_json = 'http://admincs.yunandawulian.com/appServer/webApi/rbv1';
} else {
    request_url = 'http://admin.yunandawulian.com/webApi/rpv1';
    request_url_json = 'http://admin.yunandawulian.com/webApi/rbv1';
}
;

$.ajaxSetup({
    url: request_url,
    type: "post",
    dataType: "json",
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