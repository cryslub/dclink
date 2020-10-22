import React, { Component } from 'react';
import { ResponsiveBar } from '@nivo/bar'


import PersonAvatar from '../PersonAvatar.js';

import Util from '../../Util.js';

export default class LongBar extends Component {

	render(){
		
		const self = this;
		const context = this.props.data;
		const items = this.props.items;
		
		var max = 0;
		Object.keys(items).forEach(function(key){
			const candidate = items[key];
        	if(candidate.code!=='' ){
        		candidate.code = parseInt(candidate.code);
	        	max+= candidate.code;
        	}
        });

        const data= { country: "AD"};
		const keys = [];
		
		Object.keys(items).forEach(function(key){
			const candidate = items[key];
			
        	if(candidate.party>0){
        		
        		data[""+candidate.party] = candidate.code;
        		data[candidate.party+"Color"] = context.parties[candidate.party].color;
        		
        		if(self.props.type==='person'){
        			data[candidate.party+"Name"] = candidate.personName;        			
        		}else{
        			data[candidate.party+"Name"] = context.parties[candidate.party].name;
        		}
        		data[candidate.party+"Percent"] = candidate.code*100/max;
        		
        		data[candidate.party+"Photo"] = candidate.photo;

        		data[candidate.party+"Person"] = candidate.person;

        		
        		keys.push(""+candidate.party) 
        		
        		
        	}
        });
        
        
        
		return  <div  style={{width: '36px', height: 'calc(100% - 50px)',position:'relative',left:'-13px'}}>
			<ResponsiveBar	
			 margin={{ top: 0, right: 0, bottom: 0, left: 16 }}
		      data={[data]}
			 reverse={true}
			colors={({ id, data }) => data[`${id}Color`]} 
		      indexBy="country"
		    	  axisLeft={null}
		      keys={keys}
				enableLabel={false}
		    	  axisBottom={null}
			tooltip={({ id, value, data }) => (
					<>
						{data[`${id}Photo`]===1?
							<PersonAvatar id={data[`${id}Person`]}/>
							:null}
			            <span style={{whiteSpace:'nowrap'}}>
			                {data[`${id}Name`]} : {Util.number(value)}표 ({data[`${id}Percent`].toFixed(2)}%)
			            </span>
		            </>
		        )}
			theme={{
		        tooltip: {
		            container: {
		            	color:'white',
		                background: 'rgba(0, 0, 0, 0.55)',
		                "position": "absolute",
		                "left": "100%",
		                "transform": "translateX(-100%)",
		                "marginTop": 0,
		                fontSize:11,
		                borderRadius: "3px"
		            }
		        }
		    }}
		    />
		</div>
	}
	
}