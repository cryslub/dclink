import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import Link from './Link.js';

import {DataContext} from '../DataContext.js';


export default class PersonIcon extends Component {
	
	render() {
		const member = this.props.member;
		
		const photo = member.photo===1?member.person:0;
		const className = 'glyphicon glyphicon-user member';
				
		return <DataContext.Consumer >
		    {data=>(
		    	
		    <Link text={
					data.parties[member.party] === undefined?
					<span className={className} style={{'color': 'silver'}} ></span>
					:
					<span className={className} style={{'color': data.parties[member.party].color}} ></span>
				}  
		    	button={this.props.button}  photo={photo} onClick={this.props.onClick} extraText={this.props.text}
		    	showButton={this.props.showButton} 
		    	extra={
		    		<Button variant="link" size="sm"  onClick={()=>{data.history(member.person)}} style={{position:'relative',top:'-2px'}}>인물이력</Button>
		    	}
		    />
		    	
		    )}
	    </DataContext.Consumer >

	}
}