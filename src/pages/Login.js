import React, { Component } from "react";
import { Auth } from "aws-amplify";
import { Form, FormGroup, Input, Button, FormText, FormFeedback, Row, Col, Card, CardBody, Container } from "reactstrap";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";


export default class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            completeSignUp: false,
            validate: {
                emailState: '',
                formMessage: ''
              }
        };

        this.handleChange = this.handleChange.bind(this);
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
        try{
            const user = await Auth.signIn(this.state.email, this.state.password);
            if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {

                this.setState({
                    user: user,
                    completeSignUp: true
                });
    
            } else {
                this.completeSignIn();
            }
            
        } catch (e){
            console.log(e);
            this.setState({
                validate: {
                    formMessage: e.message
                  }
            })
        }
    }

    handleNewPassword = async () => {
        await Auth.completeNewPassword(
            this.state.user,              // the Cognito User Object
            this.state.password,       // the new password
        );

        this.completeSignIn();
    }

    completeSignIn = () => {
        
        //const session = await Auth.currentSession();
        //window.sessionStorage.setItem("session", JSON.stringify(session));

        this.props.userHasAuthenticated(true);
        this.props.history.push("/delta");
    }

    passwordForm(password) {
        return (
<           Form onSubmit={this.handleNewPassword}>
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
                    <FormGroup><FormText>{this.state.validate.formMessage}</FormText></FormGroup>
                    <Button>
                    Login
                    </Button>  
                </Form>
        );
    }

    render() {
        const { email, password, completeSignUp } = this.state;

        if(this.props.isAuthenticated){
            return <Redirect to="/Delta" />
        } else {
            return(
                <React.Fragment>
                <Row>
                    <Col sm={12} md={7}>
                        <Card>
                            <CardBody>
                                {(completeSignUp) ? this.passwordForm(password) : this.loginForm(email, password)}
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