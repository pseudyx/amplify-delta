import UserSvc from './repo/userService';
import { history } from './history';

export const initialState = {
    isAuthenticated: false,
    loginDispatch: false,
    challengePassword: false,
    user: {},
    isEdit: false,
    users: [],
    nextToken: null,
    uploadProgress: 0
}

// ----------------
// ACTION TYPES 
export const actionTypes = { 
    LOGIN_REQUEST: 'LOGIN_REQUEST',
    LOGIN_CHALLENGE: 'LOGIN_CHALLENGE',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_VARIFY: 'LOGIN_VARIFY',
    LOGIN_FAILURE: 'LOGIN_FAILURE',

    LOGOUT_REQUEST: 'LOGOUT_REQUEST',

    SESSION_LOAD: 'SESSION_LOAD',
    SESSION_COMPLETE: 'SESSION_COMPLETE',
    SESSION_FAILURE: 'SESSION_FAILURE',

    USER_LIST_REQUEST: 'USER_LIST_REQUEST',
    USER_LIST_SUCCESS: 'USER_LIST_SUCCESS',
    USER_LIST_FAILURE: 'USER_LIST_FAILURE',

    TOGGLE_USER_EDIT: 'TOGGLE_USER_EDIT',

    USER_UPDATE_REQUEST: 'USER_UPDATE_REQUEST',
    USER_UPDATE_SUCCESS: 'USER_UPDATE_SUCCESS',
    USER_UPDATE_FAILURE: 'USER_UPDATE_FAILURE',

    REGISTER_USER_SUCCESS: 'REGISTER_USER_SUCCESS',
    REGISTER_USER_FAILURE: 'REGISTER_USER_FAILURE',
    
    CONFIRM_USER_SUCCESS: 'CONFIRM_USER_SUCCESS',
    CONFIRM_USER_FAILURE: 'CONFIRM_USER_FAILURE',
    CONFIRM_USER_LOGIN: 'CONFIRM_USER_LOGIN',

    USER_PIC_UPDATE_REQUEST: 'USER_PIC_UPDATE_REQUEST',
    USER_PIC_UPDATE_PROGRESS: 'USER_PIC_UPDATE_PROGRESS',
    USER_PIC_UPDATE_SUCCESS: 'USER_PIC_UPDATE_SUCCESS',
    USER_PIC_UPDATE_FAILURE: 'USER_PIC_UPDATE_FAILURE',
}

// ----------------
// BOUND ACTION CREATORS
export const userActions = {
    registerUser: (userRegister) => {
        return async dispatch => {

            var validation = await UserSvc.validateRegistration(userRegister);

            if(validation.valid === true){
                UserSvc.registerUser(userRegister).then((profile) => {
                    dispatch(success(profile));
                }).catch((error) => {
                    dispatch(failure(error));
                });
            } else {
                dispatch(failure(validation.message));
            }
        }

        function success(user) {return { type: actionTypes.REGISTER_USER_SUCCESS, user }}
        function failure(error) {return { type: actionTypes.REGISTER_USER_FAILURE, error }}
    },
    resendVarify: (email) => {
        return async dispatch => {
            UserSvc.resendVarify(email).then((resp) => {
                dispatch(varify());
            }).catch((error)=>{
                dispatch(failure(error));
            })
        }
        function varify() {return { type: actionTypes.LOGIN_VARIFY }}
        function failure(error) {return { type: actionTypes.CONFIRM_USER_FAILURE, error }}
    },
    confirmUser: (userConfirm) => {
        return async dispatch => {
            UserSvc.confirmUser(userConfirm).then((profile) => {
                dispatch(success(profile));
                if(userConfirm.password){
                    dispatch(login(userConfirm));
                }
                history.push('/delta');
            }).catch((error)=>{
                dispatch(failure(error));
            })
        }
        function success(user) {return { type: actionTypes.CONFIRM_USER_SUCCESS, user }}
        function failure(error) {return { type: actionTypes.CONFIRM_USER_FAILURE, error }}
        function login(user){return { type: actionTypes.CONFIRM_USER_LOGIN, user }}
    },
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
                if(error.name === 'UserNotConfirmedException'){
                    dispatch(varify());
                } else {
                    console.log(error);
                    dispatch(failure(error));
                }
            });
        }

        function request(user) {return { type: actionTypes.LOGIN_REQUEST, user }}
        function challenge(user) {return { type: actionTypes.LOGIN_CHALLENGE, user }}
        function success(user) {return { type: actionTypes.LOGIN_SUCCESS, user }}
        function varify() {return { type: actionTypes.LOGIN_VARIFY }}
        function failure(error) {return { type: actionTypes.LOGIN_FAILURE, error }}
    },
    newPassword: (user, password) => {
        return async dispatch => {
            await UserSvc.newPassword(
                user,          // the Cognito User Object
                password       // the new password
            ).then(() => {
                UserSvc.userSession().then((profile) => {
                    dispatch(success(profile));
                    history.push('/delta');
                }).catch((error) => {
                    dispatch(failure(error));
                });
            });
        }

        function success(user) {return { type: actionTypes.LOGIN_SUCCESS, user }}
        function failure(error) {return { type: actionTypes.LOGIN_FAILURE, error }}
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
      getLegion: (limit, next) => {
        return async dispatch => {
            //dispatch(request(next));
              
            await UserSvc.listProfiles(limit, next)
            .then((resp) => {   
                const { profiles, nextToken } = resp;
                dispatch(success(profiles, nextToken));
            }).catch((resp) => {
                dispatch(failure(resp));
            });

          }

          function request(nextToken){return {type: actionTypes.USER_LIST_REQUEST, nextToken }}
          function success(items, nextToken){return {type: actionTypes.USER_LIST_SUCCESS, items, nextToken }}
          function failure(error){return {type: actionTypes.USER_LIST_FAILURE, error }}
      },
      setIsEdit:() => {
          return {type: actionTypes.TOGGLE_USER_EDIT }
      },
      updateUser: (user) => {
        return async dispatch => { 
            dispatch(request(user));
            UserSvc.updateProfile(user.userId, user)
            .then((profile) => {
                dispatch(success(profile));
            }).catch((error) => {
                dispatch(failure(error));
            })
        }

        function request(user){return {type: actionTypes.USER_UPDATE_REQUEST, user }}
        function success(user){return {type: actionTypes.USER_UPDATE_SUCCESS, user }}
        function failure(error){return {type: actionTypes.USER_UPDATE_FAILURE, error }}
      },
      uploadUserPic: (file, callBack) => {
        return async dispatch => {
            UserSvc.updateProfilePic(file, callBack)
            .then((resp) => {
                dispatch(success());
            }).catch((error) => {
                dispatch(failure(error));
            })
        }

        function success(){return {type: actionTypes.USER_PIC_UPDATE_SUCCESS }}
        function failure(error){return {type: actionTypes.USER_PIC_UPDATE_FAILURE, error }}
      },
      uploadUserPicProgress: (progress) => {
        return {type: actionTypes.USER_PIC_UPDATE_PROGRESS, progress }
      },
      checkUserThumb: () => {
          UserSvc.checkUserThumb();
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
        case actionTypes.LOGIN_VARIFY:
            return {
                challengePassword: true,
                isEdit: true
            }
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
        case actionTypes.TOGGLE_USER_EDIT:
            return {
                ...state,
                isEdit: !state.isEdit
            }
        case actionTypes.USER_UPDATE_REQUEST:
            return{
                ...state
            }
        case actionTypes.USER_UPDATE_SUCCESS:
            return {
                ...state,
                user: action.user,
                isEdit: !state.isEdit
            }
        case actionTypes.USER_UPDATE_FAILURE:
            return {
                ...state,
                error: action.error
            }
        case actionTypes.REGISTER_USER_SUCCESS:
            return {
                user: action.user,
                isEdit: true
            };
        case actionTypes.REGISTER_USER_FAILURE:
            return {
                error: action.error  
            };
        case actionTypes.CONFIRM_USER_SUCCESS:
            return {
                user: action.user,
                isEdit: false
            };
        case actionTypes.CONFIRM_USER_FAILURE:
            return {
                error: action.error
            };
        case actionTypes.CONFIRM_USER_LOGIN:
            userActions.login(action.user.username,action.user.password)
            return{
                ...state
            }
        case actionTypes.USER_PIC_UPDATE_PROGRESS:
            var prog = (action.progress.loaded/action.progress.total)*100;
            return{
                ...state,
                uploadProgress: prog
            }
        case actionTypes.USER_PIC_UPDATE_SUCCESS:
            userActions.checkUserThumb();
            return{
                ...state,
                uploadProgress: 0
            }
        case actionTypes.USER_PIC_UPDATE_FAILURE:
            return {
                error: action.error
            };
        default:
            return state;
    }
}