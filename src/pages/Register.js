import React, { Component } from "react";
import { connect } from "react-redux";
import { Form, FormGroup, Label, Input, Button, FormText, FormFeedback, Col } from "reactstrap";
import { userActions } from '../store/userStore'
import './Register.css'


class RegisterPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validate: {
                emailState: ''
              },
            email: '',
            password: '',
            name: '',
            profile: '',
            code: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    }

    validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state
        if (emailRex.test(e.target.value)) {
        validate.emailState = 'has-success'
        } else {
        validate.emailState = 'has-danger'
        }
        this.setState({ validate })
    }

    handleChange = async (e) => {
        const { target } = e;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const { name } = target;
        await this.setState({
          [ name ]: value,
        });
      }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.props.registerUser(this.state);
    }

    handleCodeSubmit = async (e) => {
        e.preventDefault();
        var confirmUser = this.props.user;
        confirmUser.code = this.state.code;
        this.props.confirmUser(confirmUser);
    }

    handleHover = (e) => {
        e.currentTarget.classList.add("focus");
    }

    handleHoverLeave = (e) => {
        e.currentTarget.classList.remove("focus");
    }
  
    registerForm() {
        const {email, password, name, profile } = this.state;

        return (
            <Form onSubmit={this.handleSubmit} id={"registerForm"}>
                    <FormGroup row id={"emailGroup"} onMouseOver={this.handleHover} onMouseLeave={this.handleHoverLeave}>
                        <Col  sm={12} md={6}>
                            <Label for="email">Email</Label>
                            <Input
                                id="email" 
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                valid={ this.state.validate.emailState === 'has-success' }
                                invalid={ this.state.validate.emailState === 'has-danger' }
                                onChange={ (e) => {
                                    this.validateEmail(e)
                                    this.handleChange(e)
                                } }
                                autoFocus
                            />
                            <FormFeedback>
                                Looks like there is an issue with your email. Please input a valid email
                            </FormFeedback>
                        </Col>
                        <Col>
                            <FormText>
                                Your email will be used as both your login and for notifications. It will not be shared with anyone.
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row id={"passwordGroup"} onMouseOver={this.handleHover} onMouseLeave={this.handleHoverLeave}>
                        <Col sm={12} md={6}>
                            <Label for="password">Password</Label>
                            <Input
                                id="password" 
                                name="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col>
                            <FormText>
                                Initially your password will allow you access to your registration, until membership approved.
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row id={"nameGroup"} onMouseOver={this.handleHover} onMouseLeave={this.handleHoverLeave}>
                        <Col sm={12} md={6}>
                            <Label for="name">Name</Label>
                            <Input
                                id="name" 
                                name="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col>
                            <FormText>
                                A name that your are most comfortable with. This will be used for your Delta Profile, it can be both your first and last name or event a nickname, it does not need to be unique. eg "John Doe" or "Jane". 
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup row id={"profileGroup"} onMouseOver={this.handleHover} onMouseLeave={this.handleHoverLeave}>
                        <Col sm={12} md={6}>
                            <Label for="profile">Profile</Label>
                            <Input
                                id="profile" 
                                name="profile"
                                type="url"
                                placeholder="Profile link"
                                value={profile}
                                onChange={this.handleChange}
                            />
                        </Col>
                        <Col>
                            <FormText>
                                Link to a puplic profile. LinkedIn is the prefferred profile, however you can provide a blog or other social media platform if you prefer.
                            </FormText>
                            <FormText>
                                Your public profile is used to help understand your aptitude alignment for membership assessment.
                            </FormText>
                        </Col>
                    </FormGroup>
                    <FormGroup><FormText>{this.props.error}</FormText></FormGroup>
                    <Button color="primary">
                    Register
                    </Button> 
                </Form>
        );
    }

    confirmForm() {
        const {code} = this.state;
        return (
            <Form onSubmit={this.handleCodeSubmit}>
                <FormGroup>
                <Input
                    id="confirmCode" 
                    name="code"
                    type="text"
                    placeholder="Confirmation Code"
                    value={code}
                    onChange={this.handleChange}
                />
                <FormText>You have been emailed a confirmation code</FormText>
                </FormGroup>
                <Button>
                Confirm
                </Button>  
            </Form>
        );
    }

    render() {
        return((this.props.isEdit) ? this.confirmForm() : this.registerForm())
    }
}

const mapState = state => {
    const { error, isEdit, user } = state.user;
    return {
        error,
        isEdit,
        user
    }
  }

export default connect(mapState, userActions)(RegisterPage)