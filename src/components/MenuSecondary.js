import * as React from 'react';
import { Row, Col } from 'reactstrap';

import ProfileBadge from '../badges/profileBadge';
import ClockBadge from '../badges/clockBadge';

import './Menu.css'

export default class DeltaMenu extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
          open: false
        };
      }

      menuToggle = () => {
        this.setState(prevState => {
          return {
            open: !prevState.open
          }
        })
      }

      render(){
        return (
            <Row className="menuSecondary">
              <Col><ul className={"badgeMenu"}><li><ClockBadge /></li></ul></Col>
              <Col><ul className={"profileMenu"}><li><ProfileBadge /></li></ul></Col>
            </Row>
        );
      }
}
