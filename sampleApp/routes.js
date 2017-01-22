import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory, DefaultRoute }  from 'react-router';

import App from './AppContainer'
import Home from './components/Home';
import InfoPrices from './components/trade/infoprices/InfoPrices';
import Prices from './components/trade/prices/Prices';
import Instruments from './components/ref/instruments/Instruments'


const Routes = () => {
	return (
		<Router history={hashHistory}>
			<Route path="/" component={App}>
		    	<Route path="home" component={Home}/>
		    	<Route path="infoPrices" component={InfoPrices}/>
				<Route path="prices" component={Prices}/>
				<Route path="instruments" component={Instruments}/>
			</Route>
		</Router>
	)
}
render(<Routes/>, document.getElementById('container'));
