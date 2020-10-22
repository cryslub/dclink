import React, { Component } from 'react';
import PersonCard from './PersonCard.js';

import {DataContext} from '../DataContext.js';


export default class Candidate extends Component {
	
	body(){
		return null;
	}
	
	render() {
		const candidate = this.props.candidate;
	    return  <DataContext.Consumer>
	    {data=>(
	    	
	    	<PersonCard candidate={candidate}>
		    	{this.body(candidate)}
		    		
		    </PersonCard>
		    
	    )}
	    </DataContext.Consumer>
	    

	}
}