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
        this.state = { hasInstruments : false };
        this.assetType = 'Select Asset Type',
        this.instrument = 'Select Instrument',
        this.onAssetTypeSelected = this.onAssetTypeSelected.bind(this);
        this.onInstrumentsUpdated = this.onInstrumentsUpdated.bind(this);
        this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
    }

    onAssetTypeSelected (eventKey, event) {
        this.assetType = eventKey;
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
        this.instrument = eventKey.Description;
        if(this.props.parent) {
            this.props.onInstrumentSelected(eventKey)
        }
    }

    render() {
        return (
            <div>
                { this.props.parent ?
                    ( <InstrumentTemplate hasInstruments = {this.state.hasInstruments} assetTypes = {this.assetTypes} instrumentList = {this.instrumentList} onAssetTypeSelected = {this.onAssetTypeSelected} parent={this.props.parent} onInstrumentSelected={this.onInstrumentSelected} assetType={this.assetType} instrument={this.instrument}/>)
                    : (<Details Title="Ref Data - EndPoint: v1/instruments" Description = {this.description}>
                        <InstrumentTemplate hasInstruments = {this.state.hasInstruments} assetTypes = {this.assetTypes} instrumentList = {this.instrumentList} onAssetTypeSelected = {this.onAssetTypeSelected} parent={this.props.parent} assetType={this.assetType} instrument={this.instrument}/>
                    </Details>)
                }
            </div>
        );
    }
}
