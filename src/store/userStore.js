import { Auth } from "aws-amplify";
import ProfileSvc from './repo/profileService'

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
    login: (email, password) => {
        return async dispatch => {
            dispatch(request({email}));
            
            Auth.signIn(email, password).then((user) => {
                if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    dispatch(challenge(user));    
                } else {
                    userActions.checkSession();
                    //dispatch(success(user));
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
    completeNewPassword: (user, password) => {
        return async dispatch => {
            Auth.completeNewPassword(
                user,          // the Cognito User Object
                password       // the new password
            ).then(() => {
                userActions.checkSession();
            });
        }
    },
    logout: () => {
        return async dispatch => {
            Auth.signOut().then(() => {
                dispatch(request());
            });
        }
        function request() { return {type: actionTypes.LOGOUT_REQUEST }}
    },
    checkSession: () => {
        return async dispatch => {
            try {
                //dispatch(load());
                var userSession = await Auth.currentSession();
                var payload = userSession.accessToken.decodePayload();
                var groups = payload["cognito:groups"];
                var userId = payload.username;
                
                await ProfileSvc.getProfile(userId)
                .then((res) => {
                  var profile = res.data.getProfile;
                  profile.groups = groups;
                  dispatch(complete(profile));
                }).catch((error) => {
                    dispatch(failure(error));
                });
              }
              catch(e) {
                dispatch(failure(e));
              }
        }
      
        function load() {return { type: actionTypes.SESSION_LOAD }}
        function complete(user) {return { type: actionTypes.SESSION_COMPLETE, user }}
        function failure(error) {return { type: actionTypes.SESSION_FAILURE, error }}
    
      },
      getUsers: (limit, next) => {
        return async dispatch => {
            //dispatch(request(next));
              
            await ProfileSvc.listProfiles(limit, next)
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