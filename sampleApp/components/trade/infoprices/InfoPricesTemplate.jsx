import React from 'react';
import { ButtonToolbar, Button, Table} from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { flatten } from 'flat';
import { forEach } from 'lodash';

export default (props) => {
	var instrumentData = [];
	forEach(props.getInstrumentData, (instrument) => { 
		instrumentData.push((flatten(instrument, {safe: true})));
	});
	return (
		<div className="padBox">
		{props.state.instrumentSelected ? (
			<ButtonToolbar>
				<Button bsStyle="primary" onClick={props.subscribeInstruments}>{props.state.instrumentsSubscribed ? 'Unsubscribe': 'Subscribe'}</Button>
	 			<Button bsStyle="primary" onClick={props.fetchInstrumentsData} disabled={props.state.instrumentsSubscribed}>Get Prices</Button>
	 		</ButtonToolbar>
	    ): null }
		    <br/>
		    <br/>
		    { props.state.instrumentSelected ? (
				<BootstrapTable data={instrumentData} striped condensed hover>
				    <TableHeaderColumn width='150' dataField="Uic" isKey dataAlign="center" dataSort>Uic</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="AssetType" dataSort>AssetType</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.Amount">Amount</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.Ask">Ask</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.Bid">Bid</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.DelayedByMinutes">DelayedByMinutes</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.ErrorCode">ErrorCode</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.Mid">Mid</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.PriceTypeAsk">PriceTypeAsk</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="Quote.PriceTypeBid">PriceTypeBid</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="DisplayAndFormat.Currency">Currency</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="DisplayAndFormat.Decimals">Decimals</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="DisplayAndFormat.Description">Description</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="DisplayAndFormat.Format">Format</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="DisplayAndFormat.Symbol">Symbol</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="InstrumentPriceDetails.IsMarketOpen">AskSwap</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="InstrumentPriceDetails.ShortTradeDisabled">BidSwap</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="InstrumentPriceDetails.ValueDate">CfdBorrowingCost</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfo.High">ExpiryDate</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfo.Low">LowerBarrier</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfo.NetChange">PaidCfdInterest</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfo.PercentChange">SpotDate</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.AskSize">StrikePrice</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.BidSize">UpperBarrier</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.LastClose">ValueDate</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.LastTraded">ValueDate</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.LastTradedSize">ValueDate</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.Open">ValueDate</TableHeaderColumn>
				    <TableHeaderColumn width='150' dataField="PriceInfoDetails.Volume">ValueDate</TableHeaderColumn>
				</BootstrapTable>
		    ) : null }
		</div>
	)
};
