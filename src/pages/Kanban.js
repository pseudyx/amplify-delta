import * as React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { Link } from 'react-router-dom';
import { taskActions } from '../store/taskStore';
import TaskCard from '../components/TaskCard';


class KanbanPage extends React.Component{
    constructor(props) {
        super(props);        

        this.state = {
            statusList: [],
            tasks: []
        }

        this.props.getTasks();
    }
/*
    static getDerivedStateFromProps(props, state) {
        return {
            statusList: props.statusList,
            tasks: props.tasks,
            nextToken: props.nextToken
        };
    }
*/


    allowDrop = (e) => {
        e.preventDefault();
    }

    drop = (e) => {
        e.preventDefault();
        var data = e.dataTransfer.getData("card");
        var status = e.target.querySelector('.statusLane').textContent;
        
        e.target.appendChild(document.getElementById(data));
        this.props.updateTaskStatus(data, status);
    }

    renderKanban(){
        return (
                <Container>
                    <Link to="tasks/new">New</Link>
                <Row>
                {this.props.statusList.map((status, i) => { return (
                    <Col key={i} onDragOver={this.allowDrop} onDrop={this.drop}>
                        <div className="statusLane">{status}</div>
                    {this.props.tasks.map((task) => {
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

const mapState = state => {
    const {tasks, nextToken, statusList, taskDispatch, error } = state.task;
    return {
        statusList,
        taskDispatch,
        tasks,
        nextToken,
        error
    }
  }

export default connect(mapState, taskActions)(KanbanPage);