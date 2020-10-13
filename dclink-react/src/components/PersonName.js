import React, { Component } from 'react';



import Link from './Link.js';


import {DataContext} from '../DataContext.js';


export default class PersonName extends Component {
	
	render() {
		const candidate = this.props.candidate;
		const photo = candidate.photo==='1'?candidate.person:0
	    return <DataContext.Consumer>
    	{data=>(
	    	candidate.history>1?
	    		<Link text={candidate.personName}  button="추가이력"  onClick={()=>data.history(candidate.person)} photo={photo}/>
    			:<span>{candidate.personName}</span>
	    	
	    )}
    	</DataContext.Consumer>

	}
}