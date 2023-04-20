import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';





import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';


import IconButton  from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import BookIcon from '@material-ui/icons/Book';
import ErrorIcon from '@material-ui/icons/Error';
import StarsIcon from '@material-ui/icons/Stars';
import YouTubeIcon from '@material-ui/icons/YouTube';



import {DataContext} from '../../DataContext.js';

import PersonIcon from '../PersonIcon.js';



export default class InspectionSection extends Component {

	render() {
		var icon;
		if(this.props.type ==='issue'){
			icon =  <BookIcon color="primary" fontSize="large"/>;
		}else if(this.props.type ==='scene'){
			icon = <ErrorIcon color="secondary" fontSize="large"/>;

		}else if(this.props.type ==='final'){
			icon = <StarsIcon style={{color:'gold'}} fontSize="large"/>;

		}
		
		

	    return <DataContext.Consumer >
	    {data=>(
	    	<Box mb={2}>
		    	<Paper>
				    <List>
						{
							this.props.items.map((item,i)=>{
								return  <>
								{
									i>0?<Divider variant="inset" component="li" />:null
								}
								<ListItem >
									<ListItemAvatar>
										{icon}
							        </ListItemAvatar>
							        <ListItemText  >
							        	<Box>
								        	<Grid container alignItems="center">
									        	<Typography
									                component="span"
									                variant="body2"
									                color="textPrimary"
									              > {item.name}
									              		<Tooltip title="듣기">
											              	<IconButton   variant="contained"  onClick={()=>data.play(item.link)}>
												  				<YouTubeIcon fontSize="small"/>
												  			</IconButton >
											  			</Tooltip>
											  		</Typography>
										  			
											</Grid>
								        	<Grid container    alignItems="center" spacing={1}>
	
											{
												item.candidates.map((member,i)=>{
													return <Grid item>
														<PersonIcon member={member} text={data.parties[member.party].name+' '+member.personName} 
															onClick={()=>data.history(member)} button="인물이력"/>
														</Grid>
												})
											}
											</Grid>
										</Box>
										</ListItemText>
									</ListItem>
								</>
							})
						}
					</List> 
				</Paper>
			</Box>
		)}
		</DataContext.Consumer >
	  
	}
}