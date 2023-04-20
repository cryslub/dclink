import React  from 'react';

import Avatar from '@material-ui/core/Avatar';

const Logo = (props)=>{
	
	var src;
	var avatar = null;
	const candidate = props.candidate
    let sx=props.style?props.style:{}

    if(props.size==='small'){
        sx.width= 24;
		sx.height= 24;
		sx.fontSize=14;
    }

	try{
		src = require(`../logo/${candidate.party}.png`);
		avatar = 	<Avatar variant="rounded"  src={src} style={sx}></Avatar>
	}
	catch(err){
		//Do whatever you want when the image failed to load here
		avatar = null

	}
	
	
	if(candidate.party === 5){
		sx.backgroundColor='grey'
		avatar = <Avatar  variant="rounded"   style={sx}>무</Avatar>
	}
	
	if(candidate.party === 0){
		avatar = null
	}
	return avatar
}

export default Logo