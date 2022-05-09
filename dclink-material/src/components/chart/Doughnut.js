import React, { Component } from 'react';

import { ResponsivePie } from '@nivo/pie'


import PersonAvatar from '../PersonAvatar.js';

import {DataContext} from '../../DataContext.js';
import Util from '../../Util.js';


export default class Doughnut extends Component {
		
	render(){
		
		const results = this.props.results;
		const context = this.props.context;
		
		const data = []

		if(results !== undefined){

			var countKey = this.props.countKey;
			const idKey = this.props.idKey;
			if(countKey===undefined) countKey = 'count'
			
			const half = this.props.half;
			const unit = this.props.unit;
			const sum = Util.sum(results,countKey);
			
			results.forEach((result)=>{
				const key  =result[idKey];
				data.push({
					id:key,
					value:result[countKey],
					label:idKey==='person'?result.personName:context.parties[key].name,
					color:idKey==='person'?context.parties[result.party].color:context.parties[key].color,
					photo:result.photo
				})
				
			})
			
			var tooltip=({ id, value, label,photo }) => (
					<>
					{photo===1?
						<PersonAvatar id={id}/>
						:null}
		            <span style={{whiteSpace:'nowrap'}}>
		                {label} : {Util.number(value)}{unit} {unit==='표'?<>({(value*100/sum).toFixed(2)}%)</>:null}
		            </span>
		         </>
		     )
		     
			if(window.innerWidth<480){
				tooltip=({ id, value, label,photo}) => (
						<>
						{photo===1?
							<PersonAvatar id={id}/>
							:null}
			            <span style={{whiteSpace:'nowrap'}}>
			                {label} 
			            </span>
			             <div style={{whiteSpace:'nowrap'}}>
			             	{Util.number(value)}{unit} {unit==='표'?<>({(value*100/sum).toFixed(2)}%)</>:null}
			             </div>
			         </>
			     )
			}
			
			
			
			
			return  <DataContext.Consumer>
	    	{context=>(
	    		<div style={this.props.style}>
				  <ResponsivePie
			        data={data}
			        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}	       
				  	innerRadius={half?0.3:0.45}
				  	startAngle={half?-90:0}
				  	endAngle={half?90:360}
					  padAngle={1}
					 
				  	enableRadialLabels={false}
			        enableSlicesLabels={false}
					colors={{ datum: 'color' }}

				  	tooltip={tooltip}
					theme={{
						tooltip: {
							container: {
								color:'white',
								background: 'rgba(0, 0, 0, 0.55)',
								"position": "absolute",
								fontSize:11,
								borderRadius: "3px"
				               
							},
							tableCell: {padding: "3px 1px"}
						}
					}}
			    />
				</div>
	    	 )}
	    	</DataContext.Consumer>
		}else return null
	}
}