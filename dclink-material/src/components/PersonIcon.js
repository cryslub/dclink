import React, { Component } from 'react';

import {Link,withRouter } from "react-router-dom";

import {withStyles } from '@material-ui/core/styles';

import Person from '@material-ui/icons/Person';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

import YouTubeIcon from '@material-ui/icons/YouTube';



import PersonAvatar from './PersonAvatar.js';

import {DataContext} from '../DataContext.js';


import Util from '../Util.js';


const useStyles = (theme) => ({
 	 
 
 
});


class PersonIcon extends Component {
	
	
	
	render() {
		
		 const member = this.props.member;
		const link = this.props.link;
				
		return <DataContext.Consumer >
		    {data=>(
		    	<Tooltip title={<>{member.photo==1?<PersonAvatar id={member.person}/>:null}인물이력</>}>
		    		<Chip label={member.personName}  size="small"  icon={<Person style={{'color':data.parties[member.party].textColor}}/>}
 					style={{'color':data.parties[member.party].textColor,'backgroundColor': data.parties[member.party].color}}
		    		onClick={()=>data.history(member.person)}
		    		 onDelete={link===''||link===undefined?null:()=>Util.link(link)}
		    		deleteIcon={link===''||link===undefined?null:<Tooltip title="듣기" placement="top"><YouTubeIcon style={{'color':data.parties[member.party].textColor}}/></Tooltip>}
		    	></Chip>		    	
		    	</Tooltip>
		    )}
	    </DataContext.Consumer >

	}
}
	
export default withRouter((withStyles(useStyles)(PersonIcon)))  