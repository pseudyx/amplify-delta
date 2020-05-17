import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {  Button, Container, Form, FormGroup, Label, Input, Row, Col, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';
import TaskSvc from '../services/taskService';
import './Task.css';



class TaskPage extends React.Component{
    constructor(props){
        super(props);

        let { id } = this.props.match.params;
        const { name } = this.props.userProfile;

        this.state = {
           taskId: (this.props.location.pathname.includes("/new")) ? 0 : id,
           isEdit: false,
           setIsEdit: () => this.setState(prev => {return {isEdit: !prev.isEdit}}),
           name
        }

        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        if(this.state.taskId !== 0){
            TaskSvc.getTask(this.state.taskId).then((resp) => {
                var { title, status, description, created } = resp.data.getTask;
                var comments = resp.data.getTask.comments.items;
                this.setState({
                    title,
                    status,
                    description,
                    created,
                    comments
                })
            }).catch();
        }
    }

    handleChange = async (event) => {
        const { target } = event;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
          [ name ]: value,
        });
      }

    handleSubmit = async (e) => {
        e.preventDefault();
        try{
            var {title, status, description, taskId } = this.state;
            status = status ?? "Backlog";
            if(taskId !== 0){
                TaskSvc.updateTask({title, status, description}, taskId).then(() => {
                    this.props.history.push('/tasks');
                });
            }
            else {
                TaskSvc.createTask({title, status, description}).then(() => {
                    this.props.history.push('/tasks');
                });
            }
        } catch (e){
            console.log(e);

        }
    }

    handleSubmitComment = async (e) => {
        e.preventDefault();
        try{
            const { commentText, taskId, name } = this.state;
            var comment = {
                content: commentText,
                author: name
            }
            if(commentText !== null && commentText !== undefined && commentText !== ""){
                TaskSvc.createComment(comment, taskId).then((resp) => {
                    this.setState(prev => {
                        
                        var cmnts = prev.comments
                        cmnts.push(resp.data.createComment);

                        return {
                        comments: cmnts
                        }
                    })
                }).catch();
            }
        } catch (e){
            console.log(e);

        }
    }

    editForm(){
        var { title, status, description } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormGroup row>
                    <Label for="taskTitle" sm={2}>Title *</Label>
                    <Col sm={4}>
                        <Input 
                            type="text" 
                            name="title" 
                            id="taskTitle" 
                            placeholder="Name the task" 
                            value={title}
                            onChange={this.handleChange} />
                    </Col>
                    <Label for="taskStatus" sm={2}>Status</Label>
                    <Col sm={4}>
                        <Input 
                            type="select" 
                            name="status" 
                            id="taskStatus"
                            value={status}
                            onChange={this.handleChange}>
                            <option>Backlog</option>
                            <option>In Progress</option>
                            <option>In Review</option>
                            <option>Complete</option>
                        </Input>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label for="taskDescription" sm={2}>Description</Label>
                    <Col sm={10}>
                        <Input 
                            type="textarea" 
                            name="description" 
                            id="taskDescription" 
                            placeholder="Describe the task" 
                            value={description}
                            onChange={this.handleChange} />
                    </Col>
                </FormGroup>
                <Button>Save</Button>
            </Form>
        );
    }

    display(){
        
        if(this.state.isEdit){
            return this.editForm()
        } else {
            var { title, status, description, created, comments } = this.state;
            return(
                <div>
                <Jumbotron>
                <Button color="primary" className="float-right" onClick={this.state.setIsEdit}><i className="icon-pencil"></i></Button>
                    <p className="lead"><Link to={`/tasks`}><i className="icon-left-open"></i></Link>{title}</p>
                    <hr className="my-2" />
                    <p>{description}</p>
                    <p>Comments:</p>
                    <ListGroup className={"commentList"}>
                        {comments?.sort((a,b)=>{return new Date(a.created) - new Date(b.created)}).map((comment) => {
                            return (<ListGroupItem key={comment.id}>
                                <Row>
                                    <Col md={10}>
                                <span className={"commentAuthor"}>{`${comment.author}: `}</span>
                                </Col>
                                <Col md={2}>
                                <span className={"commentDate"}>{comment.created}</span>
                                </Col>
                                </Row>
                                <Row>
                                    <Col><span>{comment.content}</span></Col>
                                
                                </Row>
                                
                                
                                </ListGroupItem>);
                        })}
                        <ListGroupItem>
                            <Form onSubmit={this.handleSubmitComment}>
                                <Row form>
                                    <Col>
                                    <FormGroup>
                                        <Input type="text" id="commentText" name="commentText" placeholder="Add Commnet ..." onChange={this.handleChange} />
                                    </FormGroup>
                                    </Col>
                                    <Button>Enter</Button> 
                                </Row>
                                
                                
                            </Form>
                        </ListGroupItem>
                    </ListGroup>
                </Jumbotron>
              </div>
            );
        }
    }

    render(){
        return (
            <Container>
                {(this.state.taskId !== 0) ? this.display() : this.editForm()}
            </Container>
        );
    }
}

export default connect()(TaskPage);