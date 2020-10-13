import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge';
import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';


import Link from './Link.js';


export default class Party extends Component {
	
	render() {
		const party = this.props.party;
	    return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		party!==undefined && party!==0?
	    			data.parties[party].subs[state.currentElection.id]?
	    			<Link text={
	    				<Badge style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color,cursor:'pointer'}} >
	    					{data.parties[party].name}
	    				</Badge>
						}  
	    				button="?"  onClick={()=>window.open(data.parties[party].subs[state.currentElection.id].link, "youtube")}/>
	    			:<Badge style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}}>{data.parties[party].name}</Badge>
	    		:null
	    	)}
	    	</DataContext.Consumer>
		)}
    	</MainContext.Consumer>	    

	}
}