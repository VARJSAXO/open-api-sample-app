import React from 'react';
import { ButtonToolbar, Button} from 'react-bootstrap';
import { merge, map, transform, toArray, uniq, forEach } from 'lodash'
import API from '../../utils/API'
import Details from '../../Details';
import Instrument from '../../ref/instruments/Instruments'
import InfoPricesTemplate from './InfoPricesTemplate'

export default class InfoPrices extends React.Component {
	constructor (props) {
		super(props);
		this.instruments = {};
		this.assetTypes = [];
		this.description = "Shows how to get prices and other trade related information and keep the prices updated as events are recieved over the streaming channel."
		this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
		this.updateInstrumentData = this.updateInstrumentData.bind(this);
		this.fetchInstrumentsData = this.fetchInstrumentsData.bind(this);
		this.updateSubscribedInstruments = this.updateSubscribedInstruments.bind(this);
		this.subscribeInstruments = this.subscribeInstruments.bind(this);
		this.state =  {
			instrumentSelected: false,
			instrumentsSubscribed: false,
			changed: false
		}
	}

	onInstrumentSelected (instrument) {
		API.getInfoPrices({
			AssetType: instrument.AssetType,
			Uic: instrument.Identifier
		}, this.updateInstrumentData,
		(result) => console.log(result));
	}

	updateInstrumentData (data) {
		this.instruments[data.Uic] = data;
		this.assetTypes.push(data.AssetType);
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
		if(!this.state.instrumentsSubscribed) {
			forEach(uniq(this.assetTypes), (value, key) => {
				var uics = transform(this.instruments, ((concat, instrument) => {
					if(instrument.AssetType === value) {
						concat['uic'] = concat['uic'] ? concat['uic'] +','+ instrument.Uic : instrument.Uic
					}
				}), {});
				API.subscribeInfoPrices({ Uics: uics['uic'], AssetType: value }, this.updateSubscribedInstruments);
			});
			this.setState({
				instrumentsSubscribed: true,
			});
		} else {
			API.disposeSubscription(() => console.log("disposed subscription successfully"), () => console.log("Error disposing subscription"));
			this.setState({
				instrumentsSubscribed: false,
			});
		}
	}

	fetchInstrumentsData () {
		forEach(uniq(this.assetTypes), (value, key) => {
			var uics = transform(this.instruments, ((concat, instrument) => {
				if(instrument.AssetType === value) {
					concat['uic'] = concat['uic'] ? concat['uic'] +','+ instrument.Uic : instrument.Uic
				}
			}), {});
			API.getInfoPricesList({ Uics: uics['uic'], AssetType: value }, this.updateSubscribedInstruments);
		});
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
				<InfoPricesTemplate state={this.state} getInstrumentData={toArray(this.instruments)} subscribeInstruments={this.subscribeInstruments} fetchInstrumentsData={this.fetchInstrumentsData}/>
			</Details>
		)
	}
}
