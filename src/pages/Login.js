import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";
import { Form, FormGroup, Input, Button, FormText, FormFeedback, Row, Col, Card, CardBody, Container } from "reactstrap";
import { userActions } from '../store/userStore'


class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            validate: {
                emailState: ''
              }
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewPassword = this.handleNewPassword.bind(this);
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
        const { from } = this.props.location?.state
        this.props.login(this.state.email, this.state.password, from?.pathname);
    }

    handleNewPassword = async (e) => {
        e.preventDefault();
        this.props.newPassword(this.props.user, this.state.password);
    }



    passwordForm(password) {
        return (
            <Form onSubmit={this.handleNewPassword}>
                <FormGroup>
                <Input
                    id="newPassword" 
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={this.handleChange}
                />
                <FormText>You need to set a new password</FormText>
                </FormGroup>
                <Button>
                Update
                </Button>  
            </Form>
        );
    }

    loginForm(email, password) {
        return (
            <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
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
                    </FormGroup>
                    <FormGroup>
                        <Input
                            id="password" 
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup><FormText>{this.props.error?.message}</FormText></FormGroup>
                    <Button>
                    Login
                    </Button>  
                </Form>
        );
    }

    render() {
        const { email, password } = this.state;

        if(this.props.isAuthenticated){
            return <Redirect to="/Delta" />
        } else {
            return(
                <React.Fragment>
                <Row>
                    <Col sm={12} md={7}>
                        <Card>
                            <CardBody>
                                {(this.props.challengePassword) ? this.passwordForm(password) : this.loginForm(email, password)}
                            </CardBody>
                        </Card>
                    </Col>
                    <Col sm={12} md={4}>
                    <Container>
                    <h3>Join the Legion</h3>
                        <p>As a member organisation Delta Legion members are voted into membership. To express intetest in joining the Delta Legion, please fill in the register form.</p>
                        <p><Link to="/register">Register</Link></p>
                        </Container>
                    </Col>
                </Row>
                </React.Fragment>
            );
        }

       
    }
}

const mapState = state => {
    const {user, isAuthenticated, challengePassword, loginDispatch, error } = state.user;
    return {
        isAuthenticated,
        loginDispatch,
        challengePassword,
        error,
        user
    }
  }

export default connect(mapState, userActions)(LoginPage)