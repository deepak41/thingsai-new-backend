var createLineChart = function(data, day) {


	Highcharts.chart('container1', {

		chart: {
				// type: 'line',
			// width: 1100,
			height: 500
		},
	    title: {
	        text: 'Energy Generated for ' + day
	    },

	    subtitle: {
	        text: 'Source: thethingscloud.com'
	    },
	    xAxis: {
	    	type: "datetime"
	    },
	    yAxis: {
	        title: {
	            text: 'Energy Generated (KWh)'
	        }
	    },
	    legend: {
	        layout: 'vertical',
	        align: 'right',
	        verticalAlign: 'middle'
	    },
	    loading: {
	    	showDuration: 0
	    },

	    plotOptions: {
	        series: {
	            label: {
	                connectorAllowed: false
	            },
	            pointStart: 2
	        }
	    },

	    time: {
	    	useUTC: false
	    	// timezoneOffset: -360
	    },

	    // series: [{
	    //     name: 'Installation',
		   //      data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
		   //  }, {
		   //      name: 'Manufacturing',
		   //      data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
		   //  }, {
		   //      name: 'Sales & Distribution',
		   //      data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
		   //  }, {
		   //      name: 'Project Development',
		   //      data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
		   //  }, {
		   //      name: 'Other',
		   //      data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
	    // }],

	    series: [{
	    	// pointStart: <%-JSON.stringify(firstDay)%>,
	    	// pointInterval: 24*60*60*1000,
	        name: 'Energy Generated',
		    data: data,
		    showInLegend: false,
		    color: '#F72A6B'
	    }],

	    responsive: {
	        rules: [{
	            condition: {
	                maxWidth: 300
	            },
	            chartOptions: {
	                legend: {
	                    layout: 'horizontal',
	                    align: 'center',
	                    verticalAlign: 'bottom'
	                }
	            }
	        }]
	    },
	    credits: {
		    enabled: false
		},
		exporting: { enabled: false }

	});



};


var abc1 = function(data) {

	Highcharts.chart('container2', {

		chart: {
		   type: 'column',
		   options3d: {
		     enabled: true,
		     alpha: 0,
		     beta: 0,
		     depth: 20,
		     viewDistance: 25
		   },
		   reflow: false,
		   width: 1000,
			height: 500
		 },
		 credits: false,
		 title: {
		   text: 'Column Charts',
		   style: {
		     fontFamily: "Arial",
		     fontSize: "12px"}
		 },
		 plotOptions: {
		   column:{
		     showInLegend: false,
		     /**
		      * #BDBDBD : Grey
		      * #66BB6A : Green
		      * #FFA000 : Yellow
		      * #0D47A1 : Blue
		      * #D84315 : Red
		      */
		     colors: ['#D84315', '#66BB6A'],
		     colorByPoint : true,
		     depth: 25,
		     softThreshold: false
		   },
		  series: {
		      cursor: 'pointer',
		      events: {
		          click: function (event) {
		              alert(1);
		          },
		          legendItemClick: function () {
		              alert(2);
		          },
		          mouseOver: function () {
		             console.log("mouseOver ");
		          },
		          mouseOut: function () {
		             console.log("mouseOut ");
		          }
		      }
		  }
		 },
		 tooltip: {
		   formatter: function() {
		     return this.key + ': ' + this.y;
		   }
		 },
		 xAxis: {
		   type: 'category'
		 },
		 yAxis: {
		   min: 0,
		   minRange : 0.1,
		   title: {
		     text: '# of Funds'
		   }
		 },
		series: [{
			dataLabels: {
				enabled: true,
				format: '{point.y:.1f}'
			},

			data: data
			// data: [
			//   ['Firefox', 10.38],
			//   ['IE', 56.33],
			//   ['Chrome', 24.03],
			//   ['Safari', 4.77],
			//   ['Opera', 0.91]
			// ]

		}]

	});
};



var createChart = function() {

	var options = {
	  type: 'line',
	  data: {
	    labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
	    datasets: [
		    {
		      label: '# of Votes',
		      data: [12, 19, 3, 5, 2, 3],
	      	borderWidth: 1
	    	},	
				{
					label: '# of Points',
					data: [7, 11, 5, 8, 3, 7],
					borderWidth: 1
				}
			]
	  },
	  options: {
	  	scales: {
	    	yAxes: [{
	        ticks: {
						reverse: false
	        }
	      }]
	    }
	  }
	}

	var ctx = document.getElementById('chartJSContainer').getContext('2d');
	new Chart(ctx, options);
	
};


var createChart2 = function() {

	var myChart = echarts.init(document.getElementById('main'));

        // specify chart configuration item and data
        var option = {
            title: {
                text: 'ECharts entry example'
            },
            tooltip: {},
            legend: {
                data:['Sales']
            },
            xAxis: {
                data: ["shirt","cardign","chiffon shirt","pants","heels","socks"]
            },
            yAxis: {},
            series: [{
                name: 'Sales',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
	
};








