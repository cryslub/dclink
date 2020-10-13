import { Component } from 'react';


export default class BaseComponent extends Component {

	setState(object){
		if(this.unmounted !== true)
			super.setState(object);
	}
}