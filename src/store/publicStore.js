import PublicSvc from './repo/publicService';
import { history } from './history';

export const initialState = {
    contacts: [],
    nextToken: null,
    error: '',
    contactSubmit: false
}

// ----------------
// ACTION TYPES 
export const actionTypes = { 
    PUBLIC_CONTACT_REQUEST: 'PUBLIC_CONTACT_REQUEST',
    PUBLIC_CONTACT_SUCCESS: 'PUBLIC_CONTACT_SUCCESS',
    PUBLIC_CONTACT_FAILURE: 'PUBLIC_CONTACT_FAILURE',

    PUBLIC_CONTACT_RESET: 'PUBLIC_CONTACT_RESET',
}

// ----------------
// BOUND ACTION CREATORS
export const publicActions = {
      sendContactMessage: (contact) => {
        return async dispatch => {
            //dispatch(request(next));
              
            await PublicSvc.createContactMessage(contact)
            .then((resp) => {   
                dispatch(success());
            }).catch((resp) => {
                dispatch(failure(resp));
            });

          }

          function success(){return {type: actionTypes.PUBLIC_CONTACT_SUCCESS }}
          function failure(error){return {type: actionTypes.PUBLIC_CONTACT_FAILURE, error }}
      },
      contactFormReset: () => {
          return { type: actionTypes.PUBLIC_CONTACT_RESET }
    }
}

// ----------------
// REDUCER
export const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.PUBLIC_CONTACT_RESET:
            return {
                contactSubmit: false
            }
        case actionTypes.PUBLIC_CONTACT_SUCCESS:
            return {
                contactSubmit: true
            }
        case actionTypes.PUBLIC_CONTACT_FAILURE:
            return {
                error: action.error
            };
        default:
            return state;
    }
}