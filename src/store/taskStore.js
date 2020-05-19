import TaskSvc from './repo/taskService';

export const initialState = {
    tasks: []
}

// ----------------
// ACTION TYPES 
export const actionTypes = { 
    ADD_TASK_REQUEST: 'ADD_TASK_REQUEST',
    ADD_TASK_SUCCESS: 'ADD_TASK_SUCCESS',
    ADD_TASK_FAILURE: 'ADD_TASK_FAILURE'
}

// ----------------
// BOUND ACTION CREATORS
export const actions = {
    addTask: (task) => {
        return dispatch => {
            dispatch(request(task));
            //Add task logic here
            TaskSvc.createTask(task)
            .then((res) => {
                var newTask = res.data.createTask;
                dispatch(success(newTask));
            }).catch((res) => {
                dispatch(failure(res.message))
            })
        }

        function request(task) {return { type: actionTypes.ADD_TASK_REQUEST, task }}
        function success(task) {return { type: actionTypes.ADD_TASK_SUCCESS, task }}
        function failure(error) {return { type: actionTypes.ADD_TASK_FAILURE, error }}
    }
}

// ----------------
// REDUCER
export const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_TASK_SUCCESS:
            return Object.assign({}, state, {
                tasks: [ ...state.tasks, action.task ]
              })
        default:
            return state;
    }
}