import React from 'react';

import Box from '@material-ui/core/Box';

import { ResponsiveBar } from '@nivo/bar'

import PersonAvatar from '../PersonAvatar.js';


import Util from '../../Util.js';


const BarChart = (props)=>{

	const candidates = props.candidates
	const context = props.context

	if(candidates.length ===0 || candidates[0].party===0 ) return null; 
		
	var max = 0;
	candidates.forEach(function(candidate){
		max+= candidate.rate;
	});
	

	if(max ===0) return null;

	const data= { country: "AD"};
	const keys = [];
	candidates.forEach(function(candidate){	        	
		if(candidate.txt === '당선' || candidate.txt === '낙선'){
			data[""+candidate.id] = candidate.rate;
			data[candidate.id+"Color"] = context.parties[candidate.party].color;
			data[candidate.id+"Name"] = candidate.personName;
			data[candidate.id+"Percent"] = candidate.rate*100/max;
			data[candidate.id+"Photo"] = candidate.photo;
			data[candidate.id+"Person"] = candidate.person;
			
			keys.push(""+candidate.id) 
		}
	});
	 
	 
	
	return  <ResponsiveBar
			layout="horizontal"
			data={[data]}
			colors={({ id, data }) => data[`${id}Color`]} 
			  indexBy="country"
			  keys={keys}
			enableLabel={false}
			axisBottom={null}
			innerPadding={1}
			tooltip={({ id, value, data }) => (
				<>
					{data[`${id}Photo`]===1?
					<Box mr={1}><PersonAvatar id={data[`${id}Person`]}/></Box>
					:null}
					<span >
						{data[`${id}Name`]} : {Util.number(value)} ({data[`${id}Percent`].toFixed(2)}%)
					</span>
				</>
			)}
			theme={{
				tooltip: {
					container: {
						color:'white',
						background: 'rgba(0, 0, 0, 0.55)',
						fontSize:11,
						borderRadius: "3px"
					}
			}
		}}
		/>
}

export default BarChart