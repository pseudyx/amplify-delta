import * as React from 'react';
import { connect } from 'react-redux';
import Clock from '../store/Clock'
import './Dashboard.css'


class DashboardPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            date: Clock.dateString(),
        }
    }

    render(){
        return (
            <React.Fragment>
                <div className={"well"}>
                <h1>{this.state.date}</h1>
                <h2>Welcome {this.props.user?.name}</h2>
                </div>
            </React.Fragment>
        );
    }


}

const mapState = state => {
    const { user } = state.user;
    return { user }
  }

export default connect(mapState)(DashboardPage);

