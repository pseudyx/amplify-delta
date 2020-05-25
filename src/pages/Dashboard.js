import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Alert } from 'reactstrap';
import Clock from '../store/Clock'
import './Dashboard.css'


class DashboardPage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            date: Clock.dateString(),
            notifications: [],
            visible: true,
            setVisible: (isVisible) => this.setState({visible: isVisible})
        }
    }

    static getDerivedStateFromProps(props, state) {
        const { groups } = props.user;
        var notifications = [];
        
        if (!groups){
            notifications.push(<p>Your application to join the Delta Legion is being reviewed.</p>);
            notifications.push(<p>In the meantime you can view or update your profile <Link to="/profile">here</Link></p>);
        }

        return {
            notifications
        };
    } 

    onDismiss = () => this.state.setVisible(false);

    notifications(){
        if (this.state.notifications.length > 0) {
        return (
        <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
            {this.state.notifications.map((note) => {
                return note;
            })}
        </Alert>);
        } else {
            return null;
        }
    }

    render(){
        return (
            <React.Fragment>
                {this.notifications()}
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

