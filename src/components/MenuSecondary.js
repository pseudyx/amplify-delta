import * as React from 'react';
import { Row, Col } from 'reactstrap';

import ProfileBadge from '../badges/profileBadge';
import ClockBadge from '../badges/clockBadge';
import ProfileSvc from '../services/profileService';

import './Menu.css'

export default class DeltaMenu extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
          open: false,
          profileIcon: ""
        };
      }

      async componentDidMount() {
          var profileImg = await ProfileSvc.getProfileImage();
          this.setState({
            profileIcon: profileImg
          });
      }
    
      componentWillUnmount() {
        
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
              <Col><ul className={"profileMenu"}><li><ProfileBadge name={this.props.userProfile?.name} image={this.state.profileIcon} signout={this.props.signout}/></li></ul></Col>
            </Row>
        );
      }
}
