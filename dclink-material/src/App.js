import './App.css';
import Main from './Main.js';

import { withStyles } from "@material-ui/core/styles";

import 'typeface-roboto';
import './css/glyphicon.css';
import './css/main.css';

const styles = theme => ({
	  "@global": {
	    // MUI typography elements use REMs, so you can scale the global
	    // font size by setting the font-size on the <html> element.
	    html: {
	      fontSize: '0.8rem',
	      [theme.breakpoints.up("sm")]: {
	        fontSize:'0.8rem'
	      },
	      [theme.breakpoints.up("md")]: {
	        fontSize: '0.8rem'
	      },
	      [theme.breakpoints.up("lg")]: {
	        fontSize: '1rem'
	      }
	    },
	   
	  },
	  
	});

const App = withStyles(styles)(Main);
export default App;
