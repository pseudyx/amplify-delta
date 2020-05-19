import * as React from 'react';
import { Container } from 'reactstrap';
import MainMenu from './MenuMain';
import TopMenu from './MenuSecondary';
import Menu from './MenuPublic';
import './Layout.css'

export default class Layout extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          compact: false,
        };
    }

    handleCollapse = () => {
        this.setState(prevState => {
           return {compact: !prevState.compact}
        });
    }
    
    AuthLayout(){ 
        return(
            <React.Fragment>
                <div className={`pageContainer private ${(this.state.compact)? "sidebar" : ''}`}>
                    <div className={"mainMenu"}>
                        <MainMenu onCollapse={this.handleCollapse} userProfile={this.props.userProfile} />
                    </div>
                    <div className={"mainContent"}>
                        <TopMenu signout={this.props.signout} userProfile={this.props.userProfile} />
                        <Container fluid>
                            {this.props.children}
                        </Container>
                    </div>
                </div>
            </React.Fragment>
        );
    }


    UnAuthLayout(){
        return(
            <React.Fragment>
                <section className={"header"}>
                    <Container>
                        <Menu isAuthenticated={this.props.isAuthenticated} />
                    </Container>
                </section>
                <div className={"pageContainer public"}>
                    <Container className={"publicPage"}>
                        {this.props.children}
                    </Container>
                </div>
                <section className={"footer"}>
                <p>
                Privacy Policy | Terms & Conditions<br />
                &copy; Copyright Delta Legion. All Rights Reserved.
                </p>
                </section>
            </React.Fragment>
        );
    }

    render(){
        return (this.props.private) ? this.AuthLayout() : this.UnAuthLayout();
    }
}