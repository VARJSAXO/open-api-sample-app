import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory, DefaultRoute }  from 'react-router';

import App from './components/App'
import Home from './components/Home';

const Routes = () => {
	return (
		<Router history={hashHistory}>
			<Route path="/" component={App}>
		    	<Route path="home" component={Home}/>
		    </Route>
		</Router>
	)
}
render(<Routes/>, document.getElementById('container'));