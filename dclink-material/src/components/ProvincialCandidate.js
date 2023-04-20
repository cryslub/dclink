import React from 'react';

import { withStyles } from '@material-ui/core/styles';


import Grid from '@material-ui/core/Grid';
import Candidate from './Candidate.js';
import PersonCard from './PersonCard.js';
import SmallPersonCard from './SmallPersonCard.js';


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
		    				<SmallPersonCard candidate={candidate}/>
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
