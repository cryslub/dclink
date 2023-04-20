import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core/styles';


import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';



import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Grid from '@material-ui/core/Grid';

import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import MapIcon from '@material-ui/icons/Map';
import BookIcon from '@material-ui/icons/Book';


import AssessmentIcon from '@material-ui/icons/Assessment';
import PieChartIcon from '@material-ui/icons/PieChart';
import FaceIcon from '@material-ui/icons/Face';




import Header from './Header.js';

import ContentsDrawer from './ContentsDrawer.js';


const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    zIndex: theme.zIndex.drawer + 1,

  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toggleContainer:{
	  margin:theme.spacing(1),
  },
  nested: {
	    paddingLeft: theme.spacing(4),
	  },
  footer: {
	    ...theme.typography.button,
	    verticalAlign: 'middle',
	    display: 'inline-flex',
	    minHeight:'85px'
	  },
}));

function ResponsiveDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [open, setOpen] = React.useState([])
  
  const [contentsOpen, setContentsOpen] = React.useState(false)
  
  
  
  const handleDrawerToggle = (open) => {
    setMobileOpen(open);
  };
  
  const selectState = (election,state)=>{
	  props.selectState(election,state)
	  handleDrawerToggle(false);
  }
  const handleClick = (election,i)=>{
	  if(election.states.length>1){
		  open[i] = !open[i]
		  
		  setOpen(open=>[...open]);
		  
		  
	  }else{
		  
		  props.selectState(election,election.states[0])
		  handleDrawerToggle(false);
//		  props.selectElection(election);
		  
	  }
  }
  
  useEffect(function mount() {
   
  });

  const drawer = (
		 <>
		 
		
        
        <div className={classes.toolbar} >
        	<Grid container justify="center" alignItems="center" style={{height:'100%'}}>
        	<Box>
		        <ToggleButtonGroup
			        value={props.showResult}
			        exclusive
			        onChange={props.changeShowResult}
			        aria-label="text alignment"
			        	className={classes.toggleButton}				
			     >
			        <ToggleButton value="full" aria-label="left aligned">
			        	<Box style={{position:'relative',top:'1px',paddingLeft:'1px'}}>전체보기</Box>
			        </ToggleButton>
			        <ToggleButton value="min" aria-label="right aligned">
			         	<Box style={{position:'relative',top:'1px',paddingLeft:'1px'}}>간략히</Box>
			        </ToggleButton>
			     </ToggleButtonGroup>
		     </Box>
		     </Grid>
		    </div>
        <Divider />

	      
        <List component="nav" dense={true}>
	          {
	        	  props.elections.map((election,i)=>{
	        		
	        		  return  <>
	        		  	<ListItem button selected={election.id === props.currentElection.id} onClick={()=>handleClick(election,i)} key={i}>
		        		  <ListItemIcon>
		        		  	<>
		                  	{election.type==='by'?<HowToVoteIcon/>:null}
		                  	{election.type==='provincial'?<HowToVoteIcon/>:null}
		                  	{election.type==='presidential'?<HowToVoteIcon/>:null}

		                  	{election.type==='inspection'?<BookIcon/>:null}

		                  	</>
		                  </ListItemIcon>
		                  <ListItemText primary={election.name}  />
		                  {election.states.length>1?open[i] ? <ExpandLess /> : <ExpandMore />:null}
		                </ListItem>
		                {
		                	election.states.length>1?
		                	<Collapse in={open[i]} timeout="auto" unmountOnExit>
			                    <List component="div" disablePadding dense={true}>
			                    	{election.states.map((state,i)=>{
			                    		if(state.name==='') return null
					                      return <ListItem button className={classes.nested} onClick={()=>selectState(election,state)}
			                    				selected={state.id === props.currentState.id} key={'state'+i}>
					                        <ListItemIcon>
					                        	{election.type==='provincial'?
					                        		state.name==='비례'?
					                        		<PieChartIcon/>
					                        		:state.name==='통계'?
							                        	<AssessmentIcon/>
					                        		:<MapIcon/>
					                        	:null}
					                        	{election.type==='inspection'?<AccountBalanceIcon/>:null}
					                        </ListItemIcon>
					                        <ListItemText primary={state.name} />
					                      </ListItem>			                    		
			                    	})}
			                    </List>
			                  </Collapse>
		                	:null
		                }
		               </>
	        	  })
	          }

	     </List>
	     
	     
	     <Box bgcolor="text.primary" className={classes.footer} color="background.paper"  p={1} height="100%">
	     	
	     	<Box  mr={1}><FaceIcon/> </Box> 본 페이지는 개인이 심심해서 만든 페이지이며 xsfm과는 관련이 없습니다.
	     </Box>

	     
	  </>

  );

  const toggleElections = (open) => {
  

	  setMobileOpen(open);
  }
	

  const toggleContents = (open)=>{
    setContentsOpen(open)
  }

  
  const container = window !== undefined ? () => window().document.body : undefined;
  const scrollbarVisible = window !== undefined ? window.visualViewport.width < window.innerWidth:false;
  console.log(scrollbarVisible);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header toggleElections={toggleElections} toggleContents={toggleContents} search={props.search} />
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden mdUp >
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={()=>handleDrawerToggle(false)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown >
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>

        
					<ContentsDrawer open={contentsOpen} toggleContents={toggleContents}/>
      </nav>
      <main className={classes.content} >
        <div className={classes.toolbar} />
        	{props.children}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;