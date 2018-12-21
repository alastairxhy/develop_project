var develop = {
    debug: true,
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

var menus_data = {

};