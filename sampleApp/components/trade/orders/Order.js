import React from 'react';
import Details from '../../Details';
import Instruments from '../../ref/instruments/Instruments'
import { merge, map } from 'lodash'
import { MenuItem, Table, Button,ButtonToolbar,Checkbox,Radio,RadioGroup, Form, FormGroup,FormControl, ButtonGroup, Input,ControlLabel, Col,Row,Panel, Tabs, Tab} from 'react-bootstrap';
import DataService from '../../utils/DataService';


export default class Order extends React.Component {
    constructor(props) {
        super(props);

        this.orderSubscription = {};
        this.positionSubscription={};
        this.OpenOrders={};
        this.Positions={};
        this.accountInfo =  {};
        this.currentOrder = {
            Uic:"",
            Symbol:"",
            AssetType:"",
            OrderType:"Market",
            Ask:"",
            Bid:"",
            OrderDuration:{ DurationType:"DayOrder", },
            Amount:"",
            AccountKey:"",
            BuySell:"",
            OrderRelation:"StandAlone"

        };

        this.state = {
                       IsSubscribedForOrders:false,
                       IsSubscribedForPositions:false,
                       updated:false
                     };

        this.onInstrumentChange = this.onInstrumentChange.bind(this);
        this.handleRefreshOrderClick = this.handleRefreshOrderClick.bind(this);
        this.handleSubscribeOrdersClick = this.handleSubscribeOrdersClick.bind(this);

        this.handleRefreshPositionsClick = this.handleRefreshPositionsClick.bind(this);
        this.handleSubscribePositionsClick = this.handleSubscribePositionsClick.bind(this);

        this.OnOrderUpdate = this.OnOrderUpdate.bind(this);
        this.OnPositionUpdate = this.OnPositionUpdate.bind(this);
        this.getAccountInfo = this.getAccountInfo.bind(this);
        this.onAccountInfo = this.onAccountInfo.bind(this);
        this.onInfoPrice = this.onInfoPrice.bind(this);

        this.onSelectOrderType = this.onSelectOrderType.bind(this);
        this.onSelectOrderDuration = this.onSelectOrderDuration.bind(this);

        this.placeOrder = this.placeOrder.bind(this);
        this.onPlaceOrderSuccess = this.onPlaceOrderSuccess.bind(this);
        this.onPlaceOrderFailure = this.onPlaceOrderFailure.bind(this);

    }

    placeOrder(buySell)
    {

        this.currentOrder.BuySell = buySell;
        this.currentOrder.AccountKey = this.accountInfo.AccountKey;

        var tranportSvc = DataService.getTransportSvc();
        //Describes how to call OpenApi using open source Iit library.
        tranportSvc.post('trade', 'v1/orders', null , {body:this.currentOrder})
        .then((result) => this.onPlaceOrderSuccess(result))
        .catch((result)=>this.onPlaceOrderFailure(result));
    }

    onPlaceOrderSuccess(result)
    {
        console.log(result);
    }

    onPlaceOrderFailure(result)
    {
        console.log(result);
    }

    componentWillUnmount() {
        var streamingSvc = DataService.getStreamingSvc();

        if(this.state.IsSubscribedForOrders) {
            streamingSvc.disposeSubscription(this.orderSubscription);
        }

        if(this.state.IsSubscribedForPositions) {
            streamingSvc.disposeSubscription(this.positionSubscription);
        }
    }

    componentDidMount() {
        this.getAccountInfo();
    }

    onAccountInfo(response) {


        this.accountInfo = response.Data[0];

        this.handleSubscribeOrdersClick();
        this.handleSubscribePositionsClick();
    }

    getAccountInfo()  {
        var tranportSvc = DataService.getTransportSvc();

        //Describes how to call OpenApi using open source Iit library.
        tranportSvc.get('port', 'v1/accounts/me',null, null)
        .then((result) => this.onAccountInfo(result.response));
    }

    OnPositionUpdate(response) {
        var positions = response.Data;

        for (var index in positions) {

            if(this.Positions[positions[index].PositionId]) {
                merge(this.Positions[positions[index].PositionId], positions[index]);
            }
            else {
                this.Positions[positions[index].PositionId] = positions[index];
            }
        }
        this.setState({updated:true});
    }

    OnOrderUpdate(response) {
        var orders = response.Data;

        for (var index in orders) {

            if(this.OpenOrders[orders[index].OrderId]) {
                merge(this.OpenOrders[orders[index].OrderId], orders[index]);
            }
            else {
                this.OpenOrders[orders[index].OrderId] = orders[index];
            }
        }
        this.setState({updated:true});

    }

    handleSubscribePositionsClick() {

        var subscriptionArgs = {
            "Arguments": {
                "AccountKey": this.accountInfo.AccountKey,
                "ClientKey": this.accountInfo.ClientKey,
                "FieldGroups": ["DisplayAndFormat","PositionBase","PositionView"]
            }
        }

        var streamingSvc = DataService.getStreamingSvc();
        this.positionSubscription = streamingSvc.createSubscription('port', 'v1/positions/subscriptions', subscriptionArgs , this.OnPositionUpdate);

        this.setState({IsSubscribedForPositions:true});

    }

    handleRefreshPositionsClick() {

    }

    handleSubscribeOrdersClick() {
        var subscriptionArgs = {
            "Arguments": {
                "AccountKey": this.accountInfo.AccountKey,
                "ClientKey": this.accountInfo.ClientKey,
                "FieldGroups": ["DisplayAndFormat"]
            }
        }

        var streamingSvc = DataService.getStreamingSvc();
        this.orderSubscription = streamingSvc.createSubscription('port', 'v1/orders/subscriptions', subscriptionArgs , this.OnOrderUpdate);

        this.setState({IsSubscribedForOrders:true});

    }


    handleRefreshOrderClick(event) {

        var tranportSvc = DataService.getTransportSvc();
        //Describes how to call OpenApi using open source Iit library.
        tranportSvc.get('port', '/v1/orders/me', null, null)
        .then((result) => this.OnOrderUpdate(result.response))
    }

    onInfoPrice(response) {


        this.currentOrder.Ask = response.Quote.Ask;
        this.currentOrder.Bid = response.Quote.Bid;
        this.currentOrder.Amount = response.Quote.Amount;

        this.currentOrder.Uic = response.Uic;
        this.currentOrder.Symbol = response.DisplayAndFormat.Symbol;
        this.currentOrder.AssetType = response.AssetType;

        this.setState({updated:true});

    }

    onInstrumentChange(instrument){

            var tranportSvc = DataService.getTransportSvc();
            var queryParams =  {
                      AssetType: instrument.AssetType,
                      Uic: instrument.Identifier,
                      FieldGroups: ['DisplayAndFormat', 'PriceInfo', 'Quote']
                    }

            //Describes how to call OpenApi using open source Iit library.
            tranportSvc.get('trade', 'v1/infoprices',null, { queryParams: queryParams})
            .then((result) => this.onInfoPrice(result.response))

       }

    onSelectOrderType(event){

        this.currentOrder.OrderType = event.target.value;
        this.setState({updated:true});
    }

    onSelectOrderDuration(event) {
        this.currentOrder.OrderDuration.DurationType = event.target.value;
        this.setState({updated:true});
    }

    onChangeAskPrice(event)
    {
        this.currentOrder.Ask = event.target.value;
        this.setState({updated:true});
    }

    onChangeBidPrice(event)
    {
        this.currentOrder.Bid = event.target.value;
        this.setState({updated:true});
    }


    render() {
        var orderSubscribeButtonText = "Subscribe";
        var positionsSubscribeButtonText = "Subscribe";

        return (
          <Details Title = "Info Prices" Description={this.description}>
          <Instruments parent="true" onInstrumentSelected={this.onInstrumentChange}/>
          <div className="padBox">
            <Row>
            <Col sm={6}>
            <Panel header="Order Details" className="panel-primary">
            <Form>
                <div className="padBox">
                    <FormGroup>
                    <Row>
                        <Col sm={4} >
                            <ControlLabel>Uic</ControlLabel>
                            <FormControl readOnly="readOnly" type="text" placeholder="Uic" value={this.currentOrder.Uic} />
                        </Col>
                        <Col sm={4}>
                            <ControlLabel >Instrument</ControlLabel>
                            <FormControl readOnly="readOnly" type="text" placeholder="Symbol" value={this.currentOrder.Symbol} />
                        </Col>
                        <Col sm={4}>
                            <ControlLabel >AssetType</ControlLabel>
                            <FormControl readOnly="readOnly" type="text" placeholder="AssetType" value={this.currentOrder.AssetType} />
                        </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                        <Col sm={4}>
                            <ControlLabel>Order Type</ControlLabel>
                            <FormControl componentClass="select" value={this.currentOrder.OrderType} onChange={this.onSelectOrderType} >
                                <option value="Market">Market</option>
                                <option value="Limit">Limit</option>
                            </FormControl>
                        </Col>
                        <Col sm={4}>
                            <ControlLabel>Ask Price</ControlLabel>
                            <FormControl type="text" placeholder="Ask Price" value={this.currentOrder.Ask} onChange={this.onChangeAskPrice.bind(this)}  />
                        </Col>
                        <Col sm={4} >
                            <ControlLabel>Bid Price</ControlLabel>
                            <FormControl type="text" placeholder="Bid Price" value={this.currentOrder.Bid} />
                        </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                        <Col sm={4} >
                            <ControlLabel>Order Duration</ControlLabel>
                            <FormControl componentClass="select" value={this.currentOrder.Duration} onChange={this.onSelectOrderDuration}>
                                <option value="DayOrder">DayOrder</option>
                                <option value="GoodTillCancel">GoodTillCancel</option>
                                <option value="GoodTillDate">GoodTillDate</option>
                                <option value="ImmediateOrCancel">ImmediateOrCancel</option>
                            </FormControl>
                        </Col>
                        <Col sm={4}>
                            <ControlLabel>Amount</ControlLabel>
                            <FormControl type="text" placeholder="Amount" value={this.currentOrder.Amount} />
                        </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                    <Col sm={4}></Col>
                    <Col sm={4}><Button bsStyle="primary" block  onClick={this.placeOrder.bind(this,"Buy")}>Buy</Button></Col>
                    <Col sm={4}><Button bsStyle="primary" block  onClick={this.placeOrder.bind(this,"Sell")}>Sell</Button></Col>
                    </Row>
                    </FormGroup>
                </div>
            </Form>
            </Panel>
            </Col>
            <Col sm={6}>
            <Panel header="Account Info: openapi/port/v1/accounts/me" className="panel-primary">
            <div className="padBox">
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        <th width='150'>Data</th>
                        <th width='150'>Value</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  key="AccountId" ><td>AccountId</td><td>{this.accountInfo.AccountId}</td></tr>
                    <tr  key="AccountKey"><td>AccountKey</td><td>{this.accountInfo.AccountKey}</td></tr>
                    <tr  key="AccountType"><td>AccountType</td><td>{this.accountInfo.AccountType}</td></tr>
                    <tr  key="ClientId"><td>ClientId</td><td>{this.accountInfo.ClientId}</td></tr>
                    <tr  key="ClientKey"><td>ClientKey</td><td>{this.accountInfo.ClientKey}</td></tr>
                    <tr  key="Currency"><td>Currency</td><td>{this.accountInfo.Currency}</td></tr>
                </tbody>
            </Table>
            </div>
            </Panel>
            </Col>
            </Row>
            <Row>
                <div className="padBox">
                <Tabs className="primary" defaultActiveKey={1} animation={false} id="noanim-tab-example">
                    <Tab eventKey={1} title="Orders">
                    <div className="padBox">
                    <Row>
                    <div className="padBox">
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th width='150'>OrderId</th>
                                <th width='150'>Amount</th>
                                <th width='150'>BuySell</th>
                                <th width='150'>CurrentPrice</th>
                                <th width='150'>MarketPrice</th>
                                <th width='150'>DistanceToMarket</th>
                                <th width='150'>AssetType</th>
                                <th width='150'>AccountId</th>
                                <th width='150'>Duration</th>
                                <th width='150'>OpenOrderType</th>
                                <th width='150'>OrderTime</th>
                                <th width='150'>Status</th>
                                <th width='150'>Uic</th>
                                <th width='150'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {map(this.OpenOrders, (order) =>
                                    <tr  key={order.OrderId} >
                                        <td>{order.OrderId}</td>
                                        <td>{order.Amount}</td>
                                        <td>{order.BuySell}</td>
                                        <td>{order.CurrentPrice}</td>
                                        <td>{order.MarketPrice}</td>
                                        <td>{order.DistanceToMarket}</td>
                                        <td>{order.AssetType}</td>
                                        <td>{order.AccountId}</td>
                                        <td>{order.Duration.DurationType}</td>
                                        <td>{order.OpenOrderType}</td>
                                        <td>{order.OrderTime}</td>
                                        <td>{order.Status}</td>
                                        <td>{order.Uic}</td>
                                        <td> <ButtonToolbar>
                                                <Button bsStyle="primary">Edit</Button>
                                            </ButtonToolbar>
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </Table>
                    </div>
                    </Row>
                    </div>
                    </Tab>
                    <Tab eventKey={2} title="Positions">
                    <div className="padBox">
                    <Row>
                    <div className="padBox">
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>

                                <th width='150'>Symbol</th>
                                <th width='150'>Currency</th>
                                <th width='150'>Amount</th>
                                <th width='150'>OpenPrice</th>
                                <th width='150'>CurrentPrice</th>
                                <th width='150'>ProfitLossOnTrade</th>
                                <th width='150'>ProfitLossOnTradeInBaseCurrency</th>
                                <th width='150'>TradeCostsTotal</th>
                                <th width='150'>TradeCostsTotalInBaseCurrency</th>
                                <th width='150'>Exposure</th>
                                <th width='150'>ExposureInBaseCurrency</th>
                                <th width='150'>SpotDate</th>
                                <th width='150'>Status</th>
                                <th width='150'>ValueDate</th>

                                <th width='150'>NetPositionId</th>
                                <th width='150'>AccountId</th>
                                <th width='150'>AssetType</th>
                                <th width='150'>ClientId</th>
                            </tr>
                        </thead>
                        <tbody>
                            {map(this.Positions, (position) =>
                                    <tr key={position.PositionId}>

                                        <td>{position.DisplayAndFormat.Symbol}</td>
                                        <td>{position.DisplayAndFormat.Currency}</td>

                                        <td>{position.PositionBase.Amount}</td>
                                        <td>{position.PositionBase.OpenPrice}</td>
                                        <td>{position.PositionView.CurrentPrice}</td>
                                        <td>{position.PositionView.ProfitLossOnTrade}</td>
                                        <td>{position.PositionView.ProfitLossOnTradeInBaseCurrency}</td>
                                        <td>{position.PositionView.TradeCostsTotal}</td>
                                        <td>{position.PositionView.TradeCostsTotalInBaseCurrency}</td>
                                        <td>{position.PositionView.Exposure}</td>
                                        <td>{position.PositionView.ExposureInBaseCurrency}</td>
                                        <td>{position.PositionBase.SpotDate}</td>
                                        <td>{position.PositionBase.Status}</td>
                                        <td>{position.PositionBase.ValueDate}</td>

                                        <td>{position.NetPositionId}</td>
                                        <td>{position.PositionBase.AccountId}</td>
                                        <td>{position.PositionBase.AssetType}</td>
                                        <td>{position.PositionBase.ClientId}</td>

                                    </tr>
                                )}
                        </tbody>
                    </Table>
                      </div>
                    </Row>
                    </div></Tab>
                </Tabs>
                </div>
            </Row>
            </div>
            </Details>);
    }
}
