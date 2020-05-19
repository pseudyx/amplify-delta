import * as React from 'react';
import { Auth } from "aws-amplify";
import { Route, Redirect, Switch} from 'react-router';
import { withRouter } from 'react-router-dom';
import { AuthRoute } from './components/AuthRouter';
import ProfileSvc from './services/profileService';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Kanban from './pages/Kanban';
import Task from './pages/Task'
import Legion from './pages/Group';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        isAuthenticated: false,
        userSession: {}
    }
  }

  userHasAuthenticated = (value) => {
    this.checkSession();
  }

  handleLogout = async event => {
    await Auth.signOut();
    this.userHasAuthenticated(false);
    this.props.history.push("/");
  }

  checkSession = async () => {
    try {
      var userSession = await Auth.currentSession();
      var payload = userSession.accessToken.decodePayload();
      var groups = payload["cognito:groups"];
      var userId = payload.username;
      await ProfileSvc.getProfile(userId)
      .then((res) => {
        var profile = res.data.getProfile;
        profile.groups = groups;
        this.setState({ 
          isAuthenticated: true,
          userProfile: profile
        });
      }).catch();
    }
    catch(e) {
      console.log(e);
      if (e !== 'No current user') {
        
      }
    }

  }

  componentWillMount(){
    this.checkSession();
  }

  componentDidMount() {
    
  }

  render(){
    return (
      <Switch>
          <Route exact path='/' component={Home} />
          <AuthRoute exact path="/login" component={Login} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} />
          <AuthRoute exact path="/register" component={Register} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} />
          <AuthRoute exact private path='/delta' component={Dashboard} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} 
              userProfile={this.state.userProfile}
              roles={["Legion"]}
              signout={this.handleLogout} />
          <AuthRoute exact private path='/profile' component={Profile} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} 
              userProfile={this.state.userProfile}
              roles={["Legion"]}
              signout={this.handleLogout} />
          <AuthRoute exact private path='/tasks' component={Kanban} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} 
              userProfile={this.state.userProfile}
              roles={["Legion"]}
              signout={this.handleLogout} />
          <AuthRoute exact private path='/tasks/new' component={Task} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} 
              userProfile={this.state.userProfile}
              roles={["Legion"]}
              signout={this.handleLogout} />
          <AuthRoute exact private path='/tasks/:id' component={Task} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} 
              userProfile={this.state.userProfile}
              roles={["Legion"]}
              signout={this.handleLogout} />
          <AuthRoute exact private path='/legion' component={Legion} 
              userHasAuthenticated={this.userHasAuthenticated} 
              isAuthenticated={this.state.isAuthenticated} 
              userProfile={this.state.userProfile}
              roles={["Legion"]}
              signout={this.handleLogout} />
          <Redirect from="*" to="/login" />
      </Switch>
    );
  }
}

export default withRouter(App);