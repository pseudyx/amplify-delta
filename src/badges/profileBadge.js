import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
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
       
       {props.name} <img src={image} alt="" className="img-circle" height="44" width="44" />
      
        </DropdownToggle>
        <DropdownMenu right>
            <ul>
                <li onClick={toggle}><Link to="profile"><i className={"icon-vcard"}></i> Edit Profile</Link></li>
                <li onClick={toggle}><Link to="notes"><i className={"icon-doc-text"}></i> Notes</Link></li>
                <li onClick={toggle}><a onClick={props.signout}><i className={"icon-logout"}></i> Logout</a></li>
            </ul>
        </DropdownMenu>
        </Dropdown>
    );      
}

export default ProfileBadge;
