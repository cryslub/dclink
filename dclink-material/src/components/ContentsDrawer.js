import React, { Component } from 'react'; 

import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
 

import {DataContext} from '../DataContext.js';

 const ContentsDrawer = (props)=>{

    const scrollTo = (item)=>{
        window.scrollTo(0, item.ref.current.item.current.offsetTop-60)   
        props.toggleContents(false)
    }

    return  <DataContext.Consumer>
    {data=>(
        <Drawer
            anchor="right"
            open={props.open}
            onClose={()=>props.toggleContents(false)}
        >
        <Box
            style={{ width: 250 }}
            role="presentation"
            >
            <List>
                {Object.keys(data.items).map(function(keyName, keyIndex) {
				  			
                    const item = data.items[keyName];
                    let text=  item.name
                    if(data.currentElection.type=='presidential'){
                        text = item.personName
                    } 
                    if(data.currentState.name==='비례'){
                        text = data.parties[item.party].name
                    }

                    if(text=="") text = item.title

                    return <ListItem button key={keyName} onClick={()=>scrollTo(item)}>
                        <ListItemText primary={text} />
                    </ListItem>
                })}
            </List>
            </Box>
        </Drawer>
    )}
    </DataContext.Consumer>
}

export default ContentsDrawer