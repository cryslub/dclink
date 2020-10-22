import React from 'react';
import Page from './Page.js';

import ProvincialItem from '../item/ProvincialItem.js';


export default class ByPage extends Page {

	items(items){
		return <>
  		{Object.keys(items).map(function(keyName, keyIndex) {
  			
  			const item = items[keyName];
  			
  			return <ProvincialItem item={item} key={keyIndex}/>
		})}
  		</>

	}
	
	
	render() {
		
		const items = this.state.items;
		
	    return <>	    	
		      	{this.items(items)}
		 </>
	}
}