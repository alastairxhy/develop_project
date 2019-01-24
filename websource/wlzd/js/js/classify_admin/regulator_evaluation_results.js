layui.use(["layer","form","element",'laydate'],function(){
	var layer = layui.layer,form = layui.form,element = layui.element,laydate=layui.laydate;
	var autograph = $("#autograph");
	var autograph_2 = $("#autograph_2");
	
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
		},
		beforeCreate:function(){
			var _this = this;
			var tbSeEvalClassifyId = getCookie("tbSeEvalClassifyId");
			layer.load();
			$.ajax({
				type:"post",
				url:request_url,
				data:{
					methodName:'totalSum',
					corpId:'4',
					tbSeEvalClassifyId:tbSeEvalClassifyId,
				},
				dataType:"json",
				success:function(res){
					layer.closeAll("loading");
					_this.$set(_this.$data,"corpInfo",res.obj.corpInfo);
					_this.$set(_this.$data,"remark",res.obj.remark);
					_this.$set(_this.$data,"safety_evaluation",res.obj.userCorpSorceLists);
					_this.$set(_this.$data,"vetoedUserCorp",res.obj.vetoedUserCorp);
					_this.$set(_this.$data,"userCorpTotalSorce",res.obj.userCorpTotalSorce);
					_this.$set(_this.$data,"safetyLevel",res.obj.safetyLevel);
					_this.$set(_this.$data,"totalSorce",res.obj.totalSorce);
					
					_this.$set(_this.$data.risk[0].risk_item[3],"score",res.obj.listH);
					_this.$set(_this.$data.risk[1].risk_item[3],"score",res.obj.listM);
					_this.$set(_this.$data.risk[2].risk_item[3],"score",res.obj.listL);
					_this.$set(_this.$data.risk[2].risk_item[3],"num",res.obj.listL.length);
					_this.$set(_this.$data.risk[0].risk_item[3],"num",res.obj.listH.length);
					_this.$set(_this.$data.risk[1].risk_item[3],"num",res.obj.listM.length);
					//
					var average = function(a){
						var b = 0;
						for(var j=0; j<a.length; j++){
							b+=a[j]
						};
						
						return Math.round(b/a.length*10)/10
						
					}
					_this.$set(_this.$data.risk[0].risk_item[0],"risk_senior_average",average(res.obj.listH));
					_this.$set(_this.$data.risk[1].risk_item[0],"risk_senior_average",average(res.obj.listM));
					_this.$set(_this.$data.risk[2].risk_item[0],"risk_senior_average",average(res.obj.listL));
					
					_this.$set(_this.$data.risk[0].risk_item[3],"average",average(res.obj.listH));
					_this.$set(_this.$data.risk[1].risk_item[3],"average",average(res.obj.listM));
					_this.$set(_this.$data.risk[2].risk_item[3],"average",average(res.obj.listL));
					
					
				},
				error:function(){
					layer.closeAll("loading");
					alert_warning()
				}
			});
			
			laydate.render({
				elem:"#autograph_date"
			})
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
		var tbSeEvalClassifyId= getCookie("tbSeEvalClassifyId");
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
				window.location.replace("regulatory_evaluation.html")
				console.log(res);
			},
			error:function(){
				layer.closeAll("loading");
				alert_warning()
			}
		});
		return false;
	})
	
	
	
})


