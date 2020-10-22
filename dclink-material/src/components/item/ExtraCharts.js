import React, { Component } from 'react';


import { ResponsiveWaffle  } from '@nivo/waffle'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';



import Doughnut from '../chart/Doughnut.js';

import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';

import Util from '../../Util.js';


export default class ExtraCharts extends Component {

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
		candidates.forEach((candidate)=>{
			
			const key = candidate.party;
			data.push({
					
				id:key,
				label:context.parties[key].name,
				value:candidate.count,
				color:context.parties[key].color
			})
			total+=candidate.count
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



	render(){
		const item = this.props.item;
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<>
	    		{state.showResult==='full'?
	    			<Box m={1}>
			    		<Grid container spacing={1} >	    				
		    				 						
								{item.metros.length>0?
									item.metros[0].count>0?
									
									<Box  mb={2} mr={3}>
										<Box>
										<Box><Typography variant='caption'>{item.name} 광역의원  </Typography><Typography variant='caption'>총원{Util.sum(item.metros,'count')}명</Typography></Box>
										<Divider/>
										<Box>
	
										{this.memberChart(data,item.metros)}
										</Box>
										</Box>
									</Box>
									
									
									:null
								:null
								}
								{item.councils.length>0?
									
									<Box  mb={2} mr={3}>
										<Box>
	
											<Box ><Typography variant='caption'>{item.name} {item.type}의회 구성 </Typography><Typography variant='caption'>총원 {Util.sum(item.councils,'count')}명</Typography></Box>
											<Divider/>
											<Box >
		
											{this.memberChart(data,item.councils)}
											</Box>
										</Box>
									</Box>
								
								:null
								}
							
						
							{item.rates.length>0 && item.type!=='오버뷰'?
								
								<Box mb={2}>
									<Box ml={1}><Typography variant='caption'>비례득표</Typography></Box>
									<Divider/>
									<Box >
										<Doughnut results={item.rates} style={{width:'60px',height:'60px',marginTop:'3px'}} 
											countKey="count" idKey="party" context={data} unit="표"/>
									</Box>
								</Box>
				
							
							:null
							}
							
	
						</Grid>
					</Box>
				:null
	    		}
				</>
	    	 )}
			</DataContext.Consumer>
		 )}
		</MainContext.Consumer>
	}
}