import React, { Component } from 'react';
import {DataContext} from '../DataContext.js';
import Party from './Party.js';
import PersonName from './PersonName.js';



export default class Candidate extends Component {
	
	body(){
		return null;
	}
	
	render() {
		const candidate = this.props.candidate;
	    return  <DataContext.Consumer>
	    {data=>(
	    	
		    <div className="card" style={{maxWidth: '21rem','borderColor':data.parties[candidate.party].color}}>
		    	<div className={candidate.txt==='당선'?'card-header champ' : 'card-header'}>
		    		
		    		{
		    			candidate.txt==='당선'?
		    			<small><span className="glyphicon glyphicon-star" style={{color: 'gold'}}></span></small> 
		    			:null
		    		}
		    		<span className="m-1">
		    		<PersonName candidate={candidate}/>
		    		
		    		</span>
		    		<Party party={candidate.party}/>
		    		{candidate.link !==''?
			    		<a  className="m-1" href={candidate.link} target="youtube"><small >듣기</small></a>
			    		:null
		    		}
		    	</div>
		    	{this.body(candidate)}
		    		
		    </div>
		    
	    )}
	    </DataContext.Consumer>
	    

	}
}