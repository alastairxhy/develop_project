layui.use(["table","layer","element","laydate"],function(){
	var table = layui.table,layer = layui.layer,element = layui.element,laydate = layui.laydate;
	layer.load();
	table.render({
		elem:"#unit_evaluation_table",
		method:"post",
		where:{
			methodName:"getSeEvalList",
			evalType:2,
		},
		request:{
		 	pageName:"pageNo",
		 	limitName:"pageSize"
		},
		parseData:function(res){
			 return {
		      "code": res.status, 
		      "msg": res.msg, 
		      "count": res.length, 
		      "data": res.obj.seEvalLists 
		    };
		},
		size:"sm",
		height:385,
		page:{limit:10},
		loading:true,
		cols: [
		 	[
		 		{type: 'checkbox', fixed: 'left'},
		      	{field:'tbSeEvalClassifyId', title: '序号',width:'12%'},
				{field:'useCorpName', title: '使用单位', width:''},
		      	{field:'creditCode', title: '统一社会信用代码',width:''},
		      	{field:'address', title: '使用单位地址',width:''},
		      	{field:'createTime', title: '使用单位自评时间',width:''},
		      	{field:'jgCreateTime', title: '监管部门评价时间',width:'' } ,
		      	{field:'riskCate', title: '设备风险类别',width:''},
				{field:'safetyLevel', title: '使用单位安全管理等级',width:''},
		      	{field:'STATUS', title: '状态', width:''},
		    ]
		 ],
		 done:function(){
		 	layer.closeAll("loading")
		 }
	});

	laydate.render({
		elem:"#start_date",
	});
	
	laydate.render({
		elem:"#end_date",
	});
	
	
})
			
			