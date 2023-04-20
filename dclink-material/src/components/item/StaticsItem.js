import React from 'react';


import Highcharts from 'highcharts/highmaps';
import HighchartsTilemap from "highcharts/modules/tilemap";
import { isMobile} from "react-device-detect";

import {withStyles } from '@material-ui/core/styles';

import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';


import Item from './Item.js';


import {DataContext} from '../../DataContext.js';


import Util from '../../Util.js';

HighchartsTilemap(Highcharts);


const useStyles = (theme) => ({
	
})

class StaticsItem extends Item {

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
			 if(max < rate.rate / rate.totalRate){ max = rate.rate / rate.totalRate;}
		 });
		
		 var layoutCenter = null;
		 var layoutSize = null;
		 
		
		rates[party].forEach(function(rate){
			
			var r= rate.rate / rate.totalRate;
			var code = rate.code;
			data.push({
				name:code,
				value :r,
				totalRate:rate.totalRate,
				rate:rate.rate,
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
			
			 
			const json =  require(`../../json/${code}.json`)
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
						
						const json =  require(`../../json/${c}.json`)
				    	json.features[0].properties.name = c;
				    	geoJson.features.push(json.features[0]);
						
						
					})
				})
			}
			 
		   
		   
		   const option =  {
      		 tooltip: {
  	            trigger: 'item',
        	    position:'top',
        	    backgroundColor:'rgba(0, 0, 0, 0.5)',
  	            formatter:  function (params, ticket, callback) {
  	            	if(params.data.value ===0) return '데이터 없음'
      	        	var value = (params.data.rate*100/params.data.totalRate).toFixed(2);
      	        	
      	        	if(params.data.person !== 0 && params.data.photo === 1){
            	            return "<img src='http://cryslub1.cafe24.com/dclink/portrait/"+params.data.person+".jpg' style='width:30px;height:40px;margin-right:5px;position:relative;top:2px'/><span >"+params.data.txt+" ("+ value +"%)</span>";
      	        	}else{
            	            return params.data.txt+" ("+ value +"%)";					            	        		
      	        	}
      	        },
      	        textStyle:{
  		        	fontSize:11
  		        },
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
	                        	shadowColor: 'rgba(0, 0, 0, 0.3)',
	                            shadowBlur: 3}
	                    },						                    
	                    data:data
	                }
	            ]
	        }

		   const main =document.getElementById(id);
			if(main == null ) return;
			const instance = echarts.init(main);
			instance.setOption(option);
			 
			if(!isMobile){
				instance.off('click');
				instance.on('click', function (params) {
					if(params.data.person!==undefined){					
						context.history(params.data.person);
					}
			     });
			}
		        
		     this.ref[id] = instance;
	}
	
 
	
   mapChart(results,ref){
	   
		//const option= this.makeMapChartOption(ref,results)
		
		console.log("render");
			        
		const size = Util.getSize(1024);
		
		this.results[ref] = results;
		
	      return <DataContext.Consumer>
		    {data=>(
	    		<div style={{'width':(size.width+30)+'px','height':size.height+'px',margin: '0 auto'}} id={ref}>
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
			 if(max < rate.rate / rate.totalRate){ max = rate.rate / rate.totalRate;}
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
			var r= rate.rate / rate.totalRate;

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
		        backgroundColor:'rgba(0, 0, 0, 0.5)',
		        borderColor:'rgba(0, 0, 0, 0)',
		        borderWidth: 0,
		        style:{
		        	color:'white',
		        	fontSize:'11px'
		        },
		        formatter:function(){
		        	if(this.point.v===0) return "후보 없음"
		        	
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
		            		console.log(isMobile)
		            		if(!isMobile){
		            			
		            			context.history(e.point.person)
		            		}
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
		return <Paper >
				<Box p={2}>
					<div style={{'width':size.width+'px','height':(size.width*1.4)+'px',margin: '0 auto'}} id="senateChart" ref={this.tile }/>
				</Box>
			</Paper>
	}
	
	draw(results,ref){
		if(results === undefined) return null;
		return <DataContext.Consumer>
	    {data=>(
	    	<>
	    		<Box mb={2}>
			    	<Grid container spacing={1}>
			  		{
			  			Object.keys(results).map((party, value)=>{
			  				if(party===5) return null;
				  			return <Grid item>
				  				<Chip label={data.parties[party].name}  size="small" 
				  					style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}}
			  						onClick={()=>this.changeMapChart(results,party,ref)}></Chip> 
			  				</Grid>	
			  			})
			  		}
			  		</Grid>
		  		</Box>
				{ref.includes('Proportion')||isMobile?null
						:<Grid item xs={12}><Box mb={1}><Typography   variant="caption">지도 클릭시 후보이력</Typography></Box></Grid>
				}
				<Paper>
					{this.mapChart(results,ref)}
				</Paper>
			</>
	    )}
	    </DataContext.Consumer>
	}
	
	drawSenate(results,ref){
		if(results === undefined) return null;
		return <DataContext.Consumer>
	    {data=>(
	    	<>
	    		<Grid item xs={12}>
	    			<Box mb={2}>
			    	<Grid container spacing={1}>
			  		{
			  			this.props.statics.rateParty.map((i)=>{
			  				const party = i.party;
				  			return <Grid item>
				  				<Chip label={data.parties[party].name}  size="small" 
				  					style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}}
				  					onClick={()=>this.makeTileChartOption(data,results,party)}></Chip>
				  			</Grid>
			  			})
			  		}
			  		</Grid>
			  		</Box>
		  		</Grid>
				{isMobile?null
				:<Grid item xs={12}><Box mb={1}><Typography   variant="caption">지도 클릭시 후보이력</Typography></Box></Grid>
				}
				{this.tileChart(data,results)}
			</>
	    )}
	    </DataContext.Consumer>
	}
	
	title(item){
		
		return <DataContext.Consumer>
	    {data=>(
	    	<>
	    		<Grid item xs={12}><Typography variant="h6">{item.name}</Typography></Grid>
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

export default withStyles(useStyles)(StaticsItem);