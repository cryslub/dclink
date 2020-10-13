import React, { Component } from 'react';

import Col from 'react-bootstrap/Col';
import ReactEcharts from 'echarts-for-react';

import Util from '../Util.js';

export default class MultiSunburst extends Component {
	
	getSunburstOption(isBasic,data,sum){
		
		const self = this;
		

		
		const size = Util.getSize(isBasic?600:480);
		const width = Math.min(size.width,size.height);
		var r0 = '10%'
		
		var fontSize = 12;
		if(width<576){
			r0='10%';
			fontSize = 11;

		}
		
		var levels = [{}, {
            r0: r0,
            r: '65%',
            itemStyle: {
                borderWidth: 1
            },
            label: {
            	
                align: 'right'
            }
        }, {
            r0:'65%',
            r: '100%',
            label: {
                align: 'right'
            },
            itemStyle: {
                borderWidth: 1
            }
        }]
		
		if(isBasic){
			levels = [{}, {
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
		}
		
		
		
		return{option:  {
			
			tooltip: {
		        backgroundColor:'rgba(0, 0, 0, 0.7)',
		        borderColor:'rgba(0, 0, 0, 0)',
		        borderWidth: 0,
		        style:{
		        	color:'white'
		        },
		        formatter:function(param,data){
		        	if(param.data.text===undefined) {
		        		return self.props.currentState.name+" 총 "+Util.number(sum) + "표"	        	
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
		
		const isBasic = this.props.isBasic;
		const items = this.props.items;
		const context = this.props.context;
		var data = []
		
		
		var count=0;
		
		var sum=0;
		Object.keys(items).forEach(function(keyName, keyIndex) {
			const item = items[keyName];
			if(item.type==='기초' || item.type==='국회'){
				item.candidates.forEach(function(candidate){	
					sum+=candidate.rate;
				})
			}
		});
		
		
		
		var div = Math.trunc(sum/2000000)+1;
		const size =sum/div;

	
	
		var s = 0;
		var i= 0;
		data[i] =[];
		Object.keys(items).forEach(function(keyName, keyIndex) {
			const item = items[keyName];
			if(item.type==='기초' || item.type==='국회'){
				const d = {
					name:item.name,
					text:item.name+' 총 ',
				    itemStyle: {
				        color: 'silver'
				    },
				    children:[]
				}
				
				item.candidates.forEach(function(candidate){	
					d.children.push({
						name:candidate.personName,
						value:candidate.rate,
						text:context.parties[candidate.party].name+" "+candidate.personName+" ",
						itemStyle:{
							color:context.parties[candidate.party].color
						}
					})
					s+=candidate.rate
				})
					
				if(s>0)count++;
				
				if(d.children[0]!==undefined){
					d.children[0].children = [];
					
					item.rates.forEach(function(rate){	
						d.children[0].children.push({
							name:context.parties[rate.party].name,
							value:rate.count,
							text:context.parties[rate.party].name+" ",
							itemStyle:{
								color:context.parties[rate.party].color
							}
						})
					})
					

				}
				
				if(s<=size){
					data[i].push(d);
				}else{
					i++;
					data[i] = [];
					s = 0;
				}
			}
		});

		
		if(count===0) return null;
		
		

		
		 return data.map((d)=>{
			const ret =this.getSunburstOption(isBasic,d,sum);

			return <Col className="m-3"> <ReactEcharts option={ret.option} style={{'width':ret.width+'px','height':ret.width+'px'}}/> </Col>
		 });
	}
}