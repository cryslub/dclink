import React, { Component } from 'react';

import {Link,withRouter } from "react-router-dom";

import {withStyles } from '@material-ui/core/styles';

import Tooltip from '@material-ui/core/Tooltip';

import InfoIcon from '@material-ui/icons/Info';

import IconButton from '@material-ui/core/IconButton';


import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';

import PersonInfo from './PersonInfo.js';

import PersonAvatar from './PersonAvatar.js';
import YouTubeLink from './YouTubeLink.js';


import PopoverContainer from './PopoverContainer.js'

import {DataContext} from '../DataContext.js';


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
						title={candidate.history>1&&type!=='presidential'?
								<Tooltip title={<>{candidate.photo===1?<PersonAvatar id={candidate.person}/>:null}인물이력</>}>
									<Link onClick={()=>data.history(candidate)} 
										style={{cursor:'pointer',color:candidate.party===0?'black':data.parties[candidate.party].textColor}}>
										<>{candidate.personName}</>
									</Link>
								</Tooltip>
							:<>{type==='presidential'?candidate.txt:candidate.personName}</>}
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
								candidate.birth?<>

								<PopoverContainer
									type="info"
									handler={(open)=>{
										return <IconButton aria-label="settings"  >
											<InfoIcon fontSize="small" style={{color:data.parties[candidate.party].textColor}}/>
										</IconButton>
									}}
									data = {candidate}	
								/>

								</>
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
