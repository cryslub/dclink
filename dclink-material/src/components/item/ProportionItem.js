import React from 'react';


import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';


import Item from './Item.js';
import Party from '../Party.js';
import Candidate from '../Candidate.js';
import SmallPersonCard from '../SmallPersonCard.js';



import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';

import Logo from '../Logo.js'


export default class ProportionItem extends Item {
	
	title(item){
		return <MainContext.Consumer>
		{state=>(
			<>
			<Box mr={1} component="span">
				<Logo candidate={item} classes={{}} size="small"/>
			</Box>
			{item.name!==''?<Box mr={1}><Typography  variant={state.showResult==='min'?'body1':'h6'} component="span">{item.name}</Typography></Box>:null}
		  	{item.party!==0?this.party(item.party):null}
		  	</>
		)}
		</MainContext.Consumer>

	}
	
	result(data){
		if(data.code>0){
			return <div>
				<Typography variant="caption" > <Box  component="span" >득표 </Box>
					{this.aquired(data)}
				</Typography>
			</div>
		}else return null;
	}	
	
	party(party){
		return <Party party={party}/>
	}
	
	candidate(candidate,i){
		return 	<MainContext.Consumer  key={i}>
		{state=>(
			<DataContext.Consumer>
			 {data=>(
				<Grid item>
				{
					state.showResult==='min'?							
						<SmallPersonCard candidate={candidate}/>
					:<Candidate candidate={candidate} key={i}/>
				}
				</Grid>
			  )}
			  </DataContext.Consumer>
		)}
		</MainContext.Consumer>
	}
	
}