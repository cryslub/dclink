import React from 'react';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';


import CircleIcon from '@material-ui/icons/Lens';
import StarIcon from '@material-ui/icons/Stars';
import CancelIcon from '@material-ui/icons/Cancel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import NumberFormat from 'react-number-format';


import { makeStyles } from '@material-ui/core/styles';


import Link from '@material-ui/core/Link';

import Tooltip from '@material-ui/core/Tooltip';

import PopoverContainer from '../PopoverContainer.js'

import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';

import BarChart from './BarChart.js';

const useStyles =  makeStyles( (theme) =>({
   
    popover: {
           pointerEvents: 'none',
         },
   paper: {
       padding: theme.spacing(1),
   },
   bar :{
       height:6,	
       marginBottom: 10,
       marginTop:-10
   }
   
}));

const Ward = (props)=>{



    const classes = useStyles()
	const ward = props.ward;
	const wardKey = props.wardKey;
	const results = props.results;
	
	const wardName = props.wardName

	const [hover,setHover] = React.useState(false)

	const toggleHover = function(hover,state){
		setHover(hover)

	}


	const chartData = results?results:ward
	return  <MainContext.Consumer>
	{state=>(
		<DataContext.Consumer>
		{data=>(
		<>	
			<Box mb={hover&&state.currentElection.result==='true'?2:0}>
					<Box pt={hover&&state.currentElection.result==='true'?1:0} pb={hover&&state.currentElection.result==='true'?1:0}>
						{chartData.length>0&&chartData[0].votes>0?
						<Box className={classes.bar} style={{height:hover&&state.currentElection.result==='true'?6:0,marginBottom:hover&&state.currentElection.result==='true'?15:10}} >
							<BarChart candidates = {chartData} context={data}/>
						</Box>:null}
						<Box style={{display:'flex',alignItems:'start'}}>
							<IconButton  size="small" style={{padding:1}}>
								{hover?	
									<ExpandMoreIcon style={{fontSize:'18px'}} onClick={()=>toggleHover(false)} />
								:
									<ChevronRightIcon style={{fontSize:'18px'}} onClick={()=>toggleHover(true,state)} />
								}
							</IconButton>
							<Typography variant='caption' style={{position:'relative',top:1,color:'rgba(0, 0, 0, 0.54)',paddingRight:5,whiteSpace:'nowrap'}}>{wardName(wardKey)}</Typography>
							<Grid container>
							{ward.map(candidate=>{
								return <Grid item>
									<Box  style={{display:'flex',alignItems:'center'}}>
										<PopoverContainer
											type="info"
											handler={(open)=>{
												return <Box component="span" style={{display:'flex',alignItems:'center'}}>
													{candidate.result==='당선'?<StarIcon style={{fontSize:20,color:data.parties[candidate.party].color, filter: open?'drop-shadow(1px 3px 1px rgb(0 0 0 / 0.2))':''}}/>
													:<>
													{
														candidate.status!=='등록'?<CancelIcon  style={{fontSize:20,color:data.parties[candidate.party].color, filter: open?'drop-shadow(1px 3px 1px rgb(0 0 0 / 0.2))':''}}/>
														:<CircleIcon  style={{fontSize:20,color:data.parties[candidate.party].color, filter: open?'drop-shadow(1px 3px 1px rgb(0 0 0 / 0.2))':''}}/>
													}
													</>											
													}
												</Box>
												}
											}
											data = {candidate}	
										/>
										{
											hover?
											<>
											{candidate.history>1?
											<Tooltip title={<>인물이력</>}>
												<Link  size="large" color="primary" onClick={()=>data.history(candidate)} 
													style={{cursor:'pointer'}}>
													<Typography style={{paddingRight:3,whiteSpace:'nowrap',minWidth:40}} variant='caption'>{candidate.name}</Typography>
												</Link>
											</Tooltip>
											:<Typography style={{paddingRight:3,whiteSpace:'nowrap',minWidth:40}} variant='caption'>{candidate.name}</Typography>
											}
											</>:null
										}
									</Box>
									{candidate.votes>0&&hover?
									<Box style={{textAlign:'center'}}>									
										<Typography variant="caption" style={{color:'rgba(0, 0, 0, 0.54)'}}><NumberFormat displayType={'text'} value={candidate.votes} thousandSeparator={true}  />표</Typography>
									</Box>:null
									}
								</Grid>
							})}
							</Grid>
						
						</Box>
					</Box>
			</Box>
			
		</>
		)}
		</DataContext.Consumer>
		)}
	</MainContext.Consumer>
}


export default Ward