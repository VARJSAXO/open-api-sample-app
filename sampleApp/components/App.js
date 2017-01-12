import React from 'react';
import TopBar from './TopBar';
import SideBar from './SideBar';
import Details from './Details';

export default class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render () {
		return (
			<div>
				<TopBar/>
				<SideBar/>
				{this.props.children}
			</div>
		)
	}
}
