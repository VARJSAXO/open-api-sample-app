import React from 'react';
import { Button, DropdownButton, MenuItem, Table} from 'react-bootstrap';

export default (props) => {

	return (
		<div className="padBox">
		{props.instrumentSelected ? (
			<Button bsStyle="primary" onClick={props.subscribeInstruments} disabled={props.instrumentsSubscribed}>Subscribe</Button>
	    ): null }					 
		    <br/>
		    <br/>
		    {props.instrumentSelected ? (
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
				    <tbody>
						{ props.getInstrumentData() }
				    </tbody>
				</Table>
		    ): null}
		</div>
	)
};