layui.use(["layer", "form", "element"], function() {
	var layer = layui.layer,
		form = layui.form,
		element = layui.element;

	var evaluate_item = new Vue({
		el: "#evaluate_form",
		data: {
			evaluate_section2_show: true,
			evaluate_section2_data: [
			],
			corpInfo:[],
			score_results_item:{},
			score_results:null,
			evaluate_item2:[],
			vetoed:[],
			veto_item:[],
			index:null,
			evaluate_item:[],
            score:[],
		},
		beforeCreate:function(){
			var _this =this;
			var tbSeEvalClassifyId = getCookie('tbSeEvalClassifyId');
			layer.load();
			$.ajax({
				type:"post",     
				url:request_url,
				data:{
					methodName:'seUseCorpEvalDetailInfo',
					corpId:'4',
					tbSeEvalClassifyId:tbSeEvalClassifyId
				},
				dataType:'json',
				success:function(res){
					layer.closeAll("loading");
					_this.$set(_this.$data,"evaluate_section2_data",res.obj.item);
					_this.$set(_this.$data,'corpInfo',res.obj.corpInfo);
					_this.$set(_this.$data,'vetoed',res.obj.vetoed);
                    if(res.obj.score){
                        for(var j=0;j<res.obj.score.length;j++){
                            _this.$set(_this.$data.score_results_item,res.obj.score[j].code,res.obj.score[j].score);
                        };
					}

				},
				error:function(){
					layer.alert("服务错误！请联系管理员")
				}
			});
		},
		created: function() {
			var _this = this;
			var evaluate_section2_data = this.evaluate_section2_data;
			
			for(var j = 0; j < evaluate_section2_data.length; j++) {
				
				for(var i = 0; i < evaluate_section2_data[j].evaluate_item.length; i++) {
					
					evaluate_section2_data[j].total_score += evaluate_section2_data[j].evaluate_item[i].mark;
					
				}
			};
		},
		mounted: function() {
			var _this = this;
			var b = $(".b"),
				a = $(".a"),
				evaluate_section2_data = this.evaluate_section2_data;
				
			form.on('radio(test)', function(data) {
				var code = data.elem.getAttribute("name");
				evaluate_item.$set(evaluate_item.$data.veto_item,code,data.value);
				evaluate_item.$forceUpdate();
				
				_this.evaluate_section2_show = data.value == "1" ? false : true;
				
			});

			
			for(var j = 0; j < a.length; j++) {
				
				b[j].setAttribute("style", "height: " + (a[j].offsetHeight - 40) + "px;line-height:" + (a[j].offsetHeight - 40) + "px ;")
				
			};
					
			form.render();
			
		},
		methods: {

		},
		updated:function(){
			var _this = this,results=0;
			var evaluate_section2_data = this.evaluate_section2_data;
			
			for (var j=0; j<leng(this.score_results_item); j++) {
				var kyes = Object.keys(this.score_results_item);
				results +=Number(this.score_results_item[kyes[j]]);
			};
			this.$set(this.$data,"score_results",results);
			
			
			for(var j = 0; j < evaluate_section2_data.length; j++) {
				var a = (evaluate_section2_data[j].evaluate_item.length) * 2;
				_this.$set(_this.evaluate_section2_data[j].evaluate_item[0],"rowspan",a);			
			};
			
			var b = $(".b"), a = $(".a");
			for(var j = 0; j < a.length; j++) {
				b[j].setAttribute("style", "height: " + (a[j].offsetHeight - 40) + "px;line-height:" + (a[j].offsetHeight - 40) + "px ;")
				
			};
			
			form.render()
		},
		beforeUpdate:function(){
			
		}
		
	});
	
	form.on("submit(safety_evaluation_submit)", function(data) {
		var data2 = evaluate_item.$data,
			keys = Object.keys(data2.score_results_item),
			keys_2 = Object.keys(data2.veto_item);
		var tbSeEvalClassifyId = getCookie('tbSeEvalClassifyId');
		var request_data = {
			'methodName':'seUseCorpEvalDetailSave',
			'tbSeEvalClassifyId':tbSeEvalClassifyId,
			'evalType':1,
			'scores':[]
		};

		if(!data2.evaluate_section2_show){
			for(var j=0; j<keys_2.length; j++){
				request_data.scores.push({'code':keys_2[j],'score':data.field[keys_2[j]],'question':data.field[keys_2[j]+'_question']})
			}
		}else{
			for(var j=0; j<keys.length; j++){
				request_data.scores.push({'code':keys[j],'score':data2.score_results_item[keys[j]],'question':data.field[keys[j]+'_question']})
			}
		};
		
		console.log(request_data)
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
					if(data2.evaluate_section2_show){
						window.location.replace("equipment_sampling.html");
					}else{
						window.location.replace("evaluation_results.html");
					}
					
					
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
		
	});

	
	
	
})

