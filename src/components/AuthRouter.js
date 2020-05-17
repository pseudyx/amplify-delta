import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Layout from './Layout';

export const AuthRoute = ({ component: Component, ...rest }) =>  (
    <Route {...rest} render={props => (
        (rest.private) ? 
        (rest.isAuthenticated)
        ? <Layout {...rest}><Component {...props} userProfile={rest.userProfile} /></Layout>
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        : <Layout isAuthenticated={rest.isAuthenticated}><Component {...props} userHasAuthenticated={rest.userHasAuthenticated} isAuthenticated={rest.isAuthenticated} /></Layout>
    )} />
)