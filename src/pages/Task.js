import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Label, Input, Row, Col, Jumbotron, ListGroup, ListGroupItem } from 'reactstrap';
import { taskActions } from '../store/taskStore';
import './Task.css';

class TaskPage extends React.Component{
    constructor(props){
        super(props);

        let { id } = this.props.match.params;
 
        this.state = {
           taskId: (this.props.location.pathname.includes("/new")) ? 0 : id,
           isEdit: false,
           setIsEdit: () => this.setState(prev => {return {isEdit: !prev.isEdit}}),
           title: '', 
           status: '', 
           description: ''
        }

        if(this.state.taskId !== 0){
            this.props.getTask(this.state.taskId);
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitComment = this.handleSubmitComment.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const {title, status, description } = props.task;
        return {
            title: (state.taskId == 0) ? '' : title,
            status: (state.taskId == 0) ? '' : status,
            description: (state.taskId == 0) ? '' : description
        };
    }

    handleDeleteTask = async (e) => {
        e.preventDefault();
        var { taskId } = this.state;
        this.props.deleteTask(taskId);
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
            status = (status !== '') ? status : "Backlog";
            if(taskId !== 0){
                this.props.updateTask(taskId, {title, status, description});
            }
            else {
                this.props.addTask({title, status, description, author: this.props.user.name});
            }
        } catch (e){
            console.log(e);

        }
    }

    handleSubmitComment = async (e) => {
        e.preventDefault();
        try{
            const { commentText, taskId } = this.state;
            var comment = {
                content: commentText,
                author: this.props.user.name
            }
            if(commentText !== null && commentText !== undefined && commentText !== ""){
                this.props.addComment(taskId, comment);
            }
        } catch (e){
            console.log(e);

        }
    }

    editForm(){
        const { title, status, description } = this.state;
        return (
            <Form onSubmit={this.handleSubmit}>
            <Jumbotron>
            <FormGroup row>
                    <Col sm={4}>
                        <Input 
                            type="text" 
                            name="title" 
                            id="taskTitle" 
                            placeholder="Name the task" 
                            value={title}
                            onChange={this.handleChange} />
                    </Col>
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
                    <Col sm={4}>{(this.state.taskId !== 0) ? <Button color="danger" className="float-right" onClick={this.handleDeleteTask}><i className="icon-trash"></i></Button> : ''}</Col>
                </FormGroup>
                    <hr className="my-2" />
                    <FormGroup row>
                    <Col sm={12}>
                        <Input 
                            type="textarea" 
                            name="description" 
                            id="taskDescription" 
                            placeholder="Describe the task" 
                            value={description}
                            onChange={this.handleChange} />
                    </Col>
                </FormGroup>
                <Button color="primary">Save</Button>
                </Jumbotron>
            </Form>
        );
    }

    display(){
        
        if(this.state.isEdit){
            return this.editForm()
        } else {
            var { title, status, description } = this.state;
            return(
                <Jumbotron>
                <Button color="primary" className="float-right" onClick={this.state.setIsEdit}><i className="icon-pencil"></i></Button>
                    <p className="lead"><Link to={`/tasks`}><i className="icon-left-open"></i></Link><h2>{title}</h2></p>
                    <hr className="my-2" />
                    <p>{description}</p>
                    <p>Comments:</p>
                    <ListGroup className={"commentList"}>
                        {this.props.comments?.sort((a,b)=>{return new Date(a.createdAt) - new Date(b.createdAt)}).map((comment) => {
                            return (
                            <ListGroupItem key={comment.id}>
                                <Row>
                                    <Col md={10}>
                                <span className={"commentAuthor"}>{`${comment.author}: `}</span>
                                </Col>
                                <Col md={2}>
                                <span className={"commentDate"}>{comment.createdAt}</span>
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


const mapState = state => {
    const {task, comments } = state.task;
    const { user } = state.user;
    return {
        user,
        task, 
        comments    
    }
  }

export default connect(mapState, taskActions)(TaskPage);