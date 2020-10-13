import React, { Component } from 'react';
import {DataContext} from '../DataContext.js';

import Link from './Link.js';


export default class Icon extends Component {
	
	render() {
		const party = this.props.party;
		

		const className = 'glyphicon '+this.props.glyphicon;
	
		const color = this.props.color;
		return <DataContext.Consumer >
		    {data=>(
		    	
    		 <Link text={<span className={className} style={{'color': color?color:data.parties[party].color}} ></span>}  
    			    	button="듣기"  onClick={this.props.onClick} extraText={this.props.text}
    			    	showButton={this.props.showButton}
    			   />
		    )}
	    </DataContext.Consumer >

	}
}