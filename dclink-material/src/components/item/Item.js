import React, { Component } from 'react';

import NumberFormat from 'react-number-format';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';



import YouTubeLink from '../YouTubeLink.js';


import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';


export default class Item extends Component {
	

	constructor(){
		super();
		
		 this.item = React.createRef()
	
	}
	
	title(){
		return null;
	}
	
	result(data){
		return null;
	}
	
	aquired(data){
		return <>
			<NumberFormat displayType={'text'} value={data.code} thousandSeparator={true}  />표
			<span className="m-1">({data.percent!==undefined?data.percent.toFixed(2):null}%)</span>
		</>

	}
	
	extra(){
		return null;
	}
	
	candidate(){
		return null;
	}
	
	 candidates(item){
		 
			return <MainContext.Consumer>
			{state=>(
				<>
				{
					state.showResult==='min'?<>
						
						<Box mb={2}>
							<Grid container spacing={1} alignItems="center">
						  	{
						  		item.candidates !==undefined ?
						  		item.candidates.map((candidate,i)=>{
					        		return 	this.candidate(candidate,i);
					    		}) : null
					      		
					      	}
						  	</Grid>
					  	</Box>
				  	</>
					:
					<Box mb={3}>
					  	<Grid container spacing={1} >
					  	{
					  		item.candidates !==undefined ?
					  		item.candidates.map((candidate,i)=>{
				        		return 	this.candidate(candidate,i);
				    		}) : null
				      		
				      	}
					  	</Grid>
				  	</Box>

				}
				</>
			 )}
		  	</MainContext.Consumer>
		}
	
	 
	 normalView(item){
		 return <DataContext.Consumer>
		 {data=>(
			<>
				<Grid container direction="row" alignItems="center">
					
				    {
				    	this.title(item)
			    	}
				  	{	item.link !== '' ?
				  		
				  		<YouTubeLink color="secondary" link={item.link} />
				  		:null
				  	}		  		
			  		

		  		</Grid>
		  	{
		  		this.result(item,data)
		  	}
		  	{this.candidates(item)}

		  	{
		  		this.extra(item)
		  	}
		  </>
		 )}
		 </DataContext.Consumer>
	 }
	 
	 minView(item){
		 return <DataContext.Consumer>
		 {data=>(
			<>
				<Grid container direction="row" alignItems="center">
			    {
			    	this.title(item)
		    	}
			  	{	item.link !== '' ?
			  		<YouTubeLink link={item.link} color="secondary"/>
			  		:null
			  	}
				</Grid>

			  	{this.candidates(item)}
			 </>
		 )}
		 </DataContext.Consumer>
	 }
	 
	render() {
		const item = this.props.item;
	    return <MainContext.Consumer>
		{state=>(
			
		    	<Box  ref={this.item} className="item">
		    		{
		    			state.showResult==='min'?this.minView(item)
		    			:this.normalView(item)
		    		}
		    				
			    	
			    </Box>
		    
		)}
	    </MainContext.Consumer>
	}
}