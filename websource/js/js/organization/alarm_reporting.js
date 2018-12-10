layui.use(["layer","table","element","form","laydate"],function(){
	var layer = layui.layer,table = layui.table,element = layui.element,form = layui.form,laydate = layui.laydate;
	var d = new Date();
	var alarm_reporting = new Vue({
		el:"#alarm_reporting",
		data:{
			reporting_1_data:{
				reporting_item1:[
					{name:"在用电梯数 ",value:"660 ",unit:"台",field:"inUseElevNum"},
					{name:"纳入救援数 ",value:"342 ",unit:"台",field:"onRescueElevNum"},
					{name:"累计救援次数 ",value:"500",unit:"次",field:"totalRescueTimes"},
					{name:"日均救援次数 ",value:"7",unit:"次",field:"avgRescueTimes"},
					{name:"到达现场平均时间 ",value:"11.4",unit:"分钟",field:"avlRescueArriveTime"},
					{name:"解救受困人数 ",value:"649",unit:"人",field:"totalTrappedPeople"},
					{name:"发生困人电梯数 ",value:"60",unit:"台",field:"trappedElevNum"},
					{name:"困人率 ",value:"22.36%",unit:"",field:"trappedElevRate"},
					{name:"一级救援单位 ",value:"36 ",unit:"家",field:"rescueUnitLevel1"},
					{name:"二级救援单位 ",value:"90 ",unit:"家",field:"rescueUnitLevel2"}
				],
				reporting_7_data:[
					{title:"按钮报警",num:"10",ratio:"10%"},
					{title:"开锁区外停梯",num:"66",ratio:"58.41%"},
					{title:"运行中开门",num:"1",ratio:"0.88%"},
					{title:"蹲底",num:"3",ratio:"2.56%"},
					{title:"断电",num:"1",ratio:"0.88%"},
					{title:"平层困人",num:"30",ratio:"26.55%"}
				],
                reporting_8_data:[
                    {title:"按钮报警",num:"10",ratio:"10%"},
                    {title:"开锁区外停梯",num:"66",ratio:"58.41%"},
                    {title:"运行中开门",num:"1",ratio:"0.88%"},
                    {title:"蹲底",num:"3",ratio:"2.56%"},
                    {title:"断电",num:"1",ratio:"0.88%"},
                    {title:"平层困人",num:"30",ratio:"26.55%"}
				],
                reporting_9_data:[
                    {title:"按钮报警",num:"10",ratio:"10%"},
                    {title:"开锁区外停梯",num:"66",ratio:"58.41%"},
                    {title:"运行中开门",num:"1",ratio:"0.88%"},
                    {title:"蹲底",num:"3",ratio:"2.56%"},
                    {title:"断电",num:"1",ratio:"0.88%"},
                    {title:"平层困人",num:"30",ratio:"26.55%"}
                ],
                reporting_10_data:[
                    {title:"按钮报警",num:"10",ratio:"10%"},
                    {title:"开锁区外停梯",num:"66",ratio:"58.41%"},
                    {title:"运行中开门",num:"1",ratio:"0.88%"},
                    {title:"蹲底",num:"3",ratio:"2.56%"},
                    {title:"断电",num:"1",ratio:"0.88%"},
                    {title:"平层困人",num:"30",ratio:"26.55%"}
                ],
                reporting_10_data2:[],
                totalElevNum:null,
			},
			show_section:0,
		},
		beforeCreate:function(){
			
		},
		updated:function(){
			
		},
		mounted:function(){
			form.render()
		},
		watch:{
			show_section:function(new_val){
			}
		}
	});
	
	laydate.render({ 
	  elem: '#start_date',
	  type:"month",
	  value: String(d.getFullYear())+'-01'
	});
	var month = d.getMonth()+1;
	laydate.render({ 
	  elem: '#end_date',
	  type:"month",
	  value: d.getFullYear()+'-'+(month > 9?month:("0"+month))
	});
		
	alarm_reporting.$watch("show_section",function(new_val){
		switch(new_val){
    		case '0':
    			render_report_section1_chart();
    			break;
    		case '1':
    			render_report_section2_chart();
    			break;
    		case '2':
    			render_report_section3_chart();
    			break;
    		case '3':
    			render_report_section4_chart();
    			break;
    		case '4':
    			render_report_section5_chart();
    			break;
    		case '5':
    			render_report_section6_chart();
    			break;
    		case '6':
    			render_report_section7_chart();
    			break;
            case '7':
                render_report_section8_chart();
                break;
            case '8':
                render_report_section9_chart();
                break;
            case '9':
                render_report_section10_chart();
                break;
    	}
	})
   
    //统计渲染--------------------------------------------------------
    //------------------------------------------------------
	var render_report_section1_chart = function(){
		var start_date = $("#start_date").val(),end_date = $("#end_date").val();
		var accident_chart = echarts.init(document.getElementById("accident_chart"));
		var chart_data = {
			time:[],
			accidentElevNum:[],
			faultElevNum:[]
		};
		
	    table.render({
	    	elem:"#reporting_item1_table",
	    	method:"post",
	    	url:request_url,
			where:{
				methodName:'totalReport',
				endMonth:end_date,
				startMonth:start_date
			},
			request:{
				pageName:"pageNo",
 				limitName:"pageSize"
			},
			parseData:function(res){
				var reporting_item1 = alarm_reporting.$data.reporting_1_data.reporting_item1;
                chart_data.time =[];
                chart_data.accidentElevNum =[];
                chart_data.faultElevNum =[];
				for(var j=0;j<res.obj.cityAccidentList.length;j++){
					chart_data.time.push(res.obj.cityAccidentList[j].rpMonth);
					chart_data.accidentElevNum.push(res.obj.cityAccidentList[j].accidentElevNum);
					chart_data.faultElevNum.push(res.obj.cityAccidentList[j].faultElevNum);
				}
				for(var j=0;j<reporting_item1.length;j++){
					var field = reporting_item1[j].field;
					alarm_reporting.$set(reporting_item1[j],"value",res.obj.elevRescueInfo[field])
				}
				
				accident_chart.setOption(accident_chart_option);
				return {
				    "code": res.status, 
				    "msg": res.msg, 
				    "count": res.length, 
				    "data": res.obj.cityAccidentList 
			    };
			},
	    	size:"sm",
			height:610,
			page:{limit:10},
			loading:true,
			even:true,
			toolbar:"#alarm_reporting_table_toolbar",
			cols: [
				[
		      		{field:'rpMonth', width:100, title: '月份'}
		      		,{field:'inUseElevNum', width:'', title: '在用电梯台数'}
		      		,{field:'faultElevNum', width:'', title: '故障台数'}
		      		,{field:'faultRate', title: '故障率', width:80} 
		      		,{field:'accidentElevNum', title: '事故台数',width:90}
		      		,{field:'accidentRate', title: '事故率', width:80}
		    	]
			],
			done:function(res){
				
			}
	    });
	    
	    var accident_chart_option = {
	        tooltip: {
	        	trigger: 'axis'
	        },
	        legend: {
	            data:['事故台数','故障台数']
	        },
	        xAxis: {
	            data:chart_data.time
	        },
	        yAxis: {
	        	type:"value",
	        },
	        series: [
	            {
	            	name: '事故台数',
	                type: 'line',
	                data: chart_data.accidentElevNum
	            },
	            {
	            	name: '故障台数',
	                type: 'line',
	                data: chart_data.faultElevNum
	            }
	        ]
		};

	    reload("reporting_item1_table");

	    
	}
    render_report_section1_chart();
    
    //行政区域统计渲染--------------------------------------------------------------
    //-----------------------------------------------------------------------
    var render_report_section2_chart = function(){
    	var report_section2_chart = echarts.init(document.getElementById("report_section2_chart"));
    	var start_date = $("#start_date").val(),end_date = $("#end_date").val();
    	var chart_data = {
			city:[],
			faultRate:[]
		};
    	table.render({
	    	elem:"#reporting_section2_table",
	    	method:"post",
	    	url:request_url,
			where:{
				methodName:'reportByArea',
				endMonth:end_date,
				startMonth:start_date
			},
			request:{
				pageName:"pageNo",
 				limitName:"pageSize"
			},
			parseData:function(res){
				for(var j=0;j<res.obj.accidentAreaList.length;j++){
					chart_data.city.push(res.obj.accidentAreaList[j].areaName);
					chart_data.faultRate.push(res.obj.accidentAreaList[j].faultRate);
				};
				
				report_section2_chart.setOption(report_section2_chart_option);
				
				return {
				    "code": res.status, 
				    "msg": res.msg, 
				    "count": res.length, 
				    "data": res.obj.accidentAreaList 
			    };
			},
	    	size:"sm",
			height:470,
			page:{limit:15},
			loading:true,
            toolbar:"#alarm_reporting_table_toolbar",
			cols: [
				[
		      		{field:'areaName', width:'8%', title: '所属区域',rowspan:2},
		      		{field:'totalElevNum', title: '电梯台数',rowspan:2},
		      		{field:'',title: '困人',colspan:6,align:"center"}
		    	],
		    	[
		    		{field:'trapNum', title: '困人次数',width:"13%"}
		    		,{field:'trapRate', title: '困人率',width:"13%"}
		    		,{field:'noTrapNum', title: '非困人次数',width:"13%"}
		    		,{field:'faultRate', title: '故障率',width:"13%"}
		    		,{field:'faultTimes', title: '故障次数',width:"13%"}
		    		,{field:'avgFaultRate', title: '平均故障率',width:"13%"}
		    		
		    	]
			]
	    });
    	
    
	 	var report_section2_chart_option = {
            tooltip: {
            	trigger: 'axis'
            },
            legend: {
                data:['事故台数','故障率']
            },
            xAxis: {
                data: chart_data.city
            },
            yAxis: {
            	type:"value",
            },
            series: [
	            {
	            	name: '故障率',
	                type: 'bar',
	                data: ['0.10%','0.10%','0.10%','0.10%','0.10',]
	            }
            ]
   		};

        reload("reporting_section2_table");
      
    }
    
    //维保单位渲染----------------------------------------------------------------
    var render_report_section3_chart = function(){
    	var start_date = $("#start_date").val(),end_date = $("#end_date").val();
    	table.render({
	    	elem:"#reporting_section3_table",
	    	method:"post",
	    	url:request_url,
			where:{
				methodName:'reportByServiceCorp',
				endMonth:end_date,
				startMonth:start_date
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
				    "data": res.obj.accServiceCorpList 
			    };
			},
	    	size:"sm",
			height:625,
			page:{limit:15},
			loading:true,
            toolbar:"#alarm_reporting_table_toolbar",
			cols: [
				[
		      		{field:'corpName', width:'20%', title: '维保单位'}
		      		,{field:'trapNum', width:'16%', title: '困人'}
		      		,{field:'notTrapNum', width:'16%', title: '非困人'}
		      		,{field:'accNum', title: '故障数', width:'16%'} 
		      		,{field:'elevTotal', title: '乘客电梯数',width:'16%'}
		      		,{field:'faultRate', title: '故障率', width:'16%'}
		    	]
			]
	    });

        reload("reporting_section3_table");
    };
    
    //使用单位渲染----------------------------------------------------------------
    var render_report_section4_chart = function(){
    	var start_date = $("#start_date").val(),end_date = $("#end_date").val();
    	table.render({
	    	elem:"#reporting_section4_table",
	    	method:"post",
	    	url:request_url,
			where:{
				methodName:'reportByUseCorp',
				endMonth:end_date,
				startMonth:start_date
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
				    "data": res.obj.accUseCorpList 
			    };
			},
	    	size:"sm",
			height:625,
			page:{limit:15},
			loading:true,
            toolbar:"#alarm_reporting_table_toolbar",
			cols: [
				[
					{field:'areaName', title: '区域'},
		      		{field:'useCorpName', title: '使用单位'},
		      		{field:'trapNum', title: '困人'},
		      		{field:'notTrapNum', title: '非困人'},
		      		{field:'accNum', title: '故障数'} ,
		      		{field:'totalElevNum', title: '乘客电梯数'},
		      		{field:'faultRate', title: '故障率'},
		    	]
			]
	    });
        reload("reporting_section4_table");
    };
    
     //制造场所渲染---------------------------------------------------------
    var render_report_section5_chart = function(){
    	var start_date = $("#start_date").val(),end_date = $("#end_date").val();
    	table.render({
	    	elem:"#reporting_section5_table",
	    	method:"post",
	    	url:request_url,
			where:{
				methodName:'reportByProduceCorp',
				endMonth:end_date,
				startMonth:start_date
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
				    "data": res.obj.accProduceCorpList 
			    };
			},
	    	size:"sm",
			height:625,
			page:{limit:15},
			loading:true,
			even:true,
			cols: [
				[
		      		{field:'corpName',  title: '制造单位'}
		      		,{field:'trapNum', title: '困人'}
		      		,{field:'notTrapNum',  title: '非困人'}
		      		,{field:'accNum', title: '故障'} 
		      		,{field:'elevTotal', title: '乘客电梯数'}
		      		,{field:'faultRate', title: '故障率'}
		    	]
			]
	    });

        reload("reporting_section5_table");

    };
    
    
    
    //电梯使用场所渲染---------------------------------------------------------
    var render_report_section6_chart = function(){
    	var start_date = $("#start_date").val(),end_date = $("#end_date").val();
    	var report_section6_chart = echarts.init(document.getElementById("report_section6_chart"));
    	var chart_data = {
			city:[],
			faultTimes:[],
			faultRate:[]
		};
    	table.render({
	    	elem:"#reporting_section6_table",
	    	method:"post",
	    	url:request_url,
			where:{
				methodName:'reportByUsePlace',
				endMonth:end_date,
				startMonth:start_date
			},
			request:{
				pageName:"pageNo",
 				limitName:"pageSize"
			},
			parseData:function(res){
                chart_data.city.splice(0,chart_data.city.length);
                chart_data.faultTimes.splice(0,chart_data.faultTimes.length);
                chart_data.faultRate.splice(0,chart_data.faultRate.length);
				for(var j=0;j<res.obj.accUsePlaceList.length;j++){
					chart_data.city.push(res.obj.accUsePlaceList[j].usePlace);
					chart_data.faultTimes.push(res.obj.accUsePlaceList[j].faultTimes);
					chart_data.faultRate.push(res.obj.accUsePlaceList[j].faultRate);
				};
				report_section6_chart.setOption(report_section6_chart_option);
				return {
				    "code": res.status, 
				    "msg": res.msg, 
				    "count": res.length, 
				    "data": res.obj.accUsePlaceList 
			    };
			},
	    	size:"sm",
			height:445,
			page:{limit:15},
			loading:true,
            toolbar:"#alarm_reporting_table_toolbar",
			cols: [
				[
		      		{field:'usePlace', title: '使用场所'}
		      		,{field:'totalElevNum	',  title: '全市电梯量'}
		      		,{field:'trapAccNum',  title: '困人'}
		      		,{field:'noTrapAccNum', title: '非困人'} 
		      		,{field:'faultTimes', title: '故障次数'}
		      		,{field:'faultRate', title: '事件发生率'}
		    	]
			]
	    });
    	

	 	var report_section6_chart_option = {
            tooltip: {
            	trigger: 'axis',
            	axisPointer:{
            		type:"cross",
            		crossStyle:{
            			color:"red"
            		},
            		lineStyle: {
		                color: 'red',
		            }
            	}
            },
            legend: {
                data:['故障次数','事件发生率']
            },
            xAxis: {
                data: chart_data.city
            },
            yAxis: [
            	{
		            type: 'value',
		            name: '台数',
		            min: 0,
		            max: 100,
		            position: 'left',
		            axisLabel: {
		                formatter: '{value}台'
		            },
		            splitNumber:10
		        },
		        {
		            type: 'value',
		            name: '比率',
		            min: 0,
		            max: 100,
		            position: 'right',
		            axisLabel: {
		                formatter: '{value}%'
		            }
		        }
            ],
            series: [
	            {
	            	name: '故障次数',
	                type: 'bar',
	                data: chart_data.faultTimes
	            },
	            {
	            	name: '事件发生率',
	                type: 'line',
	                yAxisIndex:1,
	                data: chart_data.faultRate
	            }
            ]
   		};
        reload("reporting_section6_table");

    };
    
    
    
    
    var render_report_section7_chart = function(){	
    	var report_section7_chart = echarts.init(document.getElementById("report_section7_chart"));
    	var start_date = $("#start_date").val(),end_date = $("#end_date").val();
    	var chart_data = [];
    	function get_data(start,end){
			$.ajax({
				data:{
					methodName:"reportByAccidentReason",
					startMonth:start,
					endMonth:end
				},
				success:function(res){
					alarm_reporting.$set(alarm_reporting.$data.reporting_1_data,"reporting_7_data",res.obj.accReasonList);
                    chart_data.splice(0,chart_data.length);
					for(var j=0;j<res.obj.accReasonList.length;j++){
						chart_data.push({name:res.obj.accReasonList[j].faultCode,value:res.obj.accReasonList[j].faultTimes});
                        report_section7_chart_option.legend.data[j]=res.obj.accReasonList[j].faultCode;
					};
					report_section7_chart.setOption(report_section7_chart_option);
				}
			});
        };
    	get_data(start_date,end_date);
	 	var report_section7_chart_option = {
            tooltip : {
		        trigger: 'item',
		        formatter: "{a} <br/>{b} : {c}/{d}%"
		    },
		    legend:{
		    	orient: 'vertical',
		    	right:"right",
		    	data:[]
		    },
		    color:['#FF9933','#5FB878','#1E9FFF','#393D49','#CC6600','#CCCC66'],
            
            series: [
	            {
	            	name:"数量/占比",
	                type: 'pie',
	                radius:"70%",
	                center: ['50%', '50%'],
	                data: chart_data,
	                roseType: false,
	                itemStyle: {
			           	normal:{
			             	label:{
				             show:true,
				             formatter: '{b}\n\n {c}台/{d}%',
				             
			             	},
			            labelLine:{
			             	show:true
			             	}
			            },
			           	emphasis: {
			                shadowBlur: 10,
			                shadowOffsetX: 0,
			                shadowColor: 'rgba(0, 0, 0, 0.5)'
			            }
			        }
	            },
	            
            ]
   		};

	 	$("#reload").click(function () {
			get_data($("#start_date").val(),$("#end_date").val());
        })
        
    };
    
    
    form.on("select(show_section)",function(obj){
    	alarm_reporting.$set(alarm_reporting.$data,'show_section',obj.value)
    });
    
    var render_report_section8_chart = function () {
        var report_section8_chart = echarts.init(document.getElementById("report_section8_chart"));
        var start_date = $("#start_date").val(),end_date = $("#end_date").val();
        var chart_data = [];
        function get_data(start,end){
            $.ajax({
                data:{
                    methodName:"reportByAccidentReason",
                    startMonth:start,
                    endMonth:end
                },
                success:function(res){
                    alarm_reporting.$set(alarm_reporting.$data.reporting_1_data,"reporting_8_data",res.obj.accReasonList);
                    chart_data.splice(0,chart_data.length);
                    for(var j=0;j<res.obj.accReasonList.length;j++){
                        chart_data.push({name:res.obj.accReasonList[j].faultCode,value:res.obj.accReasonList[j].faultTimes});
                        report_section8_chart_option.legend.data[j]=res.obj.accReasonList[j].faultCode;
                    };
                    report_section8_chart.setOption(report_section8_chart_option);
					console.log(res)
                }
            });
        };
        get_data(start_date,end_date);

        var report_section8_chart_option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c}/{d}%"
            },
            legend:{
                orient: 'vertical',
                right:"right",
                data:['按钮报警','开锁区外停梯','运行中开门','蹲底','断电','平层困人']
            },
            color:['#FF9933','#5FB878','#1E9FFF','#393D49','#CC6600','#CCCC66'],

            series: [
                {
                    name:"数量/占比",
                    type: 'pie',
                    radius:"65%",
                    center: ['50%', '50%'],
                    data: chart_data,
                    roseType: false,
                    itemStyle: {
                        normal:{
                            label:{
                                show:true,
                                formatter: '{b}\n\n {c}台/{d}%',

                            },
                            labelLine:{
                                show:true
                            }
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                },

            ]
        };

        $("#reload").click(function () {
            get_data($("#start_date").val(),$("#end_date").val());
        })

    };

    var render_report_section9_chart = function () {
        // var report_section9_chart = echarts.init(document.getElementById("report_section9_chart"));
        // var start_date = $("#start_date").val(),end_date = $("#end_date").val();
        // var chart_data = [];
        // function get_data(start,end){
        //     $.ajax({
        //         data:{
        //             methodName:"reportByAccidentReason",
        //             startMonth:start,
        //             endMonth:end
        //         },
        //         success:function(res){
        //             alarm_reporting.$set(alarm_reporting.$data.reporting_1_data,"reporting_9_data",res.obj.accReasonList);
        //             chart_data.splice(0,chart_data.length);
        //             for(var j=0;j<res.obj.accReasonList.length;j++){
        //                 chart_data.push({name:res.obj.accReasonList[j].faultCode,value:res.obj.accReasonList[j].faultTimes});
        //                 report_section9_chart_option.legend.data[j]=res.obj.accReasonList[j].faultCode;
        //             };
        //             report_section9_chart.setOption(report_section9_chart_option);
        //             console.log(res)
        //         }
        //     });
        // };
        // get_data(start_date,end_date);
		//
        // var report_section9_chart_option = {
        //     tooltip : {
        //         trigger: 'item',
        //         formatter: "{a} <br/>{b} : {c}/{d}%"
        //     },
        //     legend:{
        //         orient: 'vertical',
        //         right:"right",
        //         data:['按钮报警','开锁区外停梯','运行中开门','蹲底','断电','平层困人']
        //     },
        //     color:['#FF9933','#5FB878','#1E9FFF','#393D49','#CC6600','#CCCC66'],
		//
        //     series: [
        //         {
        //             name:"数量/占比",
        //             type: 'pie',
        //             radius:"65%",
        //             center: ['50%', '50%'],
        //             data: chart_data,
        //             roseType: false,
        //             itemStyle: {
        //                 normal:{
        //                     label:{
        //                         show:true,
        //                         formatter: '{b}\n\n {c}台/{d}%',
		//
        //                     },
        //                     labelLine:{
        //                         show:true
        //                     }
        //                 },
        //                 emphasis: {
        //                     shadowBlur: 10,
        //                     shadowOffsetX: 0,
        //                     shadowColor: 'rgba(0, 0, 0, 0.5)'
        //                 }
        //             }
        //         },
		//
        //     ]
        // };
		//
        // $("#reload").click(function () {
        //     get_data($("#start_date").val(),$("#end_date").val());
        // })

    };

    var render_report_section10_chart = function () {
        var report_section10_chart = echarts.init(document.getElementById("report_section10_chart"));
        var report_section10_chart1 = echarts.init(document.getElementById("report_section10_chart1"));
        var years = $("#Years").val();
        var chart_data = [],chart_data1 = [];
        function get_data(years){
			$.ajax({
				data:{
					methodName:"reportByUseLife",
                    useLifeType:years
				},
				success:function(res){
					alarm_reporting.$set(alarm_reporting.$data.reporting_1_data,"reporting_10_data",res.obj.areaUserLifeList);
                    alarm_reporting.$set(alarm_reporting.$data.reporting_1_data,"reporting_10_data2",res.obj.sblbUserLifeList);
                    alarm_reporting.$set(alarm_reporting.$data.reporting_1_data,"totalElevNum",res.obj.totalElevNum);

					for(var j=0;j<res.obj.areaUserLifeList.length;j++){
                        report_section10_chart1_option.xAxis.data[j] = res.obj.areaUserLifeList[j].areaDistrict?res.obj.areaUserLifeList[j].areaDistrict:'其他';
						report_section10_chart1_option.series[0].data[j] = res.obj.areaUserLifeList[j].totals;
					};
                    report_section10_chart_option.series[0].data[0] = res.obj.sblbUserLifeList[0].totalq;
                    report_section10_chart_option.series[0].data[1] = res.obj.sblbUserLifeList[0].totaly;
                    report_section10_chart_option.series[0].data[2] = res.obj.sblbUserLifeList[0].totalz;
                    report_section10_chart_option.series[0].data[3] = res.obj.sblbUserLifeList[0].totalo;
					report_section10_chart.setOption(report_section10_chart_option);
                    report_section10_chart1.setOption(report_section10_chart1_option);
					console.log(res)
				}
			});
		};
		get_data(years);

        var report_section10_chart_option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['故障次数']
            },
            xAxis: {
                data: ['曳引与强制驱动台数','液压驱动台数','自动扶梯与自动人行道台数','其他台数'],
                axisLabel:{
                    interval:0
				}
            },
            yAxis: {
                type:"value",
            },
            series: [
                {
                    name: '故障次数',
                    type: 'bar',
                    data: []
                }
            ]
        };

        var report_section10_chart1_option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['故障次数']
            },
            xAxis: {
                data: [],
                axisLabel:{
                    interval:0
                }
            },
            yAxis: {
                type:"value",
            },
            series: [
                {
                    name: '故障次数',
                    type: 'bar',
                    data: []
                }
            ]
        };

    }




    
    function reload(table) {
		$("#reload").click(function () {
            var start_date = $("#start_date").val(),end_date = $("#end_date").val();
			table_search(table,{endMonth:end_date,startMonth:start_date})
        })
    }
    
    
    
    
    
    
});