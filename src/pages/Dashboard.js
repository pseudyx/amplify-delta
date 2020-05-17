import * as React from 'react';
import { connect } from 'react-redux';
import Clock from '../utils/Clock'
import './Dashboard.css'


class DashboardPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            date: Clock.dateString(),
        }
    }
    
    componentDidMount() {
    }

    componentWillUnmount() {
        
    }

    render(){
        return (
            <React.Fragment>
                <div className={"well"}>
                <h1>{this.state.date}</h1>
                <h2>Welcome {this.props.userProfile?.name}</h2>
                </div>
            </React.Fragment>
        );
    }


}

export default connect()(DashboardPage);

