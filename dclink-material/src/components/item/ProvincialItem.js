import React from 'react';



import ReactEcharts from 'echarts-for-react';

import {withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import IconButton  from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';


import DescriptionIcon from '@material-ui/icons/Description';

import { ResponsiveWaffle  } from '@nivo/waffle'



import ProvincialCandidate from '../ProvincialCandidate.js';
import Item from './Item.js';
import ExtraCharts from './ExtraCharts.js';


import BarChart from './BarChart.js';
import Ward from './Ward.js';
import ParliamentChart from './ParliamentChart.js'


import Doughnut from '../chart/Doughnut.js';


import PopoverContainer from '../PopoverContainer.js'

import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';


import Util from '../../Util.js';

const useStyles =  (theme) =>({
   
	 popover: {
		    pointerEvents: 'none',
		  },
	paper: {
		padding: theme.spacing(1),
	},
	bar :{
		height:6,	
		marginBottom: 10,
		marginTop:-10
	}
	
});

const	wardName = (name) => {
	if(name===undefined) return ''
	if(name==='선거구') return ''
	if(name.length>6) return name.replace('선거구','')
	return name
//	var matches = name.match(/(\d+)/);
//	if(matches)
//		return matches[0]+"선거구"
//	else return "1선거구"
}
	

const Metro = (props)=>{

	const item = props.item

	return <>
		{
			Object.keys(item.metroWards).length>0?
			<Candidates title="광역의원" wards={item.metroWards} wardName={wardName}/>:null
		}
	</>
}


const Basic = (props)=>{

	const item = props.item

	return <Candidates title="기초의원" wards={item.basicWards} wardName={wardName}/>
}


const Candidates = (props)=>{

	const wards = props.wards
	const wardName = props.wardName
	const results = props.results


	return <DataContext.Consumer>
		{data=>(
		<>	
		{Object.keys(wards).length>0?
		<Grid item>
			<Box style={{maxWidth:1500}}>
				<Box><Typography variant='caption'>{props.title}  </Typography></Box>
				<Divider/>
				{Object.keys(wards).map(key=>{
					const ward = wards[key]
					return <Ward ward={ward} wardName={wardName} wardKey={key} results={results}/>
				})}
			</Box>
		</Grid>
		:null
		}
		</>
		)}
	</DataContext.Consumer>
}

class ProvincialItem extends Item {
	
	constructor(){
		super();
		
		this.state = {
			item:{},
			bar:()=> {return null},
			anchorEl:null

		}
		
	
	}
	
	
	zoomedMapChart(context,code,geoJson){
		var parent = code.substring(0,2);
		  
    	const parentJson = require(`../../json/${parent}.json`) 
		 
	        
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
	        
	        return <ReactEcharts option={option} style={{width: '300px', height: '280px'}}/>
	}
	
	 handlePopoverOpen = (event) => {
		 this.setState({anchorEl:event.currentTarget});
	 };

	 handlePopoverClose = () => {
		 this.setState({anchorEl:null});

	 };
		  
		  
	 mapChart(code){
		
	

		 const echarts = require('echarts');
		
		
		 code = code+"";
		var arr = code.split(",");
		
		var geoJson = {features: [],type:"FeatureCollection"};
		
		
		arr.forEach(async function(item){
			try {
				const json = require("../../json/"+item+".json") 

				geoJson.features.push(json.features[0]);
			}catch{

			}
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
			<PopoverContainer 
				type="map"
				handler={(open)=>{
					return <ReactEcharts option={option} style={{width: '30px', height: '30px',display: 'inline-block'}} className="map"/>
				}}
				data={{data,code,geoJson}}/>
		)}
		</DataContext.Consumer>
		
	}
	
	 
	
	 
	 
	title(item){
		
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
			{data=>(
	    		<>
		    		{item.code!==''?
		    			<Box>
		    			{this.mapChart(item.code)}
		    			</Box>
					:null
		    		}
					<Box ><Typography  variant={state.showResult==='min'?'body1':'h6'} component="span">{item.name}{item.title} </Typography></Box>
					{(item.zone===null||item.zone==='')?null
						:<Tooltip title="지역이력">
						  	<IconButton   variant="contained" onClick={()=> data.zoneHistory(item.zone)}>
					  			<DescriptionIcon fontSize="small"/>
						     </IconButton >
				  		</Tooltip>
					}
			  	</>
			  )}
		  	</DataContext.Consumer>
		 )}
	  	</MainContext.Consumer>
	}

	
	getCouncilSize = function(total){
	
		var width =0,height=0;

		//		if(total<=36){
		width=Math.sqrt(total);
		width = Math.trunc(width)+(width-Math.trunc(width)>0?1:0)
		
		if(width<10){
			width =10;
		}
		
		height = Math.trunc(total/width)+1
		
		if(height>5){
			height=5
			width = Math.trunc(total/height)+1
			
			if(window.innerWidth<480 && width>22){
				while(width>22){
					height++;
					width = Math.trunc(total/height)+1
				}				
				
			}

			
		}
		
		
		
		return {width:width,height:height};
		
	}
	
	
	memberChart(context,candidates){
		
	
		const data = []
		
		var total=0;
		Object.keys(candidates).forEach((key)=>{
			
			const candidate = candidates[key]

			data.push({
					
				id:key,
				label:context.parties[key].name,
				value:candidate,
				color:context.parties[key].color
			})
			total+=candidate
		})
		
		const CustomCell = ({
		    position,
		    size,
		    x,
		    y,
		    color,
		    fill,
		    opacity,
		    borderWidth,
		    borderColor,
		    data,
		    onHover,
		    onLeave
		}) => (
		    <circle
		        r={size / 2}
		        cx={x + size / 2}
		        cy={y + size / 2}
		        fill={fill || color}
		        strokeWidth={borderWidth}
		        stroke={borderColor}
		        opacity={opacity}
		        onMouseEnter={onHover}
		        onMouseMove={onHover}
		        onMouseLeave={onLeave}
	
		    />
		)
		
		var tooltip = ({ id, value, data }) => (
				<>
		            <span style={{whiteSpace:'nowrap'}}>
		                {context.parties[id].name} : {Util.number(value)}명
		            </span>
	            </>
	        )
		var container =  {
			color:'white',
			background: 'rgba(0, 0, 0, 0.55)',
			position:'absolute',
			"right": "-100%",
			"transform": "translateX(calc(100% + 25px))",
			fontSize:11,
			borderRadius: "3px"
		}
		
		if(window.innerWidth<480){
			container = {
            	color:'white',
                background: 'rgba(0, 0, 0, 0.55)',
                "position": "absolute",
                "right": "100%",
                "transform": "translateX(100%)",
                "marginTop": 0,
                fontSize:11,
    			borderRadius: "3px"
            }
            tooltip = ({ id, value, data }) => (
				<>
		            <span style={{whiteSpace:'nowrap'}}>
		                {context.parties[id].name} <br/> {Util.number(value)}명
		            </span>
	            </>
	        )
		}
		
		const size = this.getCouncilSize(total);
		return  <div style={{width:((size.width*15)+10)+'px',height:((size.height*15)+10)+'px'}}>
			<ResponsiveWaffle
		        data={data}
		        total={size.width*size.height}
		        rows={size.height}
		        columns={size.width}
		        fillDirection="top"
		        padding={2}
		        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
		        emptyColor="#ffffff"
		        emptyOpacity={0}
				colors={{ datum: 'color' }}
		        borderColor={{ from: 'color', modifiers: [ [ 'darker', '0' ] ] }}
		        
				tooltip={tooltip}
				theme={{
					tooltip: {
						container: container
					}
				}}
				cellComponent={CustomCell} 
		    />
	    </div>
	}

	
	council(item){
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
			{data=>(
				<>
				{state.currentElection.type!='by'&&Object.keys(item.councils).length>0?
				<Grid item>						
					<Box >

							<Box ><Typography variant='caption'>{item.type}의회 결과 </Typography></Box>
							<Divider/>
							<Box style={{textAlign: '-webkit-center'}}>
								<Typography variant='caption'>총원 {Object.keys(item.councils).map((k) => item.councils[k]).reduce((prev, next) => prev + next)}명</Typography>
								<Doughnut results={Object.keys(item.councils).map(key=>{return{party:key,count:item.councils[key]}})} style={{width:'60px',height:'60px',marginTop:'-1px'}} 
													countKey="count" idKey="party" context={data} unit="명" />
							</Box>
					</Box>
				</Grid>:null
				}
				</>		
			)}
			</DataContext.Consumer>
		)}
		</MainContext.Consumer>
	}
	

	result(item,context){
		
		if(item.candidates.length ===0 || item.candidates[0].party===0 || this.props.currentElection?.result!=='true') return null; 
		
		return <div  className="bar">
			<BarChart candidates = {item.candidates} context={context}/>
		</div>
	}
	
		
	candidate(candidate,i){
		return 	<ProvincialCandidate candidate={candidate} key={i}/>;
	}
	
	extra(item){
		if(item.type==='기초' ||item.type==='광역' )
			return <DataContext.Consumer>
			{data=>(
	    		<>
				{
					item.type==='기초'?<Grid container  spacing={2} style={{paddingBottom:10}}>
						<Metro item={item}/>
						<Basic item={item}/>
						<Candidates title="기초비례" wards={item.rateWards} wardName={(key)=>('')} results={item.rates}/>
						<Candidates title="교육의원" wards={item.eduWards} wardName={wardName}/>
						{this.council(item)}
					</Grid>:null
				}
				{
					item.type==='광역'?<Grid container  spacing={2} style={{paddingBottom:10}}>
						<Metro item={item}/>
						<Candidates title="광역비례" wards={item.rateWards} wardName={(key)=>('')}  results={item.rates}/>
						{this.council(item)}

					</Grid>:null
				}
					
				</>
			  )}
		  	</DataContext.Consumer>
		return null;
	}
	
}
		
		

export default withStyles(useStyles)(ProvincialItem);