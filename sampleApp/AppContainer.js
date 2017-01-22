import React from 'react';
import TopBar from './components/TopBar';
import SideBar from './components/SideBar';

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
