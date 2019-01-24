var lng = $("#lng"),
	lat = $("#lat");
var new_map = new BMap.Map("map"); // 创建地图实例  
function G(id) {
	return document.getElementById(id);
}

  

new_map.addControl(new BMap.NavigationControl());
new_map.addControl(new BMap.ScaleControl({
	anchor: BMAP_ANCHOR_TOP_LEFT
}));
var geoc = new BMap.Geocoder();

function myFun(result) { //获取初始定位
	var cityName = result.name;
	new_map.setCenter(cityName);
	new_map.centerAndZoom(result.center, 16);
	new_map.addOverlay(new BMap.Marker(result.center));
//	$("#suggestId").val(result.name)//设置初始地点
	lng.val(result.center.lng);//设置初始经度
	lat.val(result.center.lat);//设置初始纬度
};


var myCity = new BMap.LocalCity();
myCity.get(myFun);

var ac = new BMap.Autocomplete( //建立一个自动完成的对象
	{
		"input": "suggestId",
		"location": new_map
	});

ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
	var str = "";
	var _value = e.fromitem.value;
	var value = "";
	if(e.fromitem.index > -1) {
		value = _value.province + _value.city + _value.district + _value.street + _value.business;
	}
	str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

	value = "";
	if(e.toitem.index > -1) {
		_value = e.toitem.value;
		value = _value.province + _value.city + _value.district + _value.street + _value.business;
	}
	str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
	G("searchResultPanel").innerHTML = str;
});

var myValue;
ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
	var _value = e.item.value;
	myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
	G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

	setPlace();
});

function setPlace() {
	new_map.clearOverlays(); //清除地图上所有覆盖物
	function myFun() {
		var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
		new_map.centerAndZoom(pp, 17);
		new_map.addOverlay(new BMap.Marker(pp)); //添加标注
	}
	var local = new BMap.LocalSearch(new_map, { //智能搜索
		onSearchComplete: myFun
	});
	local.search(myValue);
};

$("#suggestId").blur(function() {
	if($('#suggestId').val() == '') {
		layer.alert('请填写单位地址');
	}
	var adds = $('#suggestId').val();
	getPoint(adds);
});

function getPoint(adds) {
	// 创建地址解析器实例
	var myGeo = new BMap.Geocoder();
	// 将地址解析结果显示在地图上,并调整地图视野
	myGeo.getPoint(adds, function(point) {
		$('#shopcoord').val(JSON.stringify(point));
		console.log(point)
	});
};

new_map.addEventListener("click", function(e) {
	//通过点击百度地图，可以获取到对应的坐标     
	var pt = e.point;
	lng.val(pt.lng);
	lat.val(pt.lat);

	geoc.getLocation(pt, function(rs) {
		var addComp = rs.addressComponents;
		//          var site = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
		//将对应的HTML元素设置值
		console.log(pt);
		new_map.centerAndZoom(pt, 17);
		var all_overlay = new_map.getOverlays();
		for(var j = 0; j < all_overlay.length; j++) {
			new_map.removeOverlay(all_overlay[j])
		}
		new_map.addOverlay(new BMap.Marker(pt));
	});

});