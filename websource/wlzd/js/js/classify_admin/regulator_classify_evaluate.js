layui.use(["layer", "form", "element"], function() {
	var layer = layui.layer,
		form = layui.form,
		element = layui.element,
		 tbSeEvalDeviceId = getQueryVariable("tbSeEvalDeviceId");

	var evaluate_item = new Vue({
		el: "#evaluate_form",
		data: {
			deviceInfo:[],
			vetoed:[],
			evaluate_section2_data: [ ],
			score_results_item:{},
			score_results:null,
			veto_item:[],
			show_item:true,
		},
		beforeCreate:function(){
			var _this = this;
			layer.load();
			$.ajax({
				type:"post",
				url:request_url,
				data:{
					methodName:"evalDeviceDetail",
					tbSeEvalDeviceId:tbSeEvalDeviceId
				},
				dataType:"json",
				success:function(res){
					if(res.success){
						layer.closeAll('loading');
						_this.$set(_this.$data,"evaluate_section2_data",res.obj.item);
						_this.$set(_this.$data,"vetoed",res.obj.vetoed);
						_this.$set(_this.$data,"deviceInfo",res.obj.deviceInfo);
                        if(res.obj.score){
                            for(var j=0;j<res.obj.score.length;j++){
                                _this.$set(_this.$data.score_results_item,res.obj.score[j].code,res.obj.score[j].score);
                            }

                        }
					}else{
						layer.closeAll('loading');
						layer.alert(res.msg)
					}
					
				},
				error:function(){
					layer.closeAll("loading");
					alert_warning();
				}
			});
		},
		created: function() {
			//计算每个模块的总分值
			var evaluate_section2_data = this.evaluate_section2_data;
			for(var j =0; j<evaluate_section2_data.length ; j++){
				for(var i = 0; i<evaluate_section2_data[j].evaluate_item.length ; i++){
					evaluate_section2_data[j].total_score += evaluate_section2_data[j].evaluate_item[i].mark
				}
			}
		},
		mounted: function() {

		},
		updated:function(){
			var _this = this,results=0;
			
			//计算总扣分结果
			for (var j=0; j<leng(this.score_results_item); j++) {
				var kyes = Object.keys(this.score_results_item);
				results +=Number(this.score_results_item[kyes[j]]);
			};
			this.$set(this.$data,"score_results",results);//设置得分结果
			
			form.render();
			
		}
	});
	
	form.on("radio(test)",function(obj){//否决项里面有是就则隐藏评分内容
		var code = obj.elem.getAttribute("name");
		evaluate_item.$set(evaluate_item.$data.veto_item,code,obj.value);
		evaluate_item.$forceUpdate();
		var  veto_item_keys = Object.keys(evaluate_item.veto_item);
		
		for(var j=0; j<leng(evaluate_item.veto_item); j++){
			if(evaluate_item.veto_item[veto_item_keys[j]] == 1){
				evaluate_item.$set(evaluate_item,"show_item",false);
				break;
			};
			evaluate_item.$set(evaluate_item,"show_item",true);
		}


	})
	
	form.on("submit(classify_evaluate_submit)",function(data){
		var data2 = evaluate_item.$data,keys = Object.keys(data2.score_results_item);
		var tbSeEvalClassifyId = getCookie("tbSeEvalClassifyId");
		var request_data = {
			'methodName':'evalDeviceUpdate',
			'tbSeEvalDeviceId':tbSeEvalDeviceId,
			'evalType':1,
			'scores':[]
		};
		//从新排序数据结构
		if(data2.show_item){
			for(var j=0; j<keys.length; j++){
				request_data.scores.push({'code':keys[j],'score':data2.score_results_item[keys[j]],'question':data.field[keys[j]+'_question']})
			}
		}else{
			for(var j=0; j<data2.vetoed.length; j++){
				request_data.scores.push({'code':data2.vetoed[j].code,'score':data.field[data2.vetoed[j].code],'question':data.field[data2.vetoed[j].code+'_question']})
			}
		}
		
		layer.load();
		$.ajax({
			type:"post",
			url:request_url_json,
			data:JSON.stringify(request_data),
			dataType:'json',
			contentType:'application/json',
			success:function(res){
				layer.closeAll("loading");
				if(res.success){

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
							if(res.success){
								window.location.replace("regulator_evaluation_results.html");
							}else{
								layer.alert(res.msg,function(){
									if(res.msg == "尚有未抽查设备,请返回继续抽查"){
										window.location.replace("regulator_equipment_sampling.html")
									};
									return ;
								});
							}
							
						}
					});
				}else{
					layer.alert(res.msg)
				}
			},
			error:function(){
				layer.closeAll("loading");
				alert_warning();
			}
		});
		
		return false;
	})
	

})


