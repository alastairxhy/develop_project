layui.use(["layer","form","element",'laydate'],function(){
	var layer = layui.layer,form = layui.form,element = layui.element,laydate=layui.laydate;
	var autograph = $("#autograph");
	var autograph_2 = $("#autograph_2");
	var tbSeEvalClassifyId = getQueryVariable("tbSeEvalClassifyId")?getQueryVariable("tbSeEvalClassifyId"):getCookie("tbSeEvalClassifyId");
	console.log(getQueryVariable("tbSeEvalClassifyId"))
	var evaluation_results = new Vue({
		el:"#evaluation_results",
		data:{
			corpInfo:[],
			safety_evaluation:[
				{porject:"否决项",score:null,essence_score:null,question:null},
				{porject:"管理机构",score:null,essence_score:null,question:null},
				{porject:"管理人员",score:null,essence_score:null,question:null},
				{porject:"作业人员",score:null,essence_score:null,question:null},
				{porject:"技术档案",score:null,essence_score:null,question:null},
				{porject:"管理制度",score:null,essence_score:null,question:null},
				{porject:"应急管理",score:null,essence_score:null,question:null},
			],
			risk:[
				{
					title:'高风险特种设备使用安全管理分种类评价汇总表',
					risk_item:[
						{classify:"锅炉",num:null,score:null,average:null,risk_senior_average:80},
						{classify:"压力容器",num:null,score:null,average:null},
						{classify:"压力管道",num:null,score:null,average:null},
						{classify:"电梯",num:null,score:null,average:null},
						{classify:"起重机械",num:null,score:null,average:null},
						{classify:"客运索道",num:null,score:null,average:null},
						{classify:"大型游乐设施",num:null,score:null,average:null},
						{classify:"场（厂）内专用机动车辆",num:null,score:null,average:null},
						{classify:"充装单位",num:null,score:null,average:null}
					],
				},
				{
					title:'中风险特种设备使用安全管理分种类评价汇总表',
					risk_item:[
						{id:1,classify:"锅炉",num:null,score:null,average:null,risk_senior_average:80},
						{id:1,classify:"压力容器",num:null,score:null,average:null},
						{id:1,classify:"压力管道",num:null,score:null,average:null},
						{id:1,classify:"电梯",num:null,score:null,average:null},
						{id:1,classify:"起重机械",num:null,score:null,average:null},
						{id:1,classify:"客运索道",num:null,score:null,average:null},
						{id:1,classify:"大型游乐设施",num:null,score:null,average:null},
						{id:1,classify:"场（厂）内专用机动车辆",num:null,score:null,average:null},
						{id:1,classify:"充装单位",num:null,score:null,average:null}
					],
				},
				{
					title:'低风险特种设备使用安全管理分种类评价汇总表',
					risk_item:[
						{id:1,classify:"锅炉",num:null,score:null,average:null,risk_senior_average:80},
						{id:1,classify:"压力容器",num:null,score:null,average:null},
						{id:1,classify:"压力管道",num:null,score:null,average:null},
						{id:1,classify:"电梯",num:null,score:null,average:null},
						{id:1,classify:"起重机械",num:null,score:null,average:null},
						{id:1,classify:"客运索道",num:null,score:null,average:null},
						{id:1,classify:"大型游乐设施",num:null,score:null,average:null},
						{id:1,classify:"场（厂）内专用机动车辆",num:null,score:null,average:null},
						{id:1,classify:"充装单位",num:null,score:null,average:null}
					],
				}
			],
			remark:'',
			vetoedUserCorp:null,
			userCorpTotalSorce:'',
			safetyLevel:'',
			totalSorce:'',
			scoreDevice:'',
			weightM:'',
			weightH:'',
			weightL:'',
			scoreM:'',
			scoreH:'',
			scoreL:'',
		},
		beforeCreate:function(){
			var _this = this;
			layer.load();
			$.ajax({
				type:"post",
				url:request_url,
				data:{
					methodName:'totalSum',
					corpId:'4',
					tbSeEvalClassifyId:tbSeEvalClassifyId

				},
				dataType:"json",
				success:function(res){
					layer.closeAll("loading")
					if(res.success){
						
					
					_this.$set(_this.$data,"corpInfo",res.obj.corpInfo);
					_this.$set(_this.$data,"remark",res.obj.remark);
					_this.$set(_this.$data,"safety_evaluation",res.obj.userCorpSorceLists);
					_this.$set(_this.$data,"vetoedUserCorp",res.obj.vetoedUserCorp);
					_this.$set(_this.$data,"userCorpTotalSorce",res.obj.userCorpTotalSorce);
					_this.$set(_this.$data,"safetyLevel",res.obj.safetyLevel);
					_this.$set(_this.$data,"totalSorce",res.obj.totalSorce);
					_this.$set(_this.$data,"scoreDevice",res.obj.scoreDevice);
					_this.$set(_this.$data,"weightL",res.obj.weightL);
					_this.$set(_this.$data,"weightH",res.obj.weightH);
					_this.$set(_this.$data,"weightM",res.obj.weightM);
					_this.$set(_this.$data,"scoreM",res.obj.scoreM);
					_this.$set(_this.$data,"scoreL",res.obj.scoreL);
					_this.$set(_this.$data,"scoreH",res.obj.scoreH);

					_this.$set(_this.$data.risk[0].risk_item[3],"score",res.obj.deviceList.elev.listH);
					_this.$set(_this.$data.risk[1].risk_item[3],"score",res.obj.deviceList.elev.listM);
					_this.$set(_this.$data.risk[2].risk_item[3],"score",res.obj.deviceList.elev.listL);
					_this.$set(_this.$data.risk[2].risk_item[3],"num",res.obj.deviceList.elev.listL.length);
					_this.$set(_this.$data.risk[0].risk_item[3],"num",res.obj.deviceList.elev.listH.length);
					_this.$set(_this.$data.risk[1].risk_item[3],"num",res.obj.deviceList.elev.listM.length);
					
					_this.$set(_this.$data.risk[0].risk_item[6],"score",res.obj.deviceList.ylss.listH);
					_this.$set(_this.$data.risk[1].risk_item[6],"score",res.obj.deviceList.ylss.listM);
					_this.$set(_this.$data.risk[2].risk_item[6],"score",res.obj.deviceList.ylss.listL);
					_this.$set(_this.$data.risk[2].risk_item[6],"num",res.obj.deviceList.ylss.listL.length);
					_this.$set(_this.$data.risk[0].risk_item[6],"num",res.obj.deviceList.ylss.listH.length);
					_this.$set(_this.$data.risk[1].risk_item[6],"num",res.obj.deviceList.ylss.listM.length);
					if(res.obj.evalUnit){
						console.log(res.obj.evalUnit)
                        $("#img_regulator").attr("src",res.obj.evalUnit)
					};
                        if(res.obj.signUrl){
                            console.log(res.obj.evalUnit)
                            $("#img_oneself").attr("src",res.obj.signUrl)
                        };
					var average = function(a){
						var b = 0;
						for(var j=0; j<a.length; j++){
							b+=a[j]
						};
						
						return Math.round(b/a.length*10)/10
						
					}
					_this.$set(_this.$data.risk[0].risk_item[0],"risk_senior_average",res.obj.scoreH);
					_this.$set(_this.$data.risk[1].risk_item[0],"risk_senior_average",res.obj.scoreM);
					_this.$set(_this.$data.risk[2].risk_item[0],"risk_senior_average",res.obj.scoreL);
					
					_this.$set(_this.$data.risk[0].risk_item[3],"average",average(res.obj.deviceList.elev.listH));
					_this.$set(_this.$data.risk[1].risk_item[3],"average",average(res.obj.deviceList.elev.listM));
					_this.$set(_this.$data.risk[2].risk_item[3],"average",average(res.obj.deviceList.elev.listL));
					}else{
						layer.alert(res.msg,function(){
							if(res.msg == "尚有未抽查设备,请返回继续抽查"){
								window.location.replace("equipment_sampling.html")
							};
							return ;
						});
						
					}
					
				},
				error:function(){
					layer.closeAll("loading");
					alert_warning()
				}
			});
			
			
			autograph.jSignature();
			autograph_2.jSignature();

			
			
			
		},
		created:function(){
			
		},
		mounted:function(){
			form.render();
		},
		methods:{
				
	
		},
		updated:function(){
			form.render()
		},
		beforeUpdate:function(){
			
		}
	});
	
	$("#autograph_box").hide();
	$("#autograph_box_2").hide();
	
	$("#autograph_regulator").click(function(e){
		
		var identity = e.currentTarget.getAttribute("my-data"),
			identity_value = e.currentTarget.getAttribute("my-setValue");

		$("#autograph_box").show();

		$("#get_base64").click(function(){
			var base64 = autograph.jSignature('getData');
			$("#autograph_box").hide();
			$("#"+identity_value).val(base64.replace(/data:image\/png\;base64,/i,""))
			$("#"+identity).attr("src",base64)
		});
		
		$("#reset").click(function(){
			autograph.jSignature('clear')
		});
	})
	
	$("#autograph_oneself").click(function(e){
		
		var identity = e.currentTarget.getAttribute("my-data"),
			identity_value = e.currentTarget.getAttribute("my-setValue");

		$("#autograph_box_2").show();

		$("#get_base64_2").click(function(){
			var base64 = autograph_2.jSignature('getData');
			$("#autograph_box_2").hide();
			$("#"+identity_value).val(base64.replace(/data:image\/png\;base64,/i,""))
			$("#"+identity).attr("src",base64)
		});
		
		$("#reset_2").click(function(){
			autograph_2.jSignature('clear')
		});
	})
	
	form.on("submit(evaluation_results_submit)",function(data){
		
		var request_data = $.extend(data.field,{'methodName':"totalSumSave",'tbSeEvalClassifyId':tbSeEvalClassifyId});
		console.log(request_data);
		layer.load();
		$.ajax({
			type:"post",
			url:request_url,
			data:request_data,
			dataType:"json",
			success:function(res){
				layer.closeAll("loading");
				if(res.success){
					setCookie("tbSeEvalClassifyId","",0);
					layer.alert("提交成功");
					window.location.replace("unit_evaluation.html")
				}else{
					
					layer.alert(res.msg)
				}
			},
			error:function(){
				layer.closeAll("loading");
				alert_warning()
			}
		});
		return false;
	})
	
	laydate.render({
				elem:"#autograph_date"
			});
	
})


