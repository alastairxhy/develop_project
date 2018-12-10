layui.use(["layer","form","element"],function(){
	var layer = layui.layer, form = layui.form,element = layui.element;
	var risk_grade_form = new Vue({
		el:"#risk_grade_form",
		data:{
			risk_senior:[ ], risk_intermediate:[ ], risk_lower:[ ], corpInfo:[ ],
		},
		created:function(){
		},
		mounted:function(){
			var _this = this;
			this.layui_render();

			form.on("checkbox(risk_senior)",function(data){
				var input_checked =  $("#risk_senior_group input:checked").length,
					input_checked_lower =  $("#risk_lower_group input:checked").length,
					input_checked_intermediate =  $("#risk_intermediate_group input:checked").length;
					
				if(input_checked != 0 ){
					
					$("#risk_senior").attr("checked",true);
					$("#risk_lower").removeAttr("checked");
					$("#risk_intermediate").removeAttr("checked");
					
				}else if(input_checked == 0 && input_checked_intermediate !=0){
					
					$("#risk_senior").removeAttr("checked");
					$("#risk_intermediate").attr("checked",true);
					
				}else if(input_checked ==0 && input_checked_intermediate ==0 && input_checked_lower !=0){
					
					$("#risk_senior").removeAttr("checked");
					$("#risk_intermediate").removeAttr("checked");
					$("#risk_lower").attr("checked",true);
					
				}else{
					
					$("#risk_senior").removeAttr("checked");
					$("#risk_lower").removeAttr("checked");
					$("#risk_intermediate").removeAttr("checked");
					
				};
				
				form.render();
				
			});
			
			form.on("checkbox(risk_intermediate)",function(data){
				
				var input_checked =  $("#risk_intermediate_group input:checked").length,
					input_checked_senior =  $("#risk_senior_group input:checked").length,
					input_checked_lower =  $("#risk_lower_group input:checked").length;
					
				if(input_checked != 0 && input_checked_senior == 0){
					
					$("#risk_intermediate").attr("checked",true);
					$("#risk_lower").removeAttr("checked");
					
				}else if(input_checked ==0 && input_checked_lower != 0){
					
					$("#risk_intermediate").removeAttr("checked");
					$("#risk_lower").attr("checked",true);
					
				}else{
					
					$("#risk_lower").removeAttr("checked");
					$("#risk_intermediate").removeAttr("checked");
					
				};
				form.render()
			});
			
			form.on("checkbox(risk_lower)",function(data){
				
				var input_checked =  $("#risk_lower_group input:checked").length,
					input_checked_intermediate =  $("#risk_intermediate_group input:checked").length,
					input_checked_senior =  $("#risk_senior_group input:checked").length;
				
				if(input_checked != 0 && input_checked_intermediate == 0 && input_checked_senior == 0){
					
					$("#risk_lower").attr("checked",true);
					
				}else{
					
					$("#risk_lower").removeAttr("checked");
				}
				
				form.render();
			});
			
		
			
		},
		methods:{
			layui_render:function(){
				form.render();
			},
			click:function(e){
				console.log(this)
			}
		},
		beforeCreate:function(){
			var _this =this;
			var tbSeEvalClassifyId = getQueryVariable("tbSeEvalClassifyId");
			layer.load();
			$.ajax({
					type:"post",
					data:{
						methodName:"seUseCorpEvalInfo",
						corpId:'4',
						tbSeEvalClassifyId:tbSeEvalClassifyId
					},
					xhrFields:xhrFields,
					dataType:"json",
					success:function(res){
						if(res.success){
							layer.closeAll("loading");
							_this.$set(_this.$data,"risk_senior",res.obj.data.risk_H);
							_this.$set(_this.$data,"risk_intermediate",res.obj.data.risk_M);
							_this.$set(_this.$data,"risk_lower",res.obj.data.risk_L);
							_this.$set(_this.$data,"corpInfo",res.obj.corpInfo);
						}else{
							layer.closeAll("loading");
							layer.alert(res.msg);
						}
					},
					error:function(){
						layer.closeAll("loading");
						layer.alert("服务错误！请联系管理员");
						
					}
				});
				
				form.render();
		},
		updated:function(){
			var _this =this;
			form.render()
		}
	});

		//下一步，ajax请求
			form.on("submit(risk_garde_submit)",function(data){
				var risk_grade_form_data = risk_grade_form.$data;
				var add_data = {
					methodName:"seUseCorpEvalSave",
					corpId:"4",
					evalType:1,
					seEvalClassifyInfo:{
						riskCate:"H",
						riskCateDetail:{
							risk_H:[{"hh":true}],
							risk_M:[],
							risk_L:[]
						}
					}	
				};
				
//				for(var j=0; j<risk_grade_form_data.risk_senior.length; j++){
//					var keys = obj.keys(risk_grade_form_data.risk_senior[j]);
//					console.log(keys)
//				}
				
				
				console.log(data.field);
				layer.load();
				$.ajax({
					type:"post",
					url:request_url_json,
					data:JSON.stringify(add_data),
					dataType:"json",
					contentType:"application/json",
					success:function(res){
						if(res.success){
							layer.closeAll("loading");
							window.location.replace("safety_evaluation.html");
							setCookie('tbSeEvalClassifyId',res.obj.tbSeEvalClassifyId,2);//保存返回的tbSeEvalClassifyId字段
						}else{
							layer.closeAll("loading");
							layer.alert(res.msg)
						}
					},
					error:function(){
						layer.closeAll("loading");
						layer.alert("服务错误！请联系管理员")
					}
				});
				return false;
			});
	
	
})




