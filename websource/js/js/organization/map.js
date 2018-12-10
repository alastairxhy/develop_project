layui.use("layer", function() {
	var layer = layui.layer;

	function G(id) {
		return document.getElementById(id);
	}
	//实例化地图
	var mp = new BMap.Map("map")
	//添加组件
	mp.addControl(new BMap.NavigationControl());
	mp.addControl(new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT }));
	var geoc = new BMap.Geocoder();

	function myFun(result) {//获取初始定位
		var cityName = result.name;
		mp.setCenter(cityName);
		mp.centerAndZoom(result.center, 16);
		mp.addOverlay(new BMap.Marker(result.center))
	};
	var myCity = new BMap.LocalCity();
	myCity.get(myFun);



	var ac = new BMap.Autocomplete( //建立一个自动完成的对象
		{
			"input": "suggestId",
			"location": mp
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
		mp.clearOverlays(); //清除地图上所有覆盖物
		function myFun() {
			var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
			mp.centerAndZoom(pp, 17);
			mp.addOverlay(new BMap.Marker(pp)); //添加标注
		}
		var local = new BMap.LocalSearch(mp, { //智能搜索
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
	
	mp.addEventListener("click", function(e){   
        //通过点击百度地图，可以获取到对应的坐标     
        var pt = e.point;
        geoc.getLocation(pt, function(rs){
            var addComp = rs.addressComponents;
//          var site = addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber;
            //将对应的HTML元素设置值
            console.log(pt);
            mp.centerAndZoom(pt,17);
            var all_overlay = mp.getOverlays();
            for(var j=0; j<all_overlay.length; j++ ){
            	mp.removeOverlay(all_overlay[j])
            }
            mp.addOverlay(new BMap.Marker(pt));
        });        
    });

})