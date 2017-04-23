import { Component } from 'react';
import React from 'react';
import { withRouter } from 'react-router';

class NotFound extends Component {
    constructor(props){
        super(props);
    }


    render(){
        return (
            <div className='container'>
                <h1>404 <small>We couldn't find the route you were looking for...</small></h1>
            </div>
        )
    }
}

export default withRouter(NotFound);
