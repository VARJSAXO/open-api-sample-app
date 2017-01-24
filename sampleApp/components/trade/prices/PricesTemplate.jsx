import React from 'react';
import { Button, Table, Panel} from 'react-bootstrap';
import { map, isObject } from 'lodash'

export default (props) => {
    var instrumentPrices = map(props.instrumentPrices, ((value, key) => { if(!isObject(value)) { return <tr><td><b>{key}</b></td><td>{value}</td></tr>} }))
    var quotePrices = map(props.instrumentPrices.Quote, ((value, key) => <tr><td><b>{key}</b></td><td>{value}</td></tr> ))
    return (
        <div className="padBox">
            {props.instrumentSelected ? (
                <div>
                    <Panel bsStyle="primary" header="Basic Info">
                        <Table striped bordered condensed hover>
                            <tbody>
                                {instrumentPrices}
                            </tbody>
                        </Table>
                    </Panel>
                    <Panel  bsStyle="primary" header="Quote Info">
                        <Table striped bordered condensed hover>
                            <tbody>
                                {quotePrices}
                            </tbody>
                        </Table>
                    </Panel>
                </div>
            ): null}
        </div>
    )
};








