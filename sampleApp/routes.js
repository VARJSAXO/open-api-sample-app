import React from 'react';
import {render} from 'react-dom';
import { Router, Route, hashHistory, IndexRedirect }  from 'react-router';

import App from './AppContainer'
import Introduction from './components/Introduction';
import Home from './components/Home';
import InfoPrices from './components/trade/infoprices/InfoPrices';
import Prices from './components/trade/prices/Prices';
import Order from './components/trade/orders/Order';
import Instruments from './components/ref/instruments/Instruments'


const Routes = () => {
	return (
		<Router history={hashHistory}>
			<Route path="/" component={App}>
				<IndexRedirect to="/intro" />
		    	<Route path="home" component={Home}/>
		    	<Route path="intro" component={Introduction}/>
		    	<Route path="infoPrices" component={InfoPrices}/>
				<Route path="prices" component={Prices}/>
				<Route path="orders" component={Order}/>
				<Route path="instruments" component={Instruments}/>
			</Route>
		</Router>
	)
}
render(<Routes/>, document.getElementById('container'));
