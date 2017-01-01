import React from 'react';
import { Router, Route, NotFoundRoute, browserHistory }  from 'react-router';
import TopBar from './TopBar';
import SideBar from './SideBar';
import Details from './Details';

class App extends React.Component {
	render () {
		return (
			<div>
				<TopBar/>
				<SideBar/>
				<Details page={this.props.children}/>
			</div>
		)
	}
}

export default App;
