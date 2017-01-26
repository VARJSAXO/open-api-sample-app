import React from 'react';
import { Table, Panel, Accordion, Row, Col} from 'react-bootstrap';
import { map, isObject } from 'lodash'

export default (props) => {
    var generateTable = (data) => map(data, ((value, key) => { if(!isObject(value)) { return <tr><td><b>{key}</b></td><td>{value}</td></tr>} }));

    return (
        <div className="padBox">
            {props.instrumentSelected ? (
                <div>
                    <Row>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel bsStyle="primary" header="Basic Info" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel  bsStyle="primary" header="Instrument Price Details" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.InstrumentPriceDetails)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel  bsStyle="primary" header="Price Info Details" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.PriceInfoDetails)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                            
                        </Col>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel  bsStyle="primary" header="Display And Format" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.DisplayAndFormat)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel bsStyle="primary" header="Greeks" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.Greeks)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel bsStyle="primary" header="Commissions" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.Commissions)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel bsStyle="primary" header="PriceInfo" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.PriceInfo)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel  bsStyle="primary" header="Quotes" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.Quote)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel bsStyle="primary" header="Margin Impact" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.MarginImpact)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                        <Col sm={6}>
                            <Accordion defaultActiveKey="1">
                                <Panel  bsStyle="primary" header="Market Depth" eventKey="1">
                                    <Table striped bordered condensed hover>
                                        <tbody>
                                            {generateTable(props.instrumentPrices.MarketDepth)}
                                        </tbody>
                                    </Table>
                                </Panel>
                            </Accordion>
                        </Col>
                    </Row>
                </div>
            ): null}
        </div>
    )
};








