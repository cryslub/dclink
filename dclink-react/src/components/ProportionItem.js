import React from 'react';

import Item from './Item.js';
import Party from './Party.js';
import PersonIcon from './PersonIcon.js';
import Candidate from './Candidate.js';

import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';

import Util from '../Util.js';


export default class ProportionItem extends Item {
	
	title(data){
		return <>
		  	{data.name}{data.title}		  	
		  	{data.party!==0?this.party(data.party):null}
	  	</>

	}
	
	result(data){
		if(data.code>0){
			return <div>
				<small className="m-1">득표 
					{this.aquired(data)}
				</small>
			</div>
		}else return null;
	}	
	
	party(party){
		return <span  className="ml-1"><Party party={party}/> </span>
	}
	
	candidate(candidate,i){
		return 	<MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
			 {data=>(
				<>
				{
					state.showResult==='min'?
						<PersonIcon member={candidate} text={candidate.personName} 
							onClick={()=>Util.link(candidate.link)} showButton={candidate.link!==''}  button="듣기"/>
					:<Candidate candidate={candidate} key={i}/>
				}
				</>
			  )}
			  </DataContext.Consumer>
		)}
		</MainContext.Consumer>
	}
	
}