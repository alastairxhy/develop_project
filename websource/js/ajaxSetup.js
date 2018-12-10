var request_url = 'http://admincs.yunandawulian.com/appServer/webApi/rpv1';
 	var request_url_json = 'http://admincs.yunandawulian.com/appServer/webApi/rbv1',
 	xhrFields = {withCredentials:true},
 	project_path = window.document.location.host;

$.ajaxSetup({
	url:"http://admincs.yunandawulian.com/appServer/appServer/webApi/rpv1",
	type:"post",
	dataType:"json",
	xhrFields:xhrFields,
	complete:function(XMLHttpRequest, textStatus, xhr) {
		var oauthstatus = XMLHttpRequest.getResponseHeader("oauthstatus");
		if(oauthstatus == '401'){
			self.location.href="../../login2.html";
		}
		
	}
})