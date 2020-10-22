import React, { Component } from 'react';

import ReactEcharts from 'echarts-for-react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';



import Util from '../../Util.js';

export default class Sunburst extends Component {
	
	getSunburstOption(data){
		

		
		const size = Util.getSize(600);
		const width = Math.min(size.width,size.height);
		var r0 = '10%'
		
		var fontSize = 12;
		if(width<576){
			r0='10%';
			fontSize = 11;

		}
		
		const levels = [{}, {
	            r0: r0,
	            r: '45%',
	            itemStyle: {
	                borderWidth: 1
	            },
	            label: {
	            	
	                align: 'right'
	            }
	        }, {
	            r0:'45%',
	            r: '94%',
	            label: {
	            	fontSize:fontSize,
	                align: 'right'
	            },
	            itemStyle: {
	                borderWidth: 1
	            }
	        }, {
	            r0:'94%',
	            r: '100%',
	            label: {
	            	show:false,
	            	position: 'outside',
	            	fontSize:fontSize,
	            	padding: -5,
	            	align: 'right',
	            	color:'auto'
	            },
	            itemStyle: {
	                borderWidth: 1
	            }
	        }]

		
		
		
		return{option:  {
			
			tooltip: {
		        backgroundColor:'rgba(0, 0, 0, 0.5)',
		        borderColor:'rgba(0, 0, 0, 0)',
		        borderWidth: 0,
		        style:{
		        	color:'white'
		        },
		        textStyle:{
		        	fontSize:11
		        },
		        formatter:function(param,data){
		        	if(param.data.text===undefined) {
		        		return " 총 "+Util.number(param.value) + "표"	        	
		        	}
			        return param.data.text+Util.number(param.value) + "표"
		        }
		    },
		    series: {
		        type: 'sunburst',
		        highlightPolicy: 'ancestor',
		        data: data,
		        radius: [0, '100%'],
		        sort: null,
		        levels: levels
		    }
		},
		width:width}

	}

	render(){
		
		const context = this.props.context;
		const statics = this.props.statics;
		const metroItems = statics.metroItems;
		const rmetroItems = statics.rmetroItems;
		
		const data = [];
		
		Object.keys(metroItems).forEach((code)=>{
			const items = metroItems[code];
			const d = {
				name:items[0].name,
				text:items[0].name+' 총 ',
			    itemStyle: {
			        color: 'silver'
			    },
			    children:[]
			}
		
			items.forEach((item)=>{
				
				d.children.push({
					name:item.personName,
					value:item.rate,
					text:context.parties[item.party].name+" "+item.personName+" ",
					itemStyle:{
						color:context.parties[item.party].color
					}
				})
				
				
			});
			
			if(d.children[0]!==undefined){
				d.children[0].children = [];
				
				const rates = rmetroItems[code];
				
				rates.forEach(function(rate){	
					d.children[0].children.push({
						name:context.parties[rate.party].name,
						value:rate.rate,
						text:context.parties[rate.party].name+" ",
						itemStyle:{
							color:context.parties[rate.party].color
						}
					})
				})
				
			}
			
			
			data.push(d);
			
		})
		
		const ret =this.getSunburstOption(data);

		return <Grid item> <Box elevation={2}><Box p={2}> <ReactEcharts option={ret.option} style={{'width':ret.width+'px','height':ret.width+'px'}}/> </Box></Box></Grid>

	}
}