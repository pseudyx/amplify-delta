import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';

import TaskSvc from '../services/taskService';
import TaskCard from '../components/TaskCard';


class KanbanPage extends React.Component{
    constructor(props) {
        super(props);
      
        this.state = {
            taskList: [],
            statusList: ["Backlog","In Progress","In Review", "Complete"]
        }
        
    }

    async componentWillMount(){
        
        TaskSvc.listTasks().then((res) => {
            this.setState({
                taskList: res.data.listTasks.items
            });
        }).catch();
    
    }

    allowDrop = (e) => {
        e.preventDefault();
    }

    drop = (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("card");
        var status = e.target.querySelector('.statusLane').textContent;
        
        e.target.appendChild(document.getElementById(data));
        TaskSvc.updateTaskStatus(status, data).then((resp) => {
            console.log(resp);
        })
    }

    renderKanban(){
        return (
                <Container>
                    <Link to="tasks/new">New</Link>
                <Row>
                {this.state.statusList.map((status, i) => { return (
                    <Col key={i} onDragOver={this.allowDrop} onDrop={this.drop}>
                        <div className="statusLane">{status}</div>
                    {this.state.taskList.map((task) => {
                        if(task.status === status){
                            return <TaskCard title={task.title} description={task.description} author={task.author} id={task.id} key={task.id} />
                        }
                    })}
                    </Col>
                ); })}
                </Row>
                </Container>
        );
    }

    render(){
        return (
        <React.Fragment>
            {this.renderKanban()}
        </React.Fragment>
        );
    }


}

export default connect()(KanbanPage);