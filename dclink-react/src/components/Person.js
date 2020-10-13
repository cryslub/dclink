import React, { Component } from 'react';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { isMobile} from "react-device-detect";
	

import ReactEcharts from 'echarts-for-react';

import Party from './Party.js';
import Link from './Link.js';


import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';


import Util from '../Util.js';

export default class Person extends Component {
	
	
	chart(context,person){
		
        const history = person.candidates;
		
        
        var formatter = function (params, ticket, callback) {
        	if(params.componentType === "markPoint") return "";
            return params.name+" : " + Util.number(params.data.rate) +"표" ;
        }
        
        if(window.innerWidth<480){
        	 formatter = function (params, ticket, callback) {
             	if(params.componentType === "markPoint") return "";
                 return params.name+" <br/>" + Util.number(params.data.rate) +"표" ;
             }
        }
        
		var option = {
        	    tooltip : {
        	        trigger: 'item',
        	        formatter: formatter,
        	        extraCssText:'border-radius:0px;'
        	    },
        	    grid: {
        	    	top:'10',
        	    	bottom:'10',

        	    	left: '10',
        	        right:'10'
        	    },
        	    yAxis : [
        	        {
        	        	show:false,
        	            type : 'category',
        	            axisTick: {
        	                show:false
        	            },

        	            data : []
        	        }
        	    ],
        	    xAxis : [
        	        {
	        	    	show:false,
        	            type : 'value'
        	        }
        	    ],
            series: [
                {
                    type: 'bar',
                    cursor:'default',
                    markPoint: {
                    	symbolOffset:[0,-30],

                    	symbol:'circle',
                    	symbolSize:5,
                        data: [
                        ]
                    },
                    
					data:[]
                }
            ]
        };
        
    	var max = 0;
        var total=0;

    	history.forEach(function(item){
        	if(item.rate > 0){
				if(max<(item.rate*100/item.total)){
					max = item.rate*100/item.total;
					
				}
				total++;
        	}
        });
        
        history.slice(0).reverse().forEach(function(item){
        	if(item.rate > 0){

	        	option.yAxis[0].data.push(item.electionName);

	        	var position = 'insideRight';
	        	var color = context.parties[item.party].textColor;

	        	if(item.rate*100/item.total < max/10){
	        		position = 'right';
	        		color = context.parties[item.party].color;
	        	}
	        	option.series[0].data.push({
	        		value:item.rate*100/item.total,
	        		name:item.electionName,
	        		rate:item.rate,
	        		barWidth:50,
	        		itemStyle:{
	        			color:context.parties[item.party].color,
	        		    emphasis: {
	        		        barBorderWidth: 1,
	        		        shadowBlur: 10,
	        		        shadowOffsetX: 0,
	        		        shadowOffsetY: 0,
	        		        shadowColor: 'rgba(0,0,0,0.5)'
	        		    }

	        		},
	        		label: {
                        normal: {
                            show: true,
                            color:color,
                            position: position,
	                        formatter:function (params, ticket, callback) {
		        	        	var value = params.value.toFixed(2);
		        	            return value + "%" ;
		        	        }

                        }
                    }
	        	});	        	
        	}
        });
        
        
		 
		
		const height = ((total*50)+25)+"px";

		
		return   <ReactEcharts style={{width:'100%',height:height}} 
				className="pl-1"
				option={option}
			/>

	}
	
	election(candidate,i){
		
		
		return <h6 key={i} className={candidate.result==='당선'?'':'mchamp'}>
			{candidate.result==='당선'?
			<small><span className="glyphicon glyphicon-star mr-1" style={{color: 'gold'}} ></span></small>				   
			:null		
			}
			
			<Link text={candidate.txt} link={candidate.link} extraClass="election-name" button="듣기" 
				onClick={()=>window.open(candidate.link, "youtube")} extraText={candidate.txt}/>
				
			<Party party={candidate.party}/> 
			<small className="m-1"><strong>{candidate.result}</strong></small>
		</h6>
	}
	
	inspection(data,person){
		return <div className="pl-3">
			<small><strong>국정감사기록</strong></small>
			<div>
			{
				person.inspection.map((item,i)=>{
					var icon = 'glyphicon-book'
					if(item.type ==='피폭'||item.type ==='장면'){
						icon = 'glyphicon-alert'
					}else if(item.txt==='MVP'){
						icon = 'glyphicon-king'
					}else if(item.type ==='파이날'){
						icon = 'glyphicon-tower'
					}
					
					var trigger = ['focus']
					if(isMobile){
						trigger = ['focus','hover']
					}
					
					return <>{isMobile?
						
						<OverlayTrigger
						    placement="bottom"
						    trigger={trigger}
						    overlay={ <Popover id="popover-basic">
							    <Popover.Title as="h3">{item.name}</Popover.Title>
							    <Popover.Content>									    
							      <span className="mr-1">{item.department}</span>
							      <small className="text-muted mr-1"> {item.date.substring(0,4)}</small>
							      <Button size="sm" variant="link" href={item.link} target="youtube"  style={{position:'relative',top:'-1px'}}>듣기</Button>
							    </Popover.Content>
							  </Popover>}
						  >
							<Button variant="link" className="mr-1 link" key={i}>
								<span className={'glyphicon '+icon} style={{'color':data.parties[item.party].color}}></span>
							</Button>
						</OverlayTrigger>
						:<OverlayTrigger
							placement="top"
						    trigger='hover'
						    overlay={ 
								<Tooltip id="button-tooltip" >
									{item.name}	<br/>
									[ <small>{item.department}</small><small className="ml-1" style={{color:'#eeeeee'}}> {item.date.substring(0,4)}</small> ]
								</Tooltip>}
						  >
							<Button variant="link" className="mr-1 link" key={i} href={item.link} target="youtube">
								<span className={'glyphicon '+icon} style={{'color':data.parties[item.party].color}}></span>
							</Button>
						</OverlayTrigger>
					}
					</>
				})
			}
			</div>
		</div>
	}
	
	awards(person){
		var runner = null;
		const candidateLength = person.candidates.filter((candidate)=>{return candidate.rate>0}).length;
		if(candidateLength>=5){
			runner = <span className="glyphicon glyphicon-knight" style={{color: 'gold'}}></span> 
		}else if(candidateLength>=4){
			runner = <span className="glyphicon glyphicon-knight" style={{color: 'silver'}}></span> 			
		}

		if(runner!=null)
		runner= <OverlayTrigger
			    placement="top"
			    overlay={ <Tooltip id="button-tooltip" >꾸준출마자</Tooltip>}
			  >
			{runner}
			  </OverlayTrigger>

			  
		var inspection = null
		const max = Math.max(...Object.values(person.inspectionCount));
		if(max>=19){
			inspection = <span className="glyphicon glyphicon-bishop" style={{color: 'gold'}}></span> 
		}else if(max>=13){
			inspection = <span className="glyphicon glyphicon-bishop" style={{color: 'silver'}}></span> 			
		}

		
		if(inspection!=null)
			inspection= <OverlayTrigger
			    placement="top"
			    overlay={ <Tooltip id="button-tooltip" >프로국감러</Tooltip>}
			  >
			{inspection}
			  </OverlayTrigger>

			  
			  
		return <> 
				{runner}
				{inspection}
			</>
	}
	
	render() {
		const self =this;
		const person = this.props.person;
		const id = this.props.id;
		if(person.candidates === undefined) person.candidates=[{}]
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
		    {data=>(
		    	<div className='text-muted'>
		    		<Row className="mb-1" style={{paddingLeft:'32px'}}>
		 			{
		 			person.candidates[0].photo>0?
		 			<Image  className=" mb-2 mr-2" src={require(`../portrait/${id}.jpg`)} style={{width: '66px', height: '88px'}} alt="" ></Image>
		 			:null
		 			}
	 				<span className={person.candidates[0].photo?'awards':''}>
		 			{
		 				this.awards(person)
		 			}
	 				</span>

		    		</Row>

		 			{	person.candidates===undefined?null
		 				:<>{
			   	 			person.candidates.map((candidate,i)=>{
			   	 				return self.election(candidate,i);
			   	 			})
		   	 			}</>
		 			}
		 			{
		 			state.showResult==='full'?	
		 				this.chart(data,person)
		 			:null
		 			}
		 			{person.inspection.length>0?
		 				this.inspection(data,person)
		 			:null
		 			}
												
		 		</div>
	 		)}
	 		</DataContext.Consumer>
 		)}
 		</MainContext.Consumer>
		
	}
	
	
}