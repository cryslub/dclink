import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import CakeIcon from '@material-ui/icons/CakeOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';

import Party from './Party.js';
import Logo from './Logo.js'
import { Divider } from '@material-ui/core';

const PersonInfo = (props)=>{

	const candidate = props.candidate
	if(candidate==undefined) return null;

	const birth = candidate.birth
	if(birth){
	   if(birth.length===8){
		   candidate.birth = birth.substring(0,4) + "."+birth.substring(4,6)+ "."+birth.substring(6)
	   }
   }

	return <Box >
		<Box style={{display:'flex',flexDirection:'row',paddingBottom:5,alignItems:"flex-end"}}>
			<Logo candidate={candidate} size="small"  style={{marginRight:5}}/>
			{candidate.name?
			<Typography variant="subtitle2" component="span" style={{paddingRight:5}}>{candidate.name}</Typography>
			:null}
			<Typography variant="subtitle2" component="span" style={{paddingRight:5}}>{candidate.chinese}</Typography>
			<Party party={candidate.party} action={false}/>
			{
				candidate.status!=='등록'?<Typography variant="caption" component="span" style={{color:'rgba(0, 0, 0, 0.54)',paddingLeft:5}}>{candidate.status}</Typography>:null
			}
		</Box>
		<Box component="span" style={{display:'flex',alignItems:'flex-end'}}>
			<CakeIcon size="small" style={{color:'rgba(0, 0, 0, 0.54)',paddingRight:2}}/>
			<Typography variant="caption" style={{color:'rgba(0, 0, 0, 0.54)',paddingRight:5}} component="span">{candidate.birth}</Typography>
			<Typography variant="caption" style={{color:'rgba(0, 0, 0, 0.54)'}} component="span">{candidate.gender}</Typography>
		</Box>
		{candidate.address===''?null
		:<Box  style={{display:'flex',alignItems:'flex-end'}}>
			<HomeIcon size="small"  style={{ color:'rgba(0, 0, 0, 0.54)',paddingRight:2}}/>
			<Typography variant="caption" style={{color:'rgba(0, 0, 0, 0.54)'}}  component="span">{candidate.address}</Typography>
		</Box>
		}
		<Box style={{paddingTop:5}}>
			<Typography variant="body2" component="div">{candidate.education}</Typography>
		</Box>
		<Box>
			<Typography variant="body2" component="div">{candidate.career1}</Typography>
		</Box>
		<Box>
			<Typography variant="body2" component="div">{candidate.career2}</Typography>
		</Box>
	</Box>
}

export default PersonInfo