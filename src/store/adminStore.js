import AdminSvc from './repo/adminService';
import { history } from './history';

export const initialState = {
    users: [],
    nextToken: null    
}

// ----------------
// ACTION TYPES 
export const actionTypes = { 
    ADMIN_USER_LIST_REQUEST: 'ADMIN_USER_LIST_REQUEST',
    ADMIN_USER_LIST_SUCCESS: 'ADMIN_USER_LIST_SUCCESS',
    ADMIN_USER_LIST_FAILURE: 'ADMIN_USER_LIST_FAILURE',

    ADMIN_CONFIRM_INITIATE_SUCCESS: 'ADMIN_CONFIRM_INITIATE_SUCCESS',
    ADMIN_CONFIRM_INITIATE_FAILURE: 'ADMIN_CONFIRM_INITIATE_FAILURE',
}

// ----------------
// BOUND ACTION CREATORS
export const adminActions = {
      getUsers: (limit, next) => {
        return async dispatch => {
            //dispatch(request(next));
              
            await AdminSvc.userList(limit, next)
            .then((resp) => {   
                const { Users, nextToken } = resp;
                dispatch(success(Users, nextToken));
            }).catch((resp) => {
                dispatch(failure(resp));
            });

          }

          function request(nextToken){return {type: actionTypes.ADMIN_USER_LIST_REQUEST, nextToken }}
          function success(items, nextToken){return {type: actionTypes.ADMIN_USER_LIST_SUCCESS, items, nextToken }}
          function failure(error){return {type: actionTypes.ADMIN_USER_LIST_FAILURE, error }}
      },
      usersInGroup: (group, limit, next) => {
        return async dispatch => {
            //dispatch(request(next));
              
            await AdminSvc.usersInGroup(group, limit, next)
            .then((resp) => {   
                const { Users, nextToken } = resp;
                dispatch(success(Users, nextToken));
            }).catch((resp) => {
                dispatch(failure(resp));
            });

          }

          function request(nextToken){return {type: actionTypes.ADMIN_USER_LIST_REQUEST, nextToken }}
          function success(items, nextToken){return {type: actionTypes.ADMIN_USER_LIST_SUCCESS, items, nextToken }}
          function failure(error){return {type: actionTypes.ADMIN_USER_LIST_FAILURE, error }}
      },
      confirmInitiate: (username) => {
        return async dispatch => {

            await AdminSvc.addUserToGroup(username, 'legion')
            .then((resp) => {
                AdminSvc.removeUserFromGroup(username, 'initiate').then((res) => {
                    dispatch(success(username));
                }).catch((res)=> {
                    dispatch(failure(res));
                })
            }).catch((resp => {
                dispatch(failure(resp));
            }));
        }

        function success(username){return {type: actionTypes.ADMIN_CONFIRM_INITIATE_SUCCESS, username }}
        function failure(error){return {type: actionTypes.ADMIN_CONFIRM_INITIATE_FAILURE, error }}
      }    
}

// ----------------
// REDUCER
export const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.ADMIN_USER_LIST_SUCCESS:
            return Object.assign({}, state, {
                users: action.items,
                nextToken: action.nextToken
            });
        case actionTypes.ADMIN_USER_LIST_FAILURE:
            return {
                error: action.error
            };
        case actionTypes.ADMIN_CONFIRM_INITIATE_SUCCESS:
            var users = state.users.filter((user) => { return user.Username !== action.username });
            return {
                users: users
            }
        case actionTypes.ADMIN_CONFIRM_INITIATE_FAILURE:
            return {
                error: action.error
            };
       
        default:
            return state;
    }
}