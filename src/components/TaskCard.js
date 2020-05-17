import React from 'react';
import { Card, CardTitle, CardText } from 'reactstrap';
import { Link } from 'react-router-dom';
import './TaskCard.css';


export default class TaskCard extends React.Component{
    constructor(props){
        super(props);

    }

    drag = (e) => {
        e.dataTransfer.setData("card", e.target.id);
    }


    render(){
        return (
        <Card body draggable={true} onDragStart={this.drag} id={this.props.id}>
            <CardTitle>{this.props.title}<div className="float-right"><Link to={`/tasks/${this.props.id}`}><i className="icon-right-open"></i></Link></div></CardTitle>
            <CardText>{this.props.description}</CardText>
            <CardText><span className="cardAuthor">by {this.props.author}</span></CardText>
        </Card>
        );
    }
}

