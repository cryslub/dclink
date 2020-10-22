import React, { Component } from 'react';


import {withStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';

const useStyles = (theme) => ({
	
	 
	  avatar: {
	    width:'30px',
	    height:'40px',
	    display: 'inline-block',
	    marginRight:'3px',
	    marginTop:'2px'
	    
	  },
})

class PersonAvatar extends Component {
	render(){
		const { classes } = this.props;
		const id = this.props.id;
		return <Avatar  src={require(`../portrait/${id}.jpg`)} variant="rounded" component="span" className={classes.avatar}/>
	}
}


export default withStyles(useStyles)(PersonAvatar);