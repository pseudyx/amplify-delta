import React from 'react';
import Clock from '../store/Clock'

export default class ClockBadge extends React.Component{
    constructor(props){
        super(props);

        var clock = new Clock();
        clock.callback = this.clockCallback;

        this.state = {
            clock: clock,
            time: "00:00:00"
        }
    }

    clockCallback = (time) => {this.setState({time})};

    componentDidMount() {
        this.handleStartTime();
    }

    componentWillUnmount() {
        this.handleStopTime();
    }

    handleStartTime = () => {
        this.state.clock.startTimer();
    }

    handleStopTime = () => {
        this.state.clock.stopTimer();
    }

    render(){
        return (
            <React.Fragment>
                <span>{this.state.time}</span>
            </React.Fragment>
        );
    }
}

