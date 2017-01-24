import React from 'react';
import { ButtonToolbar, Button} from 'react-bootstrap';
import { merge, map, omitBy, transform } from 'lodash'
import API from '../../utils/API'
import Details from '../../Details';
import Instrument from '../../ref/instruments/Instruments'
import InfoPricesTemplate from './InfoPricesTemplate'


export default class InfoPrices extends React.Component {
	constructor (props) {
		super(props);
		this.instruments = {};
		this.assetType = '';
		this.description = "Shows how to get prices and other trade related information and keep the prices updated as events are recieved over the streaming channel."
		this.getInstrumentData = this.getInstrumentData.bind(this);
		this.removeInstrument = this.removeInstrument.bind(this);
		this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
		this.updateInstrumentData = this.updateInstrumentData.bind(this);
		this.fetchInstrumentsData = this.fetchInstrumentsData.bind(this);
		this.updateSubscribedInstruments = this.updateSubscribedInstruments.bind(this);
		this.subscribeInstruments = this.subscribeInstruments.bind(this);
		this.state =  {
			instrumentSelected: false,
			instrumentRemoved: false,
			instrumentsSubscribed: false,
			changed: false
		}
	}

	getInstrumentData () {
		return (
			map(this.instruments, (instrument) =>
		      <tr key={instrument.Uic}>
		        <td>{instrument.Uic}</td>
		        <td>{instrument.AssetType}</td>
		        <td>{instrument.Quote.Amount}</td>
		        <td className={this.highlightCell()}>{instrument.Quote.Ask}</td>
		        <td className={this.highlightCell()}>{instrument.Quote.Bid}</td>
		        <td>{instrument.Quote.DelayedByMinutes}</td>
		        <td>{instrument.Quote.ErrorCode}</td>
		        <td className={this.highlightCell()}>{instrument.Quote.Mid}</td>
		        <td>{instrument.Quote.PriceTypeAsk}</td>
		        <td>{instrument.Quote.PriceTypeBid}</td>
		        <td><ButtonToolbar>
				        <Button bsStyle="primary" bsSize="xsmall" onClick={this.removeInstrument.bind(this, instrument.Uic)}>Remove</Button>
		        	</ButtonToolbar>
		        </td>
		      </tr>
		    )
		)
	}

	removeInstrument (uic) {
		this.instruments = omitBy(this.instruments, (instrument) => instrument.Uic === uic);
		this.setState({
			instrumentRemoved: true
		})
	}

	onInstrumentSelected (instrument) {
		API.getInfoPrices({
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

	updateSubscribedInstruments (instruments) {
		var instrumentData = instruments.Data;
		for (var index in instrumentData) {
		    merge(this.instruments[instrumentData[index].Uic], instrumentData[index]);
		}
		this.setState({ changed: true });
	}

	subscribeInstruments () {
		var uics = transform(this.instruments, ((concat, instrument) => concat['uic'] = concat['uic'] ? concat['uic'] +','+ instrument.Uic : instrument.Uic  ), {});
		API.subscribeInfoPrices({ Uics: uics['uic'], AssetType: this.assetType }, this.updateSubscribedInstruments);
		this.setState({
			instrumentsSubscribed: true,
		});
	}

	fetchInstrumentsData () {
		var uics = transform(this.instruments, ((concat, instrument) => concat['uic'] = concat['uic'] ? concat['uic'] +','+ instrument.Uic : instrument.Uic  ), {});
		API.getInfoPricesList({ Uics: uics['uic'], AssetType: this.assetType }, this.updateSubscribedInstruments);
	}

	highlightCell () {
		if(this.state.changed) {
			setTimeout(() => this.setState({changed: false}), 1000);
		}
		return this.state.changed ? "highlight" : '';
	}

	render () {
		return (
			<Details Title = "Info Prices" Description={this.description}>
				<Instrument parent="true" onInstrumentSelected={this.onInstrumentSelected}/>
				<InfoPricesTemplate instrumentSelected={this.state.instrumentSelected} getInstrumentData={this.getInstrumentData} subscribeInstruments={this.subscribeInstruments} instrumentsSubscribed={this.state.instrumentsSubscribed} fetchInstrumentsData={this.fetchInstrumentsData}/>
			</Details>
		)
	}
}
