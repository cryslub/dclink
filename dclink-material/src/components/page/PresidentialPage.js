import React from 'react';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';

import Page from './Page.js';
import PresidentialItem from '../item/PresidentialItem.js';
import LongBar from '../chart/LongBar.js';

import {MainContext} from '../../MainContext.js';
import {DataContext} from '../../DataContext.js';


export default class PresidentialPage extends Page {

	items(items){
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<Grid container justify="space-between" direction="row">
	    			<Grid item style={{    width: 'calc(100% - 50px)'}}>
				  		{Object.keys(items).map(function(keyName, keyIndex) {
				  			
				  			const item = items[keyName];
				  			
				  			return 	<PresidentialItem item={item} key={keyIndex} index={keyIndex}/>
						})}
				  	</Grid>
				  	<Hidden xsDown implementation="css">
				  	{state.showResult!=='min'?
		  				<Box height='100%'>
							<small>득표</small>
							<LongBar data={data} items={items} type="person"/>
						</Box>
						:null
				  	}
				  	</Hidden>
		  		</Grid>
		   	 )}
		  	</DataContext.Consumer>
	   	 )}
	  	</MainContext.Consumer>

	}
	
	
	render() {
		
		const items = this.state.items;
		
	    return  <div className='m-3 presidential'>
	    	
		      	{
		      		
		      		this.items(items)
		      		
		      	}
	    </div>
	}
}