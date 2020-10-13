import React from 'react';

import Item from './Item.js';

import Button from 'react-bootstrap/Button';

import ReactEcharts from 'echarts-for-react';
import Highcharts from 'highcharts/highmaps';
import HighchartsTilemap from "highcharts/modules/tilemap";
import { isMobile} from "react-device-detect";

import {DataContext} from '../DataContext.js';


import Util from '../Util.js';

HighchartsTilemap(Highcharts);


export default class StaticsItem extends Item {

	constructor(){
		super();
		
		this.state={
				tileChartOption:{}
		}
		this.ref={};
		this.results={};
		
		this.tile = React.createRef();
		this.drawed = false;
		this.mapChartParty={};
		this.clicked = false;
	
	}
	
	componentDidMount(){
		const self =this;
		
		console.log("component did mount");
		Object.keys(this.results).forEach((ref)=>{
			self.drawed = true;
			self.makeMapChartOption(ref,self.results[ref]);
		})
	}
	componentDidUpdate (){
		
		console.log("component did update");
		if(this.tile.current!=null && !this.drawed){
			this.drawed = true;
			this.makeTileChartOption(this.props.context,this.props.statics.metros)
		}
		if(!this.drawed){
			
			this.drawMapChart();
		}
	}
	
	drawMapChart(){
		const self =this;
		
	}
	
	makeMapChartOption(id,rates,party){
		
		const context = this.props.context;

		if(rates===undefined) return null;
		if(party===undefined) {
			party=this.mapChartParty[id];
			if(party===undefined) {
				party= Object.keys(rates)[0];
			}
		}
		
		this.mapChartParty[id] = party;
		
		var geoJson = {features: [],type:"FeatureCollection"};


		 var data = [];
		 
		 
		 var max = 0;
		 rates[party].forEach(function(rate){
			 if(max < rate.rate / rate.total){ max = rate.rate / rate.total;}
		 });
		
		 var layoutCenter = null;
		 var layoutSize = null;
		 
		
		rates[party].forEach(function(rate){
			
			var r= rate.rate / rate.total;
			var code = rate.code;
			data.push({
				name:code,
				value :r,
				txt : rate.txt,
				link: rate.link,
				photo:rate.photo,
				person:rate.person,
				itemStyle:{
		        	normal:{
		        		color:Util.hexToRgbA(context.parties[party].color,r/max),
			        	borderColor:context.parties[party].color,
	                   shadowColor: 'rgba(0, 0, 0, 0.3)'
	               },
	                emphasis:{
	                   	areaColor:Util.hexToRgbA(context.parties[party].color,r/max),
	                   	label:{
	                   		show:false
	                   	}
	               },
	               label:{
	           		show:false
	           		}
				}
			});
			
			 
			const json =  require(`../json/${code}.json`)
	    	json.features[0].properties.name = code;
	    	geoJson.features.push(json.features[0]);
		});
		
		
		
		
		if(data.length === 1){
		//	layoutCenter = ['20%', '20%'];
		//	layoutSize = 200;
		}
		 
		
		
		 const echarts = require('echarts');
		   echarts.registerMap(id, geoJson);

		   
		   if(id.includes('basic')){
				const allBasics = this.props.statics.allBasics;
				Object.keys(allBasics).forEach((code)=>{
					const basic = allBasics[code];
					const arr = code.split(',');
					arr.forEach((c)=>{
						data.push({
							name:c,
							value :0,
							txt : '',
							link: '',
							photo:'',
							person:'',
							region:basic.region,
							itemStyle:{
					        	normal:{
					        		color:'white',
						        	borderColor:'silver',
				                   shadowColor: 'rgba(0, 0, 0, 0.3)'
				               },
				                emphasis:{
				                   	areaColor: 'rgba(0, 0, 0, 0)',
					                shadowColor: 'rgba(0, 0, 0, 0)',
				                   	label:{
				                   		show:false
				                   	}
				               },
				               label:{
				           		show:false
				           		}
							}
						})
						
						const json =  require(`../json/${c}.json`)
				    	json.features[0].properties.name = c;
				    	geoJson.features.push(json.features[0]);
						
						
					})
				})
			}
			 
		   
		   
		   const option =  {
      		 tooltip: {
      	            trigger: 'item',
	        	        position:'top',
      	            formatter:  function (params, ticket, callback) {
      	            	if(params.data.value ===0) return params.data.region+' 데이터 없음'
          	        	var value = (params.data.value*100).toFixed(2);
          	        	
          	        	if(params.data.person !== 0 && params.data.photo === 1){
	            	            return "<img src='http://cryslub1.cafe24.com/dclink/portrait/"+params.data.person+".jpg' style='width:30px;height:40px;margin-right:5px;'/>"+params.data.txt+" ("+ value +"%)";
          	        	}else{
	            	            return params.data.txt+" ("+ value +"%)";					            	        		
          	        	}
          	        },
          	        extraCssText:'border-radius:0px;'
      	        },
      	    grid:{
      	    	top:'0',
      	    	left:'0'
      	    },
	            series: [
	                {
	                    type: 'map',
	                    top:'50',
	                    roam:true,
	                    layoutCenter: layoutCenter,
	                    layoutSize: layoutSize,
	                    mapType: id, 
	                    aspectScale:1,
	                    cursor:'default',
	                    itemStyle:{
	                        normal:{label:{show:false}},
	                        emphasis:{label:{show:false},
	                        	shadowColor: 'rgba(0, 0, 0, 0.5)',
	                            shadowBlur: 10}
	                    },						                    
	                    data:data
	                }
	            ]
	        }

		   const main =document.getElementById(id);
			if(main == null ) return;
			const instance = echarts.init(main);
			instance.setOption(option);
			 
			instance.off('click');
			instance.on('click', function (params) {
				if(params.data.person!==undefined)
					context.history(params.data.person);
		     });
		        
		     this.ref[id] = instance;
	}
	
 
	
   mapChart(results,ref){
	   
		//const option= this.makeMapChartOption(ref,results)
		
		console.log("render");
			        
		const size = Util.getSize(ref.includes('metro')?1024:undefined);
		
		this.results[ref] = results;
		
	      return <DataContext.Consumer>
		    {data=>(
	    		<div style={{'width':size.width+'px','height':size.height+'px',margin: '0 auto'}} id={ref}>
				</div>
					

		      )}
		    </DataContext.Consumer>
			   
	}
	
	changeMapChart(result,party,ref){
		this.makeMapChartOption(ref,result,party)
	}
	
	
	
	makeTileChartOption(context,rates,party){
	
		if(rates===undefined) return null;
		if(party===undefined) party= Object.keys(rates)[0];
		
		
		 var max = 0;
		 rates[party].forEach(function(rate){
			 if(max < rate.rate / rate.total){ max = rate.rate / rate.total;}
		 });

		 
		 
		var data = [];
		
		const allBasics = this.props.statics.allBasics;
		Object.keys(allBasics).forEach((key)=>{
			const item = allBasics[key];
			data.push({
	            x: (item.x),
	            y: item.y,
				v :0,
				photo:'',
				txt : '',
				person: 0,
				link: '',
				name: '',
				region:item.region,
				abbreviation: '',
	            color:'#f5f5f5',
	        });
		})
		
		const size = Util.getSize(1024)
		const width = size.width;
		
		rates[party].forEach(function(rate){
			var r= rate.rate / rate.total;

			var a =r/max;
			if(a<0.2) a= 0.2;
			data.push({
	            x: (rate.x),
	            y: rate.y,
				v :(r*100).toFixed(2),
				photo:rate.photo,
				txt : rate.txt,
				person: rate.person,
				link: rate.link,
				name: rate.name,

				abbreviation: width>576?rate.name.substring(0,2):rate.name.substring(0,1),
	            color:Util.hexToRgbA(context.parties[party].color,a),
	        });
		});
		
		
		var fontSize = width>576?'11px':'5px';
		
		var tileShape = 'circle'
		var pointPadding = 2
		if(window.innerWidth<480){
			tileShape ='hexagon'
			pointPadding=0
		}
			
		const options = {
		    chart: {
		        type: 'tilemap',
		        height:'140%',
		        spacingLeft:0,
		        spacingTop:0,
		        plotWidth:width,
		        inverted: true
		    },
			exporting:{
				buttons:{
					contextButton:{
						enabled:false
					}
				}
			},
		    title: {
		        text: '',
		        visible: false
		    },


		    xAxis: {
		        visible: false

		    },

		    yAxis: {
		        visible: false
		    },

		    legend: {
		        enabled: false
		    },

		    tooltip: {
		    	useHTML: true,
		        headerFormat: null,
		        backgroundColor:'rgba(0, 0, 0, 0.7)',
		        borderColor:'rgba(0, 0, 0, 0)',
		        borderWidth: 0,
		        style:{
		        	color:'white'
		        },
		        formatter:function(){
		        	if(this.point.v===0) return this.point.region+" 후보 없음"
		        	
		        	
		        	if(this.point.photo === 1){
			        	return "<img src='http://cryslub1.cafe24.com/dclink/portrait/"+this.point.person+".jpg' style='width:30px;height:40px;margin-right:5px;'/>"+this.point.txt + " (" +this.point.v+"%)";
		        	}else
			        	return this.point.txt + " (" +this.point.v+"%)";
		        }
		    },
		    plotOptions: {
		        series: {
		        	cursor:'pointer',
		        	tileShape:tileShape,
		        	pointPadding:pointPadding,
		            dataLabels: {
		                enabled: true,
		                format: '{point.abbreviation}',
		                fontSize:fontSize,
		                color: context.parties[party].textColor,
		                style: {
		                    textOutline: false
		                }
		            },
		            events:{
		            	click:function(e){
		            		if(!isMobile)context.history(e.point.person)
		            	}			            	
		            }
		        }
		    },

		    series: [{
		        data:data
		    }]
		}
		
		if(this.senateChart!==undefined){
			Highcharts.charts.forEach(chart => chart.reflow());
			this.senateChart.update(options,true,true);
		//	this.senateChart.mapZoom(0.8);
		}else{
			this.senateChart = Highcharts.chart('senateChart',options);				
		}
		
	}
	
	tileChart(context,rates,party){
		
	
		
		const size = Util.getSize(1024);
		
		console.log("render");
		return <div style={{'width':size.width+'px','height':(size.height*1.54)+'px',margin: '0 auto'}} id="senateChart" ref={this.tile }>
			</div>
	}
	
	draw(results,ref){
		if(results === undefined) return null;
		return <DataContext.Consumer>
	    {data=>(
	    	<div>
	  		{
	  			Object.keys(results).map((party, value)=>{
	  				if(party==5) return null;
		  			return <Button variant="light" size="sm" style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}} 
		  				onClick={()=>this.changeMapChart(results,party,ref)} key={party}>					
						{data.parties[party].name}</Button>
	  			})
	  		}
	
			<br/>
			{ref.includes('Proportion')||isMobile?null
					:<small className="text-muted">지도 클릭시 후보이력</small>
			}
			{this.mapChart(results,ref)}
			</div>
	    )}
	    </DataContext.Consumer>
	}
	
	drawSenate(results,ref){
		if(results === undefined) return null;
		return <DataContext.Consumer>
	    {data=>(
	    	<div>
	  		{
	  			this.props.statics.rateParty.map((i)=>{
	  				const party = i.party;
		  			return <Button variant="light" size="sm" style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}} 
		  				onClick={()=>this.makeTileChartOption(data,results,party)} key={party}>					
						{data.parties[party].name}</Button>
	  			})
	  		}
	
			<br/>
			{isMobile?null
			:<small className="text-muted">지도 클릭시 후보이력</small>
			}
			{this.tileChart(data,results)}
			</div>
	    )}
	    </DataContext.Consumer>
	}
	
	title(item){
		
		return <DataContext.Consumer>
	    {data=>(
	    	<>
			  	{item.name}
			  	{item.type==='광역득표'?
			  		this.draw(this.props.statics.metros,'metro')
			  		:null
			  	}
			  	{item.type==='기초득표'?
			  		this.draw(this.props.statics.basics,'basic')
					:null
			  	}
			  	{item.type==='광역비례득표'?
			  		this.draw(this.props.statics.rmetros,'metroProportion')
					:null
			  	}
			  	{item.type==='기초비례득표'?
			  		this.draw(this.props.statics.rbasics,'basicProportion')
					:null
			  	}
			  	{item.type==='득표'?
			  		this.drawSenate(this.props.statics.metros,'senate')
					:null
			  	}
			  </>
	    )}
	    </DataContext.Consumer>
		 

	}
	

	
}