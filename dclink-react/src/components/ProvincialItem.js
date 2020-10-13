import React from 'react';

import Popover from 'react-bootstrap/Popover';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { ResponsiveBar } from '@nivo/bar'


import ReactEcharts from 'echarts-for-react';


import ProvincialCandidate from './ProvincialCandidate.js';
import Item from './Item.js';
import Link from './Link.js';
import ExtraCharts from './ExtraCharts.js';


import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';


import Util from '../Util.js';


export default class ProvincialItem extends Item {
	
	constructor(){
		super();
		
		this.state = {
			item:{},
			bar:()=> {return null}

		}
		
	
	}
	
	
	zoomedMapChart(context,code,geoJson){
		var parent = code.substring(0,2);
		  
    	const parentJson = require(`../json/${parent}.json`) 
		 
	        
        var json = {features: [],type:"FeatureCollection"};
        json.features[0] = parentJson.features[0];
        json.features[0].properties.name = 'parent';
        
        
        var option = {
			    visualMap: {
			        min: -100000,
			        max: 600000,
			        show:false,
			        calculable: true,
			        inRange: {
			            color: ['white','#50a3ba', '#eac736', '#d94e5d']
			        }
			    },
        		 series: [
	                {
	                    type: 'map',
	                    mapType: 'zoomed'+code, 
	                    aspectScale:1,
	                    cursor:'default',
	                    label: {
	                        normal: {
	                            show: false
	                        },
	                        emphasis: {
	                            show: false
	                        }
	                    },
	                    data:[
	                    	{name:'parent',
	                    	value:-600000,
	                    	itemStyle:{
	                    			borderColor:'#f0f0f0',
	                    			normal:{borderWidth:1,color:'#ffffff'},
	                    			emphasis:{borderWidth:1,areaColor:'rgba(128, 128, 128, 0)'}
	                    	},
	                    	emphasis:{
	                    		itemStyle:{normal:{color:'#000000'}}}}
	                    ],
	                    nameMap: {'parent':'parent'}
	                }
	            ]
	        };
        
	        var index = 1;
	        var arr = code.split(",");
	        
	        arr.forEach(function(item){
		        json.features[index] = geoJson.features[index-1];
		        json.features[index].properties.name = 'child'+index;

		        var c = item;
		        if(item.length>5){
		        	c = item.substring(0,5);
		        }			        
		        var zone = context.zones[c];
		        if(zone===undefined) zone = context.zones[item.substring(0,2)]
		        
		        option.series[0].data.push({
		        	name:'child'+index,
		        	value:zone.pop,
		        	itemStyle:{
			        	normal:{
			        		borderWidth:0
						},
	                    emphasis:{
	                    	areaColor:'#f04541'
                        }
		        	}
		        });
		        option.series[0].nameMap['child'+index] = 'child'+index;
		        
		        index++;
	        });
	        
	        const echarts = require('echarts');
	        echarts.registerMap('zoomed'+code, json);
	        
	        return <ReactEcharts option={option} style={{width: '320px', height: '300px'}}/>
	}
	
	 mapChart(code){
		
	
		
		 const echarts = require('echarts');
		
		
		 code = code+"";
			var arr = code.split(",");
			
			 var geoJson = {features: [],type:"FeatureCollection"};
			 
			 
			 arr.forEach(async function(item){
				 const json = require("../json/"+item+".json") 

				 geoJson.features.push(json.features[0]);
			    });
			 
    		echarts.registerMap(code, geoJson);

    		const option={
    			series:[{
                    type: 'map',
                    mapType: code, 
                    aspectScale:1,
              
                    emphasis: {
                        label: {
                            show: false
                        }
                    },
                    cursor:'default',
                    itemStyle: {
                        normal: {
                            borderColor: '#373a3c',
                            areaColor: 'silver',
                            borderWidth: 1
                        },
                        emphasis: {
                            areaColor: 'grey',
                            borderWidth: 0
                        }
                    }
                }]
    		}
	        

		 
		return <DataContext.Consumer>
    	{data=>(
    		<OverlayTrigger
		    	placement="right"
			    overlay={ <Popover id="popover-basic">
				    <Popover.Content style={{width:'320px',height:'300px',borderTop: '5px solid #2780E3'}}>	
				    {this.zoomedMapChart(data,code,geoJson)}
				    </Popover.Content>
				  </Popover>}>
	        	<span>
	        		<ReactEcharts option={option} style={{width: '30px', height: '30px',display: 'inline-block'}} className="map"/>
	        	</span>
	        </OverlayTrigger>
    	  )}
	  	</DataContext.Consumer>
	}
	
	 
	
	 
	 
	title(item){
		const title = item.title===null?'':item.title;
		
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
			{data=>(
	    		<>
		    		{item.code!==''?
		    			this.mapChart(item.code)
					:null
		    		}
		    		<span className="mr-1">
					{(item.zone===null||item.zone==='')?<span>{item.name}{item.title}</span>
					: <Link text={item.name+title} button="지역이력" onClick={()=> data.zoneHistory(item.zone)} />
							
					}
				  	</span>
			  	</>
			  )}
		  	</DataContext.Consumer>
		 )}
	  	</MainContext.Consumer>
	}
	
	
	result(item,context){
		
		if(item.candidates.length ===0 || item.candidates[0].party===0) return null; 
		
		var max = 0;
        item.candidates.forEach(function(candidate){
        	max+= candidate.rate;
        });
		
		const data= { country: "AD"};
		const keys = [];
		 item.candidates.forEach(function(candidate){	        	
	        	if(candidate.txt === '당선' || candidate.txt === '낙선'){
	        		data[""+candidate.person] = candidate.rate;
	        		data[candidate.person+"Color"] = context.parties[candidate.party].color;
	        		data[candidate.person+"Name"] = candidate.personName;
	        		data[candidate.person+"Percent"] = candidate.rate*100/max;
	        		data[candidate.person+"Photo"] = candidate.photo;
	        		
	        		keys.push(""+candidate.person) 
	        	}
	        });
		 
		 
		
		return  <div  className="bar">
			<ResponsiveBar
				layout="horizontal"
				data={[data]}
				colors={({ id, data }) => data[`${id}Color`]} 
		      	indexBy="country"
		      	keys={keys}
				enableLabel={false}
		    	axisBottom={null}
				tooltip={({ id, value, data }) => (
					<>
						{data[`${id}Photo`]===1?
						<img className="mr-1" src={require(`../portrait/${id}.jpg`)} style={{width: '30px', height: '40px'}} alt=""></img>
						:null}
			            <span >
			                {data[`${id}Name`]} : {Util.number(value)} ({data[`${id}Percent`].toFixed(2)}%)
			            </span>
		            </>
		        )}
				theme={{
					tooltip: {
						container: {
							color:'white',
							background: 'rgba(0, 0, 0, 0.7)'
						}
	            }
	        }}
		    />
	    </div>
	}
	

		
	candidate(candidate,i){
		return 	<ProvincialCandidate candidate={candidate} key={i}/>;
	}
	
	
	
	extra(item){
		
    	return <ExtraCharts item = {item}/>
	}
	
}