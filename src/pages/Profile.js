import * as React from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Input, Label, Button, FormText, Row, Col, Progress, Card, CardBody, CardTitle, CardText, CardLink } from 'reactstrap';
import { userActions } from '../store/userStore'
import './Profile.css';

class ProfilePage extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            image: '/img/no-profile-picture.jpg',
            error: '',
            upload: 0,
            userId: '',
            name: '',
            role: '',
            company: '',
            profile: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const {userId, name,role,company, profile, error} = props.user;
        
        const notEq = (objA, objB) => {
            return ( objA !== null 
            && objA !== undefined
            && objA !== ''
            && objA !== objB) ? objA : objB
        }

        return {
            userId,
            name: notEq(state.name, name),
            role: notEq(state.role, role),
            company: notEq(state.company, company),
            profile: notEq(state.profile, profile),
            error: notEq(state.error, error)
        };
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
        this.props.updateUser(this.state);
    }

    editForm() {
        const {name, role, company, profile} = this.state;
        return (
            <React.Fragment>
                <Col sm={12} md={6}>
                    <Card>
                        {this.profileImage()}
                    </Card>
                </Col>
                <Col>
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label>Name</Label>
                            <Input
                                id="name" 
                                name="name"
                                type="input"
                                placeholder="Name"
                                value={name}
                                onChange={this.handleChange}
                                autoFocus
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Role</Label>
                            <Input
                                id="role" 
                                name="role"
                                type="input"
                                placeholder="Role"
                                value={role}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Company</Label>
                            <Input
                                id="company" 
                                name="company"
                                type="input"
                                placeholder="Company"
                                value={company}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Profile</Label>
                            <Input
                                id="profile" 
                                name="profile"
                                type="input"
                                placeholder="Profile"
                                value={profile}
                                onChange={this.handleChange}
                            />
                        </FormGroup>
                        <FormGroup><FormText>{this.state.error}</FormText></FormGroup>
                        <Button>Save</Button>  
                    </Form>
                </Col>
            </React.Fragment>
        );
    }

    onFileClick = () => {
        var fileBtn = document.getElementById('fileUp'); 
        fileBtn.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    onFileChange = (e) => {
        const file = e.target.files[0];
        
    }

    uploadProgress = (progress) => {
        this.setState({upload:(progress.loaded/progress.total)*100});
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    }

    profileImage(){
        var image = this.state.image;
        return(
            <React.Fragment>
                <img src={image} alt={this.state.name} width="100%" onClick={this.onFileClick} id={"fileUpImg"} />
                <input id={"fileUp"}
                    type="file" accept='image/jpeg'
                    onChange={this.onFileChange}
                />
                {(this.state.upload > 0) ? <Progress value={this.state.upload} /> : ""}
            </React.Fragment>
        );
    }

    profileCard() {
        const {name, role, company, profile} = this.state;
        return (
            <React.Fragment>
            <Col sm={12} md={6}>
            <Card>
                <CardBody>
                    <CardTitle>{name} <div className="float-right"><a><i className="icon-pencil" onClick={this.props.setIsEdit}></i></a></div></CardTitle>
                </CardBody>
                {this.profileImage()}
                <CardBody>
                    <CardText>{role}</CardText>
                    <CardText>{company}</CardText>
                    <CardLink href={profile} target="_blank">Public Profile <i className={"icon-popup"}></i></CardLink>
                </CardBody>
            </Card>
            </Col>
            <Col></Col>
            </React.Fragment>
        );
    }

    render(){
        return (
            <Row>
              {(this.props.isEdit) ? this.editForm() : this.profileCard()}
            </Row>
        );
    }


}

const mapState = state => {
    const { user, isEdit } = state.user;
    return {
        user,
        isEdit
    };
  }

export default connect(mapState, userActions)(ProfilePage)