import React from 'react';
import NumberFormat from 'react-number-format';


import { withStyles } from '@material-ui/core/styles';

import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';


import Divider from '@material-ui/core/Divider';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';



import Candidate from './Candidate.js';
import PersonIconC from './PersonIcon.js';
import PersonCard from './PersonCard.js';



import {MainContext} from '../MainContext.js';
import {DataContext} from '../DataContext.js';


const useStyles = (theme) => ({
	card: {
	    minWidth: 300,
	    width:'100%'
	  },
	 header:{
		height:'60px' ,
		padding:'10px'
	 },
	actions:{
		
	}
	
});


class ProvincialCandidate extends Candidate {
	
	body(candidate){
		return null
	}
	
	render() {
		const candidate = this.props.candidate;
		 
	    return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
		    {data=>(
		    	data.parties[candidate.party]===undefined?<>{candidate.party}</>
		    	:
		    		state.showResult==='min'?
		    			<Grid item>	
			    			<PersonIconC member={candidate} link={candidate.link} />
		    			</Grid>
		    		:
		    		<Grid item>
		    			<PersonCard candidate={candidate} type="provincial">
					    	{this.body(candidate)}
					    	
					    </PersonCard>
				    </Grid>
		    )}
		    </DataContext.Consumer>
		)}
		</MainContext.Consumer>

	}
}

export default withStyles(useStyles)(ProvincialCandidate);
