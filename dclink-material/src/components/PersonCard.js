import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

import {withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';

import IconButton from '@material-ui/core/IconButton';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import PersonIcon from '@material-ui/icons/Person';
import StarIcon from '@material-ui/icons/Star';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';



import Party from './Party.js';
import YouTubeLink from './YouTubeLink.js';
import PersonAvatar from './PersonAvatar.js';

import {DataContext} from '../DataContext.js';


const useStyles = (theme) => ({
	
	card: {
	    display: 'flex'
	  },
	 header:{
		height:'60px' ,
		padding:'10px'
	 },
	 details: {
	    display: 'flex',
	    flexDirection: 'column',
	    width:'100%'
	  },
	 
	  media: {           // this is the`className` passed to `CardMedia` later
	        // as an example I am modifying width and height
	    
	    marginLeft: "15px"
	  },	  
})

class PersonCard extends Component {
	
	
	onError(){
		
	}
	
	
	render(){
	
		const candidate = this.props.candidate;
		const { classes } = this.props;
		
		const type = this.props.type;
		var variant="subtitle1"
		
		var src;
	
	    var avatar;
	
		try{
	        src = require(`../logo/${candidate.party}.png`);
	        avatar = 	<Avatar variant="rounded" className={classes.media} src={src}></Avatar>
	    }
	    catch(err){
	        //Do whatever you want when the image failed to load here
	    	avatar = <Avatar variant="rounded" className={classes.media}></Avatar>
	
	    }
		
		
	    if(candidate.party == 5){
	    	avatar = <Avatar  variant="rounded" className={classes.media} style={{backgroundColor:'grey'}}>무</Avatar>
	    }
	    
	    if(candidate.party == 0){
	    	avatar = null
	    }
	    
		return <DataContext.Consumer>
		    {data=>(
		    	<Card  style={{'width':type==='provincial'?370:250,'margin':type==='presidential'?'5px':''}} className={classes.card}>
		    	
			      
			    	 <div className={classes.details}>
				    	 <CardHeader
				    	 	
				    	 	style={{paddingLeft:"1px"}}
				    	 
							avatar={
				    			 <>{type==='provincial'?avatar:null}</>
				    		}
							title={
				    			 <Grid container >				    	
									{candidate.txt==='당선'?<StarIcon style={{color:'gold'}}></StarIcon>:null}
									<Typography mb={0} component="span" variant={variant} >{type==='presidential'?candidate.txt:candidate.personName}</Typography>
									{type==='provincial'?<Box ml={1}><Party party={candidate.party}/></Box>:null}
								</Grid>
							}
				    	 	subheader={
				    			 <>{type==='provincial'?<>
						    	 	<Box component="span" mr={1}>{candidate.txt}</Box>
									<Box component="span" color="text.secondary">
										{candidate.rate>0?
											<Typography component="span" variant="caption" gutterBottom>
												<NumberFormat displayType={'text'} value={candidate.rate} thousandSeparator={true}  />표 
					 							 <span> ({candidate.percent.toFixed(2)}%)</span>
					 						</Typography> 
											:null
										}
									</Box>
									</>
									:null
				    			 }
								</>
							}
							action={
				    			 <Box mt={1} ml={1} className={classes.action}>			  
								{
						      		candidate.history>1&&type!=='presidential'?
						      			<Tooltip title={<>{candidate.photo==1?<PersonAvatar id={candidate.person}/>:null}인물이력</>}>
										    <IconButton aria-label="settings" onClick={()=>data.history(candidate.person)}>
								          		<PersonIcon fontSize="small"/>
								          	</IconButton>
							          	</Tooltip>
						      		:null
						      	}
								{
									candidate.link===''?null
									:<YouTubeLink fontSize="small" link={candidate.link} /> 
								}
						      	</Box>
					      	}
					    	
						 />
					{this.props.children}
					</div>
				</Card>
			)}
			</DataContext.Consumer>
	}
}


export default withStyles(useStyles)(PersonCard);