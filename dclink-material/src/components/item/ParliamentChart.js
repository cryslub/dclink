import React, { Component } from 'react';

import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';


import * as Highcharts from 'highcharts';
import HighchartsItem from "highcharts/modules/item-series";
import HighchartsReact from 'highcharts-react-official';

HighchartsItem(Highcharts)
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/highcharts-more")(Highcharts);

export default class ParliamentChart extends Component {
	render(){
		const context = this.props.data;
        const councils = this.props.councils;
	
        
		var data = [];
        Object.keys(councils).forEach((key)=>{
			
			const count = councils[key]
            const party = context.parties[key]
            data.push([party.name, count, party.color, party.name]);
		})
		

		
		var options = {
                
			    chart: {
			        type: 'item',
                    height:200,
                    backgroundColor: 'rgba(0,0,0,0)'
			    },

			    title: {
			        text: '',
                    floating:true
			    },

			  
			    legend: {
			       enabled:false
			    },

			    series: [{
			        name: '의석',
			        keys: ['name', 'y', 'color', 'label'],
			        data: data,
			        dataLabels: {
			            enabled: false,
			            format: '{point.label}'
			        },

			        // Circular options
			        center: ['50%', '70%'],
			        size: '100%',
			        startAngle: -100,
			        endAngle: 100
			    }],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 600
                        },
                        chartOptions: {
                            series: [{
                                dataLabels: {
                                    distance: -30
                                }
                            }]
                        }
                    }]
                }
			}
		
		var mdUpOption = {

			    chart: {
			        type: 'item'
			    },

			    title: {
			        text: ''
			    },

			 
			    legend: {
			        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
			    },

			    series: [{
			        name: '의원',
			        keys: ['name', 'y', 'color', 'label'],
			        data: data,
			        dataLabels: {
			            enabled: false,
			            format: '{point.label}'
			        },

			        // Circular options
			        center: ['50%', '70%'],
			        size: '80%',
			        startAngle: -100,
			        endAngle: 100
			    }]
			}
		
			
	
		return <>
			<Hidden mdUp >
                <Box> 

                    <HighchartsReact
                        highcharts={Highcharts}
                        options={mdUpOption}
                        {...this.props}
                    />
                </Box>
		    </Hidden>
		  	<Hidden smDown >
		  		<Box style={{width:350}}> 
			  	 <HighchartsReact
			        highcharts={Highcharts}
			        options={options}
			        {...this.props}
			    />
			    </Box>
		    </Hidden>
		 
		</>
	}
}