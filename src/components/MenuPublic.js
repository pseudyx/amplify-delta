import React, { useState } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavLink,
  NavbarText
} from 'reactstrap';

const MenuPublic = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  homeLinks = () => {
      return (
        <React.Fragment>
          <NavItem><NavLink href="#about">About</NavLink></NavItem>
          <NavItem><NavLink href="#contact">Contact</NavLink></NavItem>
        </React.Fragment>
      );
  }

  return (
    <div>
      <Navbar color="faded" dark expand="md">
        <NavbarBrand href="/"><img src="/delta_logo_sm.svg" width="100" /></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="mr-auto" navbar>
              { (props.home) ? homeLinks() : null }
           
          </Nav>
          <NavbarText><NavLink href="/Delta">Login</NavLink></NavbarText>
        </Collapse>
      </Navbar>
    </div>
  );
}

export default MenuPublic;
/*
<NavItem className={"float-right"}>
  <NavLink href="/Delta">Login</NavLink>
</NavItem>
*/