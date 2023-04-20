import React, { Component } from 'react';



import ProvincialPage from './page/ProvincialPage.js';
import ByPage from './page/ByPage.js';
import InspectionPage from './page/InspectionPage.js';
import PresidentialPage from './page/PresidentialPage.js';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import {DataContext} from '../DataContext.js';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import BookIcon from '@material-ui/icons/Book';

export default class Middle extends Component {
	constructor(){
		super();
		
		this.page = React.createRef();
		
	}


	componentDidUpdate(){
		if(this.page.current!==null){
			if(this.loadedElection !==this.props.currentElection || this.loadedState !==this.props.currentState){
				this.loadedElection = this.props.currentElection
				this.loadedState = this.props.currentState
				this.page.current.load(this.props.currentElection,this.props.currentState);
			}
		}
		//console.log('update');
	}
	
	
	render() {
//		console.log(this.props.currentElection)	
	    return <DataContext.Consumer>
    	{data=>(
    		<>
			<Grid container direction="row" alignItems="center">
			{this.props.currentElection.type==='inspection'?
			<BookIcon style={{marginRight:3, color:'grey'}}/>
			:<HowToVoteIcon style={{marginRight:3, color:'grey'}}/>
			}
			 <Typography  variant="subtitle1">
				{this.props.currentElection.name}
			</Typography>
			</Grid>
			<Typography  variant="h6"  >
				{this.props.currentState.name}
			</Typography>
			<Box p={2}/>
	    	{
	    		this.props.currentElection.type ==='provincial'?  <ProvincialPage  currentElection={this.props.currentElection} ref={this.page} data={data} leftSize={104}/>: null
	    	}
	    	{
	    		this.props.currentElection.type ==='by'?  <ByPage  currentElection={this.props.currentElection} ref={this.page}  data={data}/>: null
	    	}
	    	{
	    		this.props.currentElection.type ==='inspection'?  <InspectionPage  currentElection={this.props.currentElection} ref={this.page}  data={data} leftSize={300}/>: null
	    	}
	    	{
	    		this.props.currentElection.type ==='presidential'?  <PresidentialPage  currentElection={this.props.currentElection} ref={this.page}  data={data}/>: null
	    	}
			<div className="push"></div>
			</>	
    	)}
    	</DataContext.Consumer>
	}
}