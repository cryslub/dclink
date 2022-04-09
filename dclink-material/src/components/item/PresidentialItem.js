import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';

import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


import PersonIcon from '@material-ui/icons/Person';
import StarIcon from '@material-ui/icons/Star';
import YouTubeIcon from '@material-ui/icons/YouTube';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import Item from './Item.js';
import Party from '../Party.js';
import PersonCard from '../PersonCard.js';

import SmallPersonCard from '../SmallPersonCard.js';
import PersonAvatar from '../PersonAvatar.js';


import {MainContext} from '../../MainContext.js';
import {DataContext} from '../../DataContext.js';

import Util from '../../Util.js';

import Logo from '../Logo.js'



export default class PresidentialItem extends Item {
	
	title(item){
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
			{data=>(
				<>{
				item.type === '당선'?
					<StarIcon style={{color:'gold'}}/>
				:null
				}
					<Box mr={1} component="span">
						<Logo candidate={item} classes={{}} size="small"/>
					</Box>
					<Box mr={1} component="span">
						<Typography  variant={'h6'} component="span">{item.personName}</Typography>
					</Box>
					<Box mr={1} component="span">{item.party!==0?this.party(item.party):null}</Box>
					{item.history>1?<Tooltip title={<>{item.photo==1?<PersonAvatar id={item.person}/>:null}인물이력</>}>
						<IconButton aria-label="settings"  onClick={()=>data.history(item.person)}>
					          	<PersonIcon fontSize="small"/>
					    </IconButton>
					  </Tooltip>:null}
			  	</>
			)}
		    </DataContext.Consumer>
		)}
	    </MainContext.Consumer>
	}
	
	party(party){
		return <Party party={party}/> 
	}
	
	body(candidate){
		if(candidate.count===0) return null;
		return 	 <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
			{data=>(
				<>
					<Divider/>
	
					<CardContent >
						<Grid container spacing={1}>
						{	
							candidate.subs.map((sub,i)=>{
								return <Grid item key={i}>
								{sub.link===''? sub.txt
								:<Tooltip title="듣기"> 
									<Button color="primary" variant="text" onClick={()=>data.play(sub.link)} size="small"  style={{  padding:5, minHeight: 0,minWidth: 0,alignitems:'end'}}>
										{sub.txt}
									</Button>
								</Tooltip>		
								}
								</Grid>
							})
						
						}
						</Grid>
					</CardContent >
					</>
					
			)}
		    </DataContext.Consumer>			
		)}
	    </MainContext.Consumer>
	}
	
	result(data){
		return <>
			<Box component="span"> <Typography component="span"  variant="subtitle2" >{data.type}</Typography>  </Box>
			<Box  component="span"><Typography component="span"  variant="caption" >{data.code>0?this.aquired(data):null}</Typography> 
			</Box>
		</>	
	}	

	
	candidate(candidate,i){
		return 	 <MainContext.Consumer key={i}>
		{state=>(
			<DataContext.Consumer>
		    {data=>(
		    	<>	
					{state.showResult==='min'?
						<Grid item>	<SmallPersonCard candidate={candidate} type="presidential"/></Grid>
				:
					<PersonCard candidate={candidate} type="presidential" style={{margin:'10px'}}>
						{this.body(candidate)}

					</PersonCard>	
				}
				</>   
			)}
			</DataContext.Consumer>
		  )}
	    </MainContext.Consumer>
	}
	
}