import React, { useState } from 'react';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import { userActions } from '../store/userStore'
import './profileBadge.css'

const ProfileBadge = (props) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);
    const image = (props.image !== null && props.image !== undefined && props.image !== "") ? props.image : "/img/no-profile-picture.jpg"
    return (
        <Dropdown isOpen={dropdownOpen} toggle={toggle} className={"profileInfo"}>
        <DropdownToggle
            tag="span"
            data-toggle="dropdown"
            aria-expanded={dropdownOpen}
        >
       
       {props.user?.name} <img src={image} alt="profile" className="img-circle" width="44" />
      
        </DropdownToggle>
        <DropdownMenu right>
            <ul>
                <li onClick={toggle}><Link to="profile"><i className={"icon-vcard"}></i> Profile</Link></li>
                <li onClick={toggle}><a href="" onClick={props.logout}><i className={"icon-logout"}></i> Logout</a></li>
            </ul>
        </DropdownMenu>
        </Dropdown>
    );      
}

const mapState = state => {
    const { user } = state.user;
    return { user }
  }

export default connect(mapState, userActions)(ProfileBadge)

/*TODO: Add notes widget to badge
<li onClick={toggle}><Link to="notes"><i className={"icon-doc-text"}></i> Notes</Link></li>
*/