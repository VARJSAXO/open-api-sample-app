import React from 'react';
import { ButtonToolbar, Button, Table} from 'react-bootstrap';

export default (props) => {

	return (
		<div className="padBox">
		{props.instrumentSelected ? (
			<ButtonToolbar>
				<Button bsStyle="primary" onClick={props.subscribeInstruments}>{props.instrumentsSubscribed ? 'Unsubscribe': 'Subscribe'}</Button>
	 			<Button bsStyle="primary" onClick={props.fetchInstrumentsData} disabled={props.instrumentsSubscribed}>Get Prices</Button>
	 		</ButtonToolbar>
	    ): null }
		    <br/>
		    <br/>
		    { props.instrumentSelected ? (
				<Table striped bordered condensed hover>
				    <thead>
				      <tr>
				        <th>Uic</th>
				        <th>AssetType</th>
				        <th>Amount</th>
				        <th>Ask</th>
				        <th>Bid</th>
				        <th>DelayedByMinutes</th>
				        <th>ErrorCode</th>
				        <th>Mid</th>
				        <th>PriceTypeAsk</th>
				        <th>PriceTypeBid</th>
				        <th></th>
				      </tr>
				    </thead>
				    <tbody>{props.getInstrumentData()}</tbody>
				</Table>
		    ) : null }
		</div>
	)
};
