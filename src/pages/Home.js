import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Form, FormGroup, Input, Label, Button } from 'reactstrap';
import Menu from '../components/MenuPublic';
import logo from '../delta_logo.svg';
import './Home.css'

class HomePage extends Component {
  constructor(props) {
      super(props);
  }

  componentWillMount(){
    window.addEventListener('scroll', this.scrollCheck, false);
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
              <Form>
                <FormGroup>
                  <Label>Contact Us</Label>
                  <Input type="input" id="contact.name" placeholder="Your name" />
                </FormGroup>
                <FormGroup>
                  <Input type="email" id="contact.email" placeholder="Your email" />
                </FormGroup>
                <FormGroup>
                  <Input type="textarea" id="contact.message" rows="3" />
                </FormGroup>
                <Button>Submit</Button>
              </Form>
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

export default connect()(HomePage);