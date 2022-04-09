import React, { Component } from 'react';

import {withStyles } from '@material-ui/core/styles';

import Dialog from '@material-ui/core/Dialog';
import Hidden from '@material-ui/core/Hidden';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import FullDialog from './FullDialog.js';


const useStyles = (theme) => ({
	
	 content: {
		    backgroundColor:theme.palette.background.default
		  },
	title: {
	    backgroundColor: theme.palette.primary.main,
	   color: 'white'
	    
	  }
})

class ResponsiveDialog extends Component {
	render() {
		 const { classes } = this.props;
		
		return  <>
			<Hidden smUp >
				<FullDialog
				open={this.props.open}
				close={this.props.close}
				title={ this.props.title}>
			
				{this.props.children}
				</FullDialog>
			</Hidden>
			<Hidden xsDown >
				<Dialog onClose={this.props.close} open={this.props.open} fullWidth={true}
					maxWidth='md'
					classes={{
				        paper: classes.content
				      }}
				  >
					<DialogTitle className={classes.title}>{this.props.title}</DialogTitle>
					<DialogContent >
						{this.props.children}
					</DialogContent>
				</Dialog>
			</Hidden>
		</>
	      	
	}
	
}


export default withStyles(useStyles)(ResponsiveDialog);