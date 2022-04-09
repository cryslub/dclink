import React, { Component } from 'react';

import {Link,withRouter } from "react-router-dom";

import {withStyles } from '@material-ui/core/styles';

import Person from '@material-ui/icons/Person';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import YouTubeIcon from '@material-ui/icons/YouTube';


import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';

import PersonAvatar from './PersonAvatar.js';
import YouTubeLink from './YouTubeLink.js';

import {DataContext} from '../DataContext.js';
import PersonIcon from '@material-ui/icons/Person';

import Util from '../Util.js';


const useStyles = (theme) => ({
 	 
 
 
});


class SmallPersonCard extends Component {
	
	
	render() {
		
		 const candidate = this.props.candidate;
		 const type = this.props.type
	
		 
		 
		return <DataContext.Consumer >
		    {data=>(

				<Card style={{width:type==='presidential'?'145px':'157px'}}  elevation={0} >
					<CardHeader 
						title={type==='presidential'?candidate.txt:candidate.personName}
						titleTypographyProps={{variant:'subtitle2' }}
						style={{
							padding:'5px',
							paddingLeft:'10px',
							paddingRight:'15px',
							height:'55px',
							'color':data.parties[candidate.party].textColor,
							'backgroundColor': data.parties[candidate.party].color
						}}
						action={
			    			 <Box mt={1} ml={1}>		
			    			 {
						      		candidate.history>1&&candidate.person>0?
				      			<Tooltip title={<>{candidate.photo==1?<PersonAvatar id={candidate.person}/>:null}인물이력</>}>
								    <IconButton aria-label="settings" onClick={()=>data.history(candidate.person)}>
						          		<PersonIcon fontSize="small"
						          			style={{
				    							'color':data.parties[candidate.party].textColor,
				    							'backgroundColor': data.parties[candidate.party].color
				    						}}
						          		/>
						          	</IconButton>
					          	</Tooltip>
					          	:null
						      }
							{
								candidate.link===''?null
								:<YouTubeLink fontSize="small" link={candidate.link} color={data.parties[candidate.party].textColor}/> 
							}
					      	</Box>
				      	}/>		    				
				</Card>
		    )}
	    </DataContext.Consumer >

	}
}
	
export default withRouter((withStyles(useStyles)(SmallPersonCard)))  
