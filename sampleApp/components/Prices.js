import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem, Table, Button} from 'react-bootstrap';
import APIStore from './APIStore';
import Details from './Details'
import {merge} from 'lodash'

let assetTypes = ['FxSpot'];

export default class Prices extends React.Component {
	constructor(props) {
		super(props);
		this.instrumentTypes = {};
		this.instrument = {};
		this.assetType = '';
		this.description = "Shows how to get prices and other trade related information and keep the prices updated as events are recieved over the streaming channel."
		this.getAssetTypes = this.getAssetTypes.bind(this);
		this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
		this.onAssetTypeSelected = this.onAssetTypeSelected.bind(this);
		this.updateInstruments = this.updateInstruments.bind(this);
		this.updateInstrumentData = this.updateInstrumentData.bind(this);
		this.refreshInstrumentData = this.refreshInstrumentData.bind(this);
		this.state =  {
			hasInstruments: false,
			instrumentSelected: false,
		}
	}

	getAssetTypes () {
		return assetTypes.map((assetType, index) =>  <MenuItem eventKey={index} key={assetType}> {assetType} </MenuItem> )
	}

	onInstrumentSelected (instrument) {
		APIStore.subscribePrices({
			AssetType: instrument.AssetType,
			uic: instrument.Uic
		}, this.updateInstrumentData);
	}

	onAssetTypeSelected (eventKey, event) {
		this.assetType = event.target.text;
		APIStore.getInstruments({AssetTypes: event.target.text}, this.updateInstruments);
	}

	updateInstruments (data) {
		this.instrumentTypes = data.Data.map((instrument, index) => <MenuItem eventKey={instrument.Identifier} key={instrument.Identifier} data-uic={instrument.Identifier} data-assetType={instrument.AssetType}> {instrument.Description} </MenuItem>);
		this.setState({
			hasInstruments: true
		});
	}

	updateInstrumentData (data) {
		debugger;
		this.instrument = data;
		this.setState({
			instrumentSelected: true
		});
	}

	refreshInstrumentData (instrument) {
		APIStore.getInfoPrices({
			AssetType: instrument.AssetType,
			uic: instrument.Uic
		}, this.updateInstrumentData);
	}

	render () {
		return (
			<Details Title = "Prices - Streaming" Description={this.description}>
				<div className="padBox">
					<br/>
					<ButtonToolbar>
				        <DropdownButton bsStyle="default" title="Select Asset Type" id="dropdown-size-large" onSelect={this.onAssetTypeSelected}>
				         {this.getAssetTypes()}
				        </DropdownButton>
				        {this.state.hasInstruments ? (
				            <DropdownButton bsStyle="default" title="Select Instrument" id="dropdown-size-large" onSelect={this.onInstrumentSelected}>
				              {this.instrumentTypes}
				            </DropdownButton>
						): null }
				    </ButtonToolbar>
				    <br/>
				    <br/>
				    {this.state.instrumentSelected ? (
						<Table striped bordered condensed hover>
						    <thead>
								<tr></tr>
						    </thead>
							<tbody></tbody>
						</Table>
				    ): null}
				</div>
			</Details>
		)
	}
}