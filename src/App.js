import * as React from 'react';
import { connect } from "react-redux";
import { Route, Redirect, Switch} from 'react-router';
import { userActions } from './store/userStore'
import { AuthRoute } from './components/AuthRouter';

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
    this.props.checkSession();
  }

  

  render(){
    return (
      <Switch>
          <Route exact path='/' component={Home} />
          <AuthRoute exact path="/login" component={Login} isAuthenticated={this.props.isAuthenticated} />
          <AuthRoute exact path="/register" component={Register} isAuthenticated={this.props.isAuthenticated} />
          <AuthRoute exact private path='/delta' component={Dashboard} isAuthenticated={this.props.isAuthenticated} roles={["legion"]} />
          <AuthRoute exact private path='/profile' component={Profile} isAuthenticated={this.props.isAuthenticated} roles={["legion"]} />
          <AuthRoute exact private path='/tasks' component={Kanban} isAuthenticated={this.props.isAuthenticated} roles={["legion"]} />
          <AuthRoute exact private path='/tasks/new' component={Task} isAuthenticated={this.props.isAuthenticated} roles={["legion"]} />
          <AuthRoute exact private path='/tasks/:id' component={Task} isAuthenticated={this.props.isAuthenticated} roles={["legion"]} />
          <AuthRoute exact private path='/legion' component={Legion} isAuthenticated={this.props.isAuthenticated} roles={["legion"]} />
      </Switch>
    );
  }
}

const mapState = state => {
  const {user, isAuthenticated } = state.user;
  return {
      isAuthenticated,
      user
  }
}

export default connect(mapState, userActions)(App);