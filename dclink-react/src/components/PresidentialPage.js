import React from 'react';

import Row from 'react-bootstrap/Row';


import Page from './Page.js';
import PresidentialItem from './PresidentialItem.js';
import LongBar from './LongBar.js';

import {MainContext} from '../MainContext.js';
import {DataContext} from '../DataContext.js';


export default class PresidentialPage extends Page {

	items(items){
		return  <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<Row>
					<span className="p-0" style={{    width: 'calc(100% - 44px)'}}>
				  		{Object.keys(items).map(function(keyName, keyIndex) {
				  			
				  			const item = items[keyName];
				  			
				  			return 	<PresidentialItem item={item} key={keyIndex} index={keyIndex}/>
						})}
				  	</span>
				  	{state.showResult!=='min'?
		  				<span sm="auto" className="pl-2 pr-0">
							<small>득표</small>
							<LongBar data={data} items={items} type="person"/>
						</span>
						:null
				  	}
		  		</Row>
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