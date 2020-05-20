import UserSvc from './repo/userService';
import { history } from './history';

export const initialState = {
    isAuthenticated: false,
    loginDispatch: false,
    challengePassword: false,
    user: {},
    users: [],
    nextToken: null    
}

// ----------------
// ACTION TYPES 
export const actionTypes = { 
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_CHALLENGE: 'LOGIN_CHALLENGE',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',

    LOGOUT_REQUEST: 'LOGOUT_REQUEST',

    SESSION_LOAD: 'SESSION_LOAD',
    SESSION_COMPLETE: 'SESSION_COMPLETE',
    SESSION_FAILURE: 'SESSION_FAILURE',

    USER_LIST_REQUEST: 'USER_LIST_REQUEST',
    USER_LIST_SUCCESS: 'USER_LIST_SUCCESS',
    USER_LIST_FAILURE: 'USER_LIST_FAILURE'
    
}

// ----------------
// BOUND ACTION CREATORS
export const userActions = {
    login: (email, password, redirect) => {
        return async dispatch => {
            dispatch(request({email}));
            
            await UserSvc.login(email, password).then((user) => {
                if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    dispatch(challenge(user));    
                } else {
                    UserSvc.userSession().then((profile) => {
                        dispatch(success(profile));
                        (redirect) ? history.push(redirect) : history.push('/delta');
                    }).catch((error) => {
                        dispatch(failure(error));
                    });
                }    
            }).catch((error) => {
                dispatch(failure(error));
            });
        }
        

        function request(user) {return { type: actionTypes.LOGIN_REQUEST, user }}
        function challenge(user) {return { type: actionTypes.LOGIN_CHALLENGE, user }}
        function success(user) {return { type: actionTypes.LOGIN_SUCCESS, user }}
        function failure(error) {return { type: actionTypes.LOGIN_FAILURE, error }}
    },
    newPassword: (user, password) => {
        return async dispatch => {
            await UserSvc.newPassword(
                user,          // the Cognito User Object
                password       // the new password
            ).then(() => {
                userActions.checkSession();
            });
        }
    },
    logout: () => {
        return async dispatch => {
            UserSvc.logout().then(() => {
                dispatch(request());
            });
        }
        function request() { return {type: actionTypes.LOGOUT_REQUEST }}
    },
    checkSession: () => {
        return async dispatch => {
            await UserSvc.userSession().then((profile) => {
                dispatch(complete(profile));
            }).catch((error) => {
                dispatch(failure(error));
            });
        }
      
        function load() {return { type: actionTypes.SESSION_LOAD }}
        function complete(user) {return { type: actionTypes.SESSION_COMPLETE, user }}
        function failure(error) {return { type: actionTypes.SESSION_FAILURE, error }}
    
      },
      getUsers: (limit, next) => {
        return async dispatch => {
            //dispatch(request(next));
              
            await UserSvc.listProfiles(limit, next)
            .then((res) => {   
                const { items, nextToken } = res.data.listProfiles;
                dispatch(success(items, nextToken));
            }).catch((resp) => {
                dispatch(failure(resp));
            });
          }

          function request(nextToken){return {type: actionTypes.USER_LIST_REQUEST, nextToken }}
          function success(items, nextToken){return {type: actionTypes.USER_LIST_SUCCESS, items, nextToken }}
          function failure(error){return {type: actionTypes.USER_LIST_FAILURE, error }}
      },
      registerUser: (newUser) => {


      }
}

// ----------------
// REDUCER
export const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.LOGIN_REQUEST:
            return {
                loginDispatch: true,
                user: action.user
            };
        case actionTypes.LOGIN_CHALLENGE:
                return {
                    challengePassword: true,
                    loginDispatch: false,
                    user: action.user
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                isAuthenticated: true,
                loginDispatch: false,
                user: action.user
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                isAuthenticated: false,
                loginDispatch: false,
                error: action.error  
            };
        case actionTypes.LOGOUT_REQUEST:
                return {
                    isAuthenticated: false,
                    user: {}  
            };
        case actionTypes.SESSION_COMPLETE:
                return {
                    isAuthenticated: true,
                    user: action.user  
            };
        case actionTypes.SESSION_FAILURE:
            return {
                isAuthenticated: false,
                user: {}
            };
        case actionTypes.USER_LIST_SUCCESS:
            return Object.assign({}, state, {
                users: action.items,
                nextToken: action.nextToken
            });
        case actionTypes.USER_LIST_FAILURE:
            return {
                error: action.error
            };
        default:
            return state;
    }
}