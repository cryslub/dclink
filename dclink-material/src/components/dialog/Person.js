import React, { Component } from 'react';


import ReactEcharts from 'echarts-for-react';

import {withStyles } from '@material-ui/core/styles';

import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';



import StarIcon from '@material-ui/icons/Star';
import BookIcon from '@material-ui/icons/Book';
import ErrorIcon from '@material-ui/icons/Error';
import StarsIcon from '@material-ui/icons/Stars';
import InfoIcon from '@material-ui/icons/Info';

import EmojiEventsIcon from '@material-ui/icons/EmojiEvents';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import PolicyIcon from '@material-ui/icons/Policy';

import PersonInfo from '../PersonInfo.js';

import PopoverContainer from '../PopoverContainer.js'

import Party from '../Party.js';
import YouTubeLink from '../YouTubeLink.js';

import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';


import Util from '../../Util.js';



const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },	 
  avatar: {
    width:'66px',
    height:'88px'
  },
  listAvatar:{
	  minWidth:'25px',
	  marginLeft:'10px',
	  marginRight:'5px'
  },
 item:{
	 paddingLeft:0,
	 borderRadius:6
 },
 listItem:{
	 paddingLeft:'5px'
 },
 star:{
	 color: 'gold',
	 position: 'relative',
 	top: '1px'
 }
});


class Person extends Component {
	
	
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
    		        backgroundColor:'rgba(0, 0, 0, 0.5)',
        	        textStyle:{
      		        	fontSize:11
      		        },
        	    },
        	    grid: {
        	    	top:'0',
        	    	bottom:'0',

        	    	left: '0',
        	        right:'0'
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
                    itemStyle:{
                    	barBorderRadius: [0, 5, 5, 0]
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

	        	if(item.rate*100/item.total < max/8){
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
	        		        barBorderWidth: 0,
	        		        shadowBlur: 2,
	        		        shadowOffsetX: 0,
	        		        shadowOffsetY: 1,
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
				option={option}
			/>

	}
	

	ifCouncil(candidate){
		return (candidate.type==='5' || candidate.type==='6' || candidate.type==='8'|| candidate.type==='9'|| candidate.type==='10')
	}

	election(candidate,i){
		
//		console.log(candidate)
		 const { classes } = this.props;
		 const birth = candidate.birth
		 if(birth){
			if(birth.length===8){
				candidate.birth = birth.substring(0,4) + "."+birth.substring(4,6)+ "."+birth.substring(6)
			}
		}
		return <>
				{i>0?<Divider  />:null}
				<ListItem className={classes.listItem} >

				<ListItemText primary={
						<Grid container alignItems="center">
						{candidate.result==='당선'?
						<Box><StarIcon  className={classes.star} /></Box>
						:<Box ml={2}></Box>		
						}
						{candidate.electionName}
						{
							this.ifCouncil(candidate)?
							<Typography component="span" variant="caption" style={{padding:2,marginTop:2}}>{Util.typeMap[candidate.type]}</Typography>
							:null
						}
						{
				      		candidate.birth?<>

							<PopoverContainer
								type="info"
								handler={(open)=>{
									return <IconButton aria-label="settings">
										<InfoIcon fontSize="small"/>
									</IconButton>
								}}
								data = {candidate}	
								
							/>

							</>
				      		:null
				      	}
						{
							candidate.link===''?null
							:<YouTubeLink fontSize="small" link={candidate.link} />  
						}
						</Grid>} 
						secondary={<Box ml={2}>
							<Typography component="span" style={{paddingRight:2}}>{candidate.txt} </Typography>
							{
								candidate.type==='5' || candidate.type==='6'|| candidate.type==='10'?
								<Typography component="span"  variant="caption" style={{padding:2}}>{Util.getWardName(candidate,candidate.txt)}</Typography>
								:null
							}
							<Party party={candidate.party} electionId={candidate.election}/> {candidate.result} 
						</Box>} 
						/>	
				</ListItem>
			
		</>
	}
	
	inspection(data,person){
		
		 const { classes } = this.props;
		return <DataContext.Consumer>
		{data=>(
			<>
			<Typography variant="subtitle2">국정감사기록</Typography>
			<Box mt={1}>
			<Grid container>
			{
				person.inspection.map((item,i)=>{
					const color = data.parties[item.party].color;
					var icon = <BookIcon style={{'color':color}}/>
					if(item.type ==='피폭'||item.type ==='장면'){
						icon = <ErrorIcon  style={{'color':color}}/>
					}else if(item.txt==='MVP'){
						icon = <EmojiEventsIcon  style={{'color':color}}/>
					}else if(item.type ==='파이날'){
						icon = <StarsIcon  style={{'color':color}}/>
					}
					

					return <Grid item>
						<Tooltip title="듣기">						
							<ListItem button className={classes.item} >
								<ListItemAvatar className={classes.listAvatar}>
										{icon}
								</ListItemAvatar>
								<ListItemText
									onClick={()=>data.play(item.link)}
									primary= {item.txt==='MVP'?item.txt:item.name} 
									secondary={<>
									{item.department+" "+item.date.substring(0,4)}
									</>}/>
	
							</ListItem>
						</Tooltip >

					</Grid>
		
	
				})
			}
			</Grid>
			</Box>
			</>
		)}
		</DataContext.Consumer>
	}
	
	awards(person){
		var runner = null;
		const candidateLength = person.candidates.filter((candidate)=>{return candidate.result==='당선' || candidate.result==='낙선' || candidate.result==='사퇴' }).length;
		if(candidateLength>=5){
			runner =  <Chip label="꾸준출마자" icon={<DirectionsRunIcon  style={{color: 'white'}}/>}  color="primary"
					style={{backgroundColor: 'gold',marginRight:2}}/>
		}else if(candidateLength>=4){
			runner = <Chip label="꾸준출마자" icon={<DirectionsRunIcon  style={{color: 'white'}}/>}  color="primary"
				style={{backgroundColor: 'silver',marginRight:2}}/>			
		}

			  
		var inspection = null
		const max = Math.max(...Object.values(person.inspectionCount));
		if(max>=19){
			inspection = <Chip label="프로국감러" icon={<PolicyIcon  style={{color: 'white'}}/>}  color="primary"
			style={{backgroundColor: 'gold',marginRight:2}}/>
		}else if(max>=13){
			inspection = <Chip label="프로국감러" icon={<PolicyIcon  style={{color: 'white'}}/>}  color="primary"
			style={{backgroundColor: 'silver',marginRight:2}}/>			
		}

		
			  
			  
		return <Box ml={1}>
				{runner}
				{inspection}
			</Box>
	}
	
	render() {
		const self =this;
		const person = this.props.person;
		const id = this.props.id;
		if(person.candidates === undefined) person.candidates=[{}]
		
		 const { classes } = this.props;
		
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
		    {data=>(
		    	<>
	    		<Grid container>
		 			{
		 			person.candidates[0].photo>0?
		 			<Box ><Avatar  src={require(`../../portrait/${id}.jpg`)} variant="rounded" className={classes.avatar}/></Box>
		 			:null
		 			}
	 				<span className={person.candidates[0].photo?'awards':''}>
		 			{
		 				this.awards(person)
		 			}
	 				</span>

	    		</Grid>
	    		<Box mt={1}>
		    		<Paper>
			 			{	person.candidates===undefined?null
			 				:<List>{
				   	 			person.candidates.map((candidate,i)=>{
				   	 				return self.election(candidate,i);
				   	 			})
			   	 			}</List>
			 			}			 			
		 			</Paper>
	 			</Box>
	 			{
	 			state.showResult==='full'?	
	 			<Box mt={1}>
	 				{this.chart(data,person)}
	 			</Box>
	 			:null
	 			}	 			
	 			{person.inspection.length>0?
	 		 	<Box mt={1}>
	 				{this.inspection(data,person)}
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

export default withStyles(useStyles)(Person);
