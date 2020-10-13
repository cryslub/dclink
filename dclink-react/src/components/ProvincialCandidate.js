import React from 'react';
import NumberFormat from 'react-number-format';

import Card from 'react-bootstrap/Card';

import Candidate from './Candidate.js';
import Party from './Party.js';
import PersonName from './PersonName.js';
import PersonIcon from './PersonIcon.js';



import {MainContext} from '../MainContext.js';
import {DataContext} from '../DataContext.js';

import Util from '../Util.js';


export default class ProvincialCandidate extends Candidate {
	
	body(candidate){
		return <MainContext.Consumer>
		{state=>(
			<>
			{state.showResult==='full'?
				<div className="card-body">
					<strong  className="m-1">{candidate.txt}</strong> 
					<span className="text-muted">
						{candidate.rate>0?
							<>
								<NumberFormat displayType={'text'} value={candidate.rate} thousandSeparator={true}  />표 
	 							 <span> ({candidate.percent.toFixed(2)}%)</span>
							 </>
							:null
						}
					</span>
				</div>
				:null
			}
			</>
		)}
		</MainContext.Consumer>
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
		    			<PersonIcon member={candidate} text={(candidate.party===0?'':data.parties[candidate.party].name)+' '+candidate.personName} 
		    					onClick={()=>Util.link(candidate.link)} showButton={candidate.link!==''}  button="듣기"/>
		    		:
				    <Card style={{'borderColor':data.parties[candidate.party].color}} className="col-sm-1" >
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
				    		
				    </Card>
		    )}
		    </DataContext.Consumer>
		)}
		</MainContext.Consumer>

	}
}