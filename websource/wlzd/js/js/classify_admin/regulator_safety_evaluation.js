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
			evaluate_item2:[]
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
                    if(res.obj.score){
                        for(var j=0;j<res.obj.score.length;j++){
                            _this.$set(_this.$data.score_results_item,res.obj.score[j].code,res.obj.score[j].score);
                        };
                    }
				},
				error:function(){
					layer.closeAll("loading");
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
				
				_this.evaluate_section2_show = data.value == "false" ? false : true;
				
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
		},
		beforeUpdate:function(){
			
		}
		
	});
	
	form.on("submit(safety_evaluation_submit)", function(data) {
		var data2 = evaluate_item.$data,keys = Object.keys(data2.score_results_item);
		var tbSeEvalClassifyId = getCookie('tbSeEvalClassifyId');
		var request_data = {
			'methodName':'seUseCorpEvalDetailSave',
			'tbSeEvalClassifyId':tbSeEvalClassifyId,
			'evalType':1,
			'scores':[]
		};
		
		for(var j=0; j<keys.length; j++){
			request_data.scores.push({'code':keys[j],'score':data2.score_results_item[keys[j]],'question':data.field[keys[j]+'_question']})
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
					window.location.replace("regulator_equipment_sampling.html");
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

