import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';

import NumberFormat from 'react-number-format';

import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';


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
		return <span className="text-muted m-1" >
			<NumberFormat displayType={'text'} value={data.code} thousandSeparator={true}  />표
			<span className="m-1">({data.percent!==undefined?data.percent.toFixed(2):null}%)</span>
		</span>

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
						
						<span className="ml-1">
					  	{
					  		item.candidates !==undefined ?
					  		item.candidates.map((candidate,i)=>{
				        		return 	this.candidate(candidate,i);
				    		}) : null
				      		
				      	}
					  	</span>
				  	</>
					:<Row style={{width:'100%'}}>
				  	{
				  		item.candidates !==undefined ?
				  		item.candidates.map((candidate,i)=>{
			        		return 	this.candidate(candidate,i);
			    		}) : null
			      		
			      	}
				  	</Row>

				}
				</>
			 )}
		  	</MainContext.Consumer>
		}
	
	 
	 normalView(item){
		 return <DataContext.Consumer>
		 {data=>(
			<>
		    {
		    	this.title(item)
	    	}
		  	{	item.link !== '' ?
		  		<a href={item.link} target="youtube" style={{position:'relative',top:'0px'}}><small>듣기</small></a>
		  		:null
		  	}
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
			<div className="ml-3">
			    {
			    	this.title(item)
		    	}
			  	{	item.link !== '' ?
			  		<a href={item.link} target="youtube" style={{position:'relative',top:'0px'}}><small>듣기</small></a>
			  		:null
			  	}

			  	{this.candidates(item)}
			 </div>
		 )}
		 </DataContext.Consumer>
	 }
	 
	render() {
		const item = this.props.item;
	    return <MainContext.Consumer>
		{state=>(
			
		    	<div className="item" ref={this.item}>
		    		{
		    			state.showResult==='min'?this.minView(item)
		    			:this.normalView(item)
		    		}
		    				
			    	
			    </div>
		    
		)}
	    </MainContext.Consumer>
	}
}