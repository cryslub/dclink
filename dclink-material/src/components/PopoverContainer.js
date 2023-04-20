import React from 'react';
import Box from '@material-ui/core/Box';
import { DataContext } from '../DataContext';

  

function PopoverContainer(props){


	const type = props.type
	
	const hover = false
//	const [hover,setHover] = React.useState(false)

	const onMouseEnter = (event,data)=>{
		data.openPopover(type,event,props.data)
//		setHover(true)
	}

	const onMouseLeave = (data)=>{
		data.closePopover(type)
//		setHover(false)
	}

	return 	<DataContext.Consumer>
	{data=>(
		<Box
		aria-haspopup="true"
		
		onMouseEnter={(event)=>onMouseEnter(event,data)}
		onMouseLeave={()=>onMouseLeave(data)}
        component="span"
		style={{cursor:'pointer'}}
		>
			{props.handler(hover)}
		</Box>

	)}
	</DataContext.Consumer>	    
}

export default PopoverContainer