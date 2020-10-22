import React, { Component } from 'react';

import {fade,withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';

import CloseIcon from '@material-ui/icons/Close';


import {MainContext} from '../../MainContext.js';


const useStyles = (theme) => ({
	 search: {
	    position: 'relative',
	    borderRadius: theme.shape.borderRadius,
	    backgroundColor: fade(theme.palette.common.white, 0.15),
	    '&:hover': {
	      backgroundColor: fade(theme.palette.common.white, 0.25),
	    },
	    marginLeft: 0,
	    width: '100%',
	    [theme.breakpoints.up('sm')]: {
	      marginLeft: theme.spacing(1),
	      width: 'auto',
	    },
	  },
	  searchIcon: {
	    padding: theme.spacing(0, 2),
	    height: '100%',
	    position: 'absolute',
	    pointerEvents: 'none',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'center',
	  },
	  inputRoot: {
		    color: 'inherit',
	  },
	  brand:{
		 '&:hover': {
			 color:'white'  ,
			 textDecoration: 'none'
		 },
		color:'white'  
	  },
	  inputInput: {
	    padding: theme.spacing(1, 1, 1, 0),
	    // vertical padding + font size from searchIcon
	    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
	    transition: theme.transitions.create('width'),
	    width: '50%',
	    [theme.breakpoints.up('sm')]: {
	      width: '6ch',
	      '&:focus': {
	        width: '10ch',
	      },
	    },
	  },
	  content: {
	    flexGrow: 1,
	    padding: theme.spacing(3),
	    backgroundColor:theme.palette.background.default
	  },
	  toolbar: theme.mixins.toolbar,
	
})

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


class FullDialog extends Component {
	

	handleClose = () => {
		this.props.close()
	  };

	
	render(){
		 const { classes } = this.props;
		 
		return  <MainContext.Consumer>
		{state=>(
				<Dialog fullScreen open={this.props.open} onClose={this.handleClose} TransitionComponent={Transition}>
		        <AppBar className={classes.appBar} elevation={0}>
		        <Toolbar>
		          <IconButton edge="start" color="inherit" onClick={this.handleClose} aria-label="close">
		            <CloseIcon />
		          </IconButton>
		          {
		          	this.props.title
		          }
		        </Toolbar>
		      </AppBar>
		      <main className={classes.content}>
		        <div className={classes.toolbar} />
			     {this.props.children}						
		        </main>
		    </Dialog>
		)}
		</MainContext.Consumer>
	}
}

export default withStyles(useStyles)(FullDialog);