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
//		console.log(this.props.currentElection)
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<Grid container justify="space-between" direction="row">
	    			<Grid item style={{    width: state.showResult==='full' ?'calc(100% - 50px)':'100%'}}>
				  		{Object.keys(items).map(function(keyName, keyIndex) {
				  			
				  			const item = items[keyName];
				  			const ref = React.createRef();
							if(data.items[keyName]!==undefined)
								data.items[keyName].ref = ref;
				  			return 	<PresidentialItem item={item} key={keyIndex} index={keyIndex} ref={ref}/>
						})}
				  	</Grid>
				  	<Hidden xsDown implementation="css">
						{state.showResult==='full' &&this.props.currentElection.result==='true'?
		  				<Box height='100%'>
							<small>득표</small>
							<LongBar data={data} items={items} type="person"/>
						</Box>
						:null}
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