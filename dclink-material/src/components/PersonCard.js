import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

import {withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';



import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import StarIcon from '@material-ui/icons/Star';
import InfoIcon from '@material-ui/icons/Info';



import Party from './Party.js';
import YouTubeLink from './YouTubeLink.js';
import PersonAvatar from './PersonAvatar.js';

import PopoverContainer from './PopoverContainer.js'

import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';

import Hidden from '@material-ui/core/Hidden';
import Logo from './Logo.js'


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
	
	cardContent(){

		const candidate = this.props.candidate;
		const { classes } = this.props;
		
		const type = this.props.type;
		var variant="subtitle1"
		
		
   	 return <DataContext.Consumer>
	    {data=>(
	    	<MainContext.Consumer>
	    	    {state=>(
	    		
		    		<div className={classes.details}>
		    	 <CardHeader
		    	 	
		    	 	style={{paddingLeft:"1px"}}
		    	 
					avatar={
		    			 <>{type==='provincial'?<Logo candidate={candidate} style={{marginLeft:15}}/>:null}</>
		    		}
					title={
		    			 <Grid container style={{alignItems:'center'}}>				    	
							{candidate.txt==='당선'?<StarIcon style={{color:'gold'}}></StarIcon>:null}
							{candidate.history>1&&type!=='presidential'?
								<Tooltip title={<>{candidate.photo===1?<PersonAvatar id={candidate.person}/>:null}인물이력</>}>
									<Link  size="large" color="primary" onClick={()=>data.history(candidate)} 
										style={{cursor:'pointer'}}>
										<Typography mb={0} component="span" variant={variant} >{candidate.personName}</Typography>
									</Link>
								</Tooltip>
							:<Typography mb={0} component="span" variant={variant} >{type==='presidential'?candidate.txt:candidate.personName}</Typography>}
							{type==='provincial'?<Box ml={1}><Party party={candidate.party} /></Box>:null}
						</Grid>
					}
		    	 	subheader={
		    			 <>{type==='provincial'&&state.currentElection.result?<>
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
				      		candidate.birth?<>
							{candidate.promises?.length>0?
							<Tooltip title="선관위 정보">
								<IconButton  onClick={()=>data.showInfo(candidate)} >
									<InfoIcon fontSize="small"/>
								</IconButton>
							</Tooltip>
							:<PopoverContainer
								type="info"
								handler={(open)=>{
									return <IconButton >
										<InfoIcon fontSize="small"/>
									</IconButton>
								}}
								data = {candidate}	
								
							/>
							}

							</>
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
		    )}
		   </MainContext.Consumer>
		 )}
		</DataContext.Consumer>
	}
	    
	
	render(){
		 const { classes } = this.props;
		
		 const self = this;
		 const type = this.props.type;
		return <DataContext.Consumer>
		    {data=>(
		    	<>
			    	<Hidden mdUp >
				    	<Card  style={{'width':type==='provincial'?330:280,'margin':type==='presidential'?'5px':''}} className={classes.card}>
				    		{self.cardContent()}				      
						</Card>
			    	</Hidden>
			    	<Hidden smDown >
	
				    	<Card  style={{'width':type==='provincial'?370:280,'margin':type==='presidential'?'5px':''}} className={classes.card}>
				    		{self.cardContent()}
					      
						</Card>
					</Hidden>
				</>
			)}
			</DataContext.Consumer>
	}
}


export default withStyles(useStyles)(PersonCard);