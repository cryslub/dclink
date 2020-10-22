import React, { Component } from 'react';

import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import YouTubeIcon from '@material-ui/icons/YouTube';



import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';

import Util from '../Util.js';

export default class Party extends Component {
	
	render() {
		const party = this.props.party;
	    return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		party!==undefined && party!==0?
	    			data.parties[party].subs[state.currentElection.id]?
	    				<Tooltip title="?">
	    				<Chip label={data.parties[party].name}  size="small"  icon={<YouTubeIcon style={{'color':data.parties[party].textColor}}/>}
	    					onClick={()=>Util.link(data.parties[party].subs[state.currentElection.id].link)}
	    					style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}}></Chip>
	    				</Tooltip>
	    			:<Chip label={data.parties[party].name}  size="small" 
						style={{'color':data.parties[party].textColor,'backgroundColor': data.parties[party].color}}></Chip>
	    		:null
	    	)}
	    	</DataContext.Consumer>
		)}
    	</MainContext.Consumer>	    

	}
}