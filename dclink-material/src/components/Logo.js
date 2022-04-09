import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';

const Logo = (props)=>{
	
	var src;
	var avatar = null;
	const candidate = props.candidate
	const classes = props.classes
    let sx={}

    if(props.size=='small'){
        sx={width: 24, height: 24 }
    }

	try{
		src = require(`../logo/${candidate.party}.png`);
		avatar = 	<Avatar variant="rounded" className={classes.media} src={src} style={sx}></Avatar>
	}
	catch(err){
		//Do whatever you want when the image failed to load here
		avatar = null

	}
	
	
	if(candidate.party == 5){
		avatar = <Avatar  variant="rounded" className={classes.media} style={{backgroundColor:'grey'}} style={sx}>무</Avatar>
	}
	
	if(candidate.party == 0){
		avatar = null
	}
	return avatar
}

export default Logo