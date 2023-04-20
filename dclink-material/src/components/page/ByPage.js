import React from 'react';
import Page from './Page.js';

import ProvincialItem from '../item/ProvincialItem.js';


import {DataContext} from '../../DataContext.js';



export default class ByPage extends Page {

	items(items){
		const self = this;
		
		return 	<DataContext.Consumer>
		{data=>(
			<>
			{Object.keys(items).map(function(keyName, keyIndex) {
				
				const item = items[keyName];
				const ref = React.createRef();
				if(data.items[keyName]!==undefined)
					data.items[keyName].ref = ref;
				return <ProvincialItem item={item} key={keyIndex} currentElection={self.props.currentElection} ref={ref}/>
			})}
			</>
		)}
		</DataContext.Consumer>

	}
	
	
	render() {
		
		const items = this.state.items;
		
	    return <>	    	
		      	{this.items(items)}
		 </>
	}
}