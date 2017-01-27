import React from 'react';
import Details from '../../Details';
import InstrumentTemplate from './InstrumentTemplate'
import API from '../../utils/API'

export default class Instruments extends React.Component {
    constructor (props) {
        super(props);
        this.assetTypes = ["FxSpot", "Bond", "Cash", "Stock", "CfdOnFutures", "CfdOnIndex", "CfdOnStock", "ContractFutures", "FuturesStrategy", "StockIndex", "ManagedFund"];
        this.instrumentList = [];
        this.description = "Shows how to get instruments details based on Asset Type";
        this.state = { hasInstruments : false, searchTerm : '', assetType: 'Select Asset Type', instrument: 'Select Instrument' };
        this.onAssetTypeSelected = this.onAssetTypeSelected.bind(this);
        this.onInstrumentsUpdated = this.onInstrumentsUpdated.bind(this);
        this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
        this.onSearchUpdated = this.onSearchUpdated.bind(this);
    }

    onAssetTypeSelected (eventKey, event) {
        this.setState({searchTerm:'', assetType: eventKey, instrument: 'Select Instrument'});
        API.getInstruments({ AssetTypes: eventKey },
            this.onInstrumentsUpdated,
            (result) => console.log(result)
        );
    }

    onInstrumentsUpdated (result) {
        this.instrumentList = result.Data;
        this.setState({
            hasInstruments : true
        });
    }

    onInstrumentSelected (eventKey, event) {
        this.setState({instrument: eventKey.Description})
        if(this.props.parent) {
            this.props.onInstrumentSelected(eventKey)
        }
    }

    onSearchUpdated (term) {
        this.setState({searchTerm: term})
    }

    render() {
        return (
            <div>
                { this.props.parent ?
                    ( <InstrumentTemplate state = {this.state} assetTypes = {this.assetTypes} instrumentList = {this.instrumentList} onAssetTypeSelected = {this.onAssetTypeSelected} parent={this.props.parent} onInstrumentSelected={this.onInstrumentSelected}/>)
                    : (<Details Title="Ref Data - EndPoint: v1/instruments" Description = {this.description}>
                        <InstrumentTemplate state = {this.state} assetTypes = {this.assetTypes} instrumentList = {this.instrumentList} onAssetTypeSelected = {this.onAssetTypeSelected} parent={this.props.parent} searchUpdated = {this.onSearchUpdated}/>
                    </Details>)
                }
            </div>
        );
    }
}
