import * as React from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Menu from '../store/menu.json'
import './Menu.css'


class MenuMain extends React.Component{
    constructor(props) {
        super(props);

      }     

      subMenuToggle = (e) => {
      
      if(!e.target.parentNode.classList.contains("hasSub")) return

        e.preventDefault();
        e.stopPropagation();

        if(e.currentTarget.classList.contains("open")){
          e.currentTarget.classList.remove("open");
        } else {
          e.currentTarget.classList.add("open");
        }

        var sub = e.currentTarget.querySelector('.subMenu');
        if(sub.classList.contains("visible")){
          sub.classList.remove("visible");  
        } else {
          sub.classList.add("visible");
        }
      }

      handleMobileMenu = () => {
        var mnu = document.querySelector(".menuContainer");

        if(mnu.classList.contains("mobile")){
          mnu.classList.remove("mobile");
        } else {
          mnu.classList.add("mobile");
        }
      }

      rootMenu = (items, userProfile) => {
        if(!userProfile) return null;
        return (items) ? (
          <ul className={"menu"}>
            {items.map((item) => {
              var hasSub = (item.sub !== null && item.sub !== undefined);
              if(checkGroups(item.groups, userProfile.groups)){
                return (
                  <li className={`root-level ${hasSub ? "hasSub" : ""}`} onClick={this.subMenuToggle} key={item.link}>
                    <Link to={item.link}>
                    <i className={`icon-${item.icon}`}></i>
                    <span>{item.name}</span>
                    </Link>
                    {this.subMenu(item.sub)}
                  </li>
                );
              }
            })}
          </ul>) : null;
      }

      subMenu = (sub) => {
        return (sub) ? (
            <ul className="subMenu">
              {sub.map((item) => {
                return(<li key={item.link}><Link to={item.link}><span>{item.name}</span></Link></li>);
              })}
            </ul>
          ) : null;
      }

      render(){
          return (
              <div className={"menuContainer"}>
                <header className={"logo-dash"}>
                  <div className={"logo"}>
                    <a href="/delta">
                      <img src="/delta_logo_sm.svg" width="100" />
                    </a>
                  </div>
                  <div className="collapseIcon">
                    <div className={`hamburger closed`} onClick={this.props.onCollapse}></div>
                  </div>
                  <div className="mobileIcon">
                    <div className={`hamburger closed`} onClick={this.handleMobileMenu}></div>
                  </div>
                </header>
                {this.rootMenu(Menu.items, this.props.user)}
              </div>
          );
      }
}

const checkGroups = (allowdGroups, inGroups) => {
  if(allowdGroups.includes("*")) return true;
  return (inGroups) ? allowdGroups.some(group => inGroups.includes(group)) : false;
}

const mapState = state => {
  const {user} = state.user;
  return { user }
}
export default connect(mapState)(MenuMain)
