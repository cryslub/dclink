import React, { Component } from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

import YouTubeIcon from '@material-ui/icons/YouTube';

import Util from '../Util.js';

export default class YouTubeLink extends Component {
	render(){
		
		const link = this.props.link;
		const color = this.props.color;
		
		return <Tooltip title="듣기">
			<IconButton aria-label="settings"  onClick={()=>Util.link(link)}>
				<YouTubeIcon fontSize="small" style={{color:color}}/>
			</IconButton>
		</Tooltip>
	}
}