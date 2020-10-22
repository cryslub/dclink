import React, { Component } from 'react';


import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

import YouTubeIcon from '@material-ui/icons/YouTube';


import YouTubeLink from '../YouTubeLink.js';
import PersonAvatar from '../PersonAvatar.js';

import Doughnut from '../chart/Doughnut.js';

import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';

import Util from '../../Util.js';



export default class ZoneItem extends Component {
	
	render() {
		const item = this.props.item;
		const title = item.title===null?'':item.title;
		const index = this.props.index;
		
	    return  <DataContext.Consumer>
		{data=>(
			 <MainContext.Consumer>
			{state=>(
					<>
					
					{index>0?<Divider/>:null}
					
					<Box pl={2} pr={2} pb={2}>
						<Grid container alignItems="center">
							<Typography component="span">{item.name + title}</Typography> 
							<YouTubeLink fontSize="small" link={item.link} /> 
							
				      	</Grid>
						<Box mb={1}>
							<Grid container spacing={1}>
							{
								item.candidates.map((candidate,i)=>{
									return <Grid item>
										
										{candidate.link===''?
											<Chip label={candidate.personName}  size="small"  
							 					style={{'color':data.parties[candidate.party].textColor,'backgroundColor': data.parties[candidate.party].color}}>
									    		</Chip>
										:<Tooltip title={<>{candidate.photo==1?<PersonAvatar id={candidate.person}/>:null}듣기</>}>
								    		<Chip label={candidate.personName}  size="small"  icon={<YouTubeIcon style={{'color':data.parties[candidate.party].textColor}}/>}
						 					style={{'color':data.parties[candidate.party].textColor,'backgroundColor': data.parties[candidate.party].color}}
								    		onClick={()=>Util.link(candidate.link)}>
								    		</Chip>		    	
								    	</Tooltip>
								    	}

									</Grid>
								})
							}
							</Grid>
						</Box>
						
						{state.showResult==='full'?
							<Grid container>
								{item.candidates.length>0?
									<Grid item>
										<Box mr={2}>
											<Typography variant="caption">후보득표</Typography>										
											<Doughnut results={item.candidates} style={{width:'40px',height:'40px'}} 
												countKey="rate" idKey="person" context={data} unit="표"/>
										</Box>
									</Grid>
								:null
								}
								{item.councils.length>0?
									<Grid item>
										<Box mr={2}>
											<Typography variant="caption">의회구성</Typography>
											<Doughnut results={item.councils} style={{width:'40px',height:'40px'}} 
												countKey="count" idKey="party" context={data} unit="명" />
										</Box>
									</Grid>
								:null
								}
								{item.rates.length>0?
									<Grid item>
										<Typography variant="caption">비례득표</Typography>
										<Doughnut results={item.rates} style={{width:'40px',height:'40px'}} 
											countKey="count" idKey="party" context={data} unit="표" />
									
									</Grid>
								:null
								}
							</Grid>
						:null
						}
						</Box>
					</>
			)}
			</MainContext.Consumer>
		)}
	     </DataContext.Consumer>
	}
}