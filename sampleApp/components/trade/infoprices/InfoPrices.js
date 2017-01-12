import React from 'react';
import { ButtonToolbar, Button, MenuItem, Table} from 'react-bootstrap';
import Details from '../../Details';
import { merge } from 'lodash'
import Instrument from '../../ref/instruments/Instruments'
import InfoPricesTemplate from './InfoPricesTemplate'
import InfoPricesService from './InfoPricesService'

export default class InfoPrices extends React.Component {
	constructor(props) {
		super(props);
		this.instrumentTypes = {};
		this.instruments = [];
		this.assetType = '';
		this.description = "Shows how to get prices and other trade related information and keep the prices updated as events are recieved over the streaming channel."
		this.getInstrumentData = this.getInstrumentData.bind(this);
		this.removeInstrument = this.removeInstrument.bind(this);
		this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
		this.updateInstrumentData = this.updateInstrumentData.bind(this);
		this.refreshInstrumentData = this.refreshInstrumentData.bind(this);
		this.updateSubscribedInstruments = this.updateSubscribedInstruments.bind(this);
		this.subscribeInstruments = this.subscribeInstruments.bind(this);
		this.state =  {
			instrumentSelected: false,
			instrumentRemoved: false,
			instrumentsSubscribed: false
		}
	}

	getInstrumentData () {
		return (
			this.instruments.map((instrument) =>
			      <tr key={instrument.Uic}>
			        <td>{instrument.Uic}</td>
			        <td>{instrument.AssetType}</td>
			        <td>{instrument.Quote.Amount}</td>
			        <td>{instrument.Quote.Ask}</td>
			        <td>{instrument.Quote.Bid}</td>
			        <td>{instrument.Quote.DelayedByMinutes}</td>
			        <td>{instrument.Quote.ErrorCode}</td>
			        <td>{instrument.Quote.Mid}</td>
			        <td>{instrument.Quote.PriceTypeAsk}</td>
			        <td>{instrument.Quote.PriceTypeBid}</td>
			        <td> <ButtonToolbar>
					        <Button bsStyle="primary" bsSize="xsmall" onClick={this.refreshInstrumentData.bind(this, instrument)}>Refresh</Button>
					        <Button bsStyle="primary" bsSize="xsmall" onClick={this.removeInstrument.bind(this, instrument.Uic)}>Remove</Button>
			        	</ButtonToolbar>
			        </td>
			      </tr>
		    )
		)
	}

	removeInstrument (uic) {
		this.instruments = this.instruments.filter((instrument) => instrument.Uic !== uic);
		this.setState({
			instrumentRemoved: true
		})
	}

	onInstrumentSelected (instrument) {
		InfoPricesService().getInfoPrices({
			AssetType: instrument.AssetType,
			uic: instrument.Identifier
		}, this.updateInstrumentData,
		(result) => console.log(result));
	}

	updateInstrumentData (data) {
		this.instruments[data.Uic] = data;
		this.assetType = data.AssetType;
		this.setState({
			instrumentSelected: true
		});
	}

	refreshInstrumentData (instrument) {
		InfoPricesService().getInfoPrices({
			AssetType: instrument.AssetType,
			uic: instrument.Uic
		}, this.updateInstrumentData);
	}

	updateSubscribedInstruments (instruments) {
		var instrumentData = instruments.Data;
		for (var index in instrumentData) {
		    merge(this.instruments[instrumentData[index].Uic], instrumentData[index]);
		}
		this.setState({
			instrumentsSubscribed: true
		});
	}

	subscribeInstruments () {
		var uics = this.instruments.reduce(((concat, instrument) => concat ? concat +','+ instrument.Uic : instrument.Uic  ), '');
		InfoPricesService().subscribeInfoPrices({ Uics: uics, AssetType: this.assetType }, this.updateSubscribedInstruments);
		this.setState({
			instrumentsSubscribed: true
		});
	}

	render () {
		return (
			<Details Title = "Info Prices" Description={this.description}>
				<Instrument parent="true" onInstrumentSelected={this.onInstrumentSelected}/>
				<InfoPricesTemplate instrumentSelected={this.state.instrumentSelected} getInstrumentData={this.getInstrumentData} subscribeInstruments={this.subscribeInstruments} instrumentsSubscribed={this.state.instrumentsSubscribed}/>
			</Details>
		)
	}
}