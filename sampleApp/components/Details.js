import React from 'react';

export default class Details extends React.Component{
    constructor(props) {
        super(props);
    }
    
    render () {
        return (
            <div className="Details">
                <div className="DetailsHeader">
                    <div className="DetailsTitle">
                        {this.props.Title}
                    </div>
                </div>
                <div className="DetailsBanner">
                    {this.props.Description}
                </div>
                {this.props.children}
            </div>
        );
    }
};
