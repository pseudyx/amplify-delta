import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, FormText, Button } from 'reactstrap';
import { publicActions } from '../store/publicStore'
import Menu from '../components/MenuPublic';
import logo from '../delta_logo.svg';
import './Home.css'

class HomePage extends Component {
  constructor(props) {
      super(props);

      this.state = {
        name: '',
        email: '',
        message: ''
      }

      window.addEventListener('scroll', this.scrollCheck, false);
  }

  static getDerivedStateFromProps(props, state) {
    
    if(props.contactSubmit){
      props.contactFormReset();
      return {
        name: '',
        email: '',
        message: ''
      };
    } else {
      return state;
    }
}  

  scrollCheck = (e) => {
    var measure = document.getElementById("banner").offsetHeight;
    if (window.scrollY >= measure) {
      var elTop = document.querySelector(".top");
      if(elTop !== null && elTop !== undefined) elTop.className = "scroll";
    }
    if (window.scrollY <= measure) {
      var elScroll = document.querySelector(".scroll");
      if(elScroll !== null && elScroll !== undefined) elScroll.className = "top";
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
      const { name, email, message } = this.state;
      this.props.sendContactMessage({ name, email, message });
  }

  contactForm(){
    const { name, email, message } = this.state;
    return(<Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label>Contact Us</Label>
              <Input 
                type="input" 
                id="name" 
                name="name" 
                placeholder="Your name" 
                value={name}
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                placeholder="Your email" 
                value={email}
                onChange={this.handleChange} />
            </FormGroup>
            <FormGroup>
              <Input 
                type="textarea" 
                id="message" 
                name="message" 
                rows="3" 
                value={message}
                onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup><FormText>{this.props.error?.message}</FormText></FormGroup>
            <Button>Submit</Button>
          </Form>);
  }

  render(){ 
    return (
      <div className={"top"}>
      <div className={"headerBack"} id={"banner"}>
        <section className={"header"}>
          <Container>
              <Row>
              <div className={"callout"}>
                <div className={"title"}>
                  <h1>Delta Legion</h1>
                  <h2>Deltas are the difference</h2>
                </div>
              </div>
              <img src={logo} className={"Delta-logo"} />
              </Row>
          </Container>
        </section>
        </div>
        <section className={"headerBack"} id={"menu"}>
        <Container><Menu home /></Container>
        </section>
        <div className={"sectionBottom headerBlock"}></div>
        <section>
          <Container>
                  <h2 className={"quote"} id={"homeQuote"}>
                    <span className={"quo"}>&ldquo;</span><span className={"text"}>Intelligence is the ability to adapt to change</span><span className={"quo"}>&rdquo;</span>
                    <span className={"author"}>Stephen Hawking</span>
                  </h2> 
          </Container>
        </section>
        <div className={"sectionBottom hawkingBlock"}></div>
        <section className={"about"} id={"about"}>
          <Container>
            <Row><h2>About</h2></Row>
            <Row>
              <Col>
                <p>Delta Legion is a non-profit intelligence and think-tank organization comprised of members with demonstrated or documented outstanding apditude in problem solving and technology relative fields.</p>
                <p>Members are considered highly talented in their respective fields, and come together in common to share and collaberate on intelligence and solution development.</p>
              </Col>
              
              <Col>
              <p>While intelligence and aptitude are related, aptitude refers to the competence to perform certain kinds of tasks.</p>
                <ul>
                  <li>Aptitude is the inborn potential to do certain kinds of work, either physical or mental, whether developed or undeveloped.</li>
                  <li>Ability is developed knowledge, understanding, learnt or acquired abilities (skills) or attitude.</li>
                </ul>
              </Col>
            </Row>
          </Container>
        </section>
        <div className={"sectionBottom aboutBlock"}></div>
        <section id={"contact"}>
          <Container>
            <Row>
              <Col></Col>
              <Col>
                {this.contactForm()}
              </Col>
            </Row>
          </Container>
        </section>
        <section className="footer">
          <p>
          Privacy Policy | Terms & Conditions<br />
          &copy; Copyright Delta Legion. All Rights Reserved.
          </p>
        </section>
      </div> 
      );
  }
}

const mapState = state => {
  const {contactSubmit, error } = state.public;
  return {
    contactSubmit,
    error
  }
}

export default connect(mapState, publicActions)(HomePage);