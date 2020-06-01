import TaskSvc from './repo/taskService';
import { history } from './history';

export const initialState = {
    statusList: ["Backlog","In Progress","In Review", "Complete"],
    taskDispatch: false,
    tasks: [],
    nextToken: null,
    task: {},
    comments: [] 
}

// ----------------
// ACTION TYPES 
export const actionTypes = { 
    ADD_TASK_REQUEST: 'ADD_TASK_REQUEST',
    ADD_TASK_SUCCESS: 'ADD_TASK_SUCCESS',
    ADD_TASK_FAILURE: 'ADD_TASK_FAILURE',

    GET_TASK_REQUEST: 'GET_TASK_REQUEST',
    GET_TASK_SUCCESS: 'GET_TASK_SUCCESS',
    GET_TASK_FAILURE: 'GET_TASK_FAILURE',

    TASK_UPDATING: 'TASK_UPDATING',
    TASK_UPDATED: 'TASK_UPDATED',
    TASK_FAILURE: 'TASK_FAILURE',

    TASK_LIST_REQUEST: 'TASK_LIST_REQUEST',
    TASK_LIST_SUCCESS: 'TASK_LIST_SUCCESS',
    TASK_LIST_FAILURE: 'TASK_LIST_FAILURE',

    TASK_STATUS_UPDATING: 'TASK_STATUS_UPDATING',
    TASK_STATUS_UPDATED: 'TASK_STATUS_UPDATED',
    TASK_STATUS_FAILURE: 'TASK_STATUS_FAILURE',

    ADD_COMMENT_REQUEST: 'ADD_COMMENT_REQUEST',
    ADD_COMMENT_SUCCESS: 'ADD_COMMENT_SUCCESS',
    ADD_COMMENT_FAILURE: 'ADD_COMMENT_FAILURE',

    TASK_DELETE_SUCCESS: 'TASK_DELETE_SUCCESS',
    TASK_DELETE_FAILURE: 'TASK_DELETE_FAILURE'
}

// ----------------
// BOUND ACTION CREATORS
export const taskActions = {
    addTask: (task) => {
        return async dispatch => {
            dispatch(request(task));

            await TaskSvc.createTask(task)
            .then((res) => {
                var newTask = res.data.createTask;
                dispatch(success(newTask));
                history.push('/tasks');
            }).catch((res) => {
                dispatch(failure(res.message))
            })
        }

        function request(task) {return { type: actionTypes.ADD_TASK_REQUEST, task }}
        function success(task) {return { type: actionTypes.ADD_TASK_SUCCESS, task }}
        function failure(error) {return { type: actionTypes.ADD_TASK_FAILURE, error }}
    },
    getTask: (taskId) => {
        return async dispatch => {
            dispatch(request());

            await TaskSvc.getTask(taskId)
            .then((resp) => {
                var { title, status, description, createdAt } = resp.data.getTask;
                var comments = resp.data.getTask.comments.items;
                dispatch(success({taskId, title, status, description, createdAt}, comments));
            }).catch((resp) => {
                dispatch(failure(resp));
            });
        }

        function request() {return { type: actionTypes.GET_TASK_REQUEST }}
        function success(task, comments) {return { type: actionTypes.GET_TASK_SUCCESS, task, comments }}
        function failure(error) {return { type: actionTypes.GET_TASK_FAILURE, error }}
    },
    getTasks: () => {
        return async dispatch => {
            dispatch(request());

            await TaskSvc.listTasks()
            .then((res) => {
                const {items, nextToken} = res.data.listTasks;
                dispatch(success(items, nextToken));
            }).catch((res) => {
                dispatch(failure(res));
            });
        }

        function request() {return { type: actionTypes.TASK_LIST_REQUEST }}
        function success(tasks, nextToken) {return { type: actionTypes.TASK_LIST_SUCCESS, tasks, nextToken }}
        function failure(error) {return { type: actionTypes.TASK_LIST_FAILURE, error }}
    },
    updateTask: (taskId, task) => {
        return async dispatch => {
            dispatch(updating());

            await TaskSvc.updateTask(taskId, task).then(() => {
                dispatch(updated());
                history.push('/tasks');
            }).catch((resp) => {
                dispatch(failure(resp));
            });
        }

        function updating() {return { type: actionTypes.TASK_UPDATING }}
        function updated() {return { type: actionTypes.TASK_UPDATED }}
        function failure(error) {return { type: actionTypes.TASK_FAILURE, error }}

    },
    updateTaskStatus: (taskId, status) => {
        return async dispatch => {
            dispatch(updating());
            await TaskSvc.updateTaskStatus(taskId, status)
            .then((resp) => {
                console.log(resp);
                dispatch(updated());
            }).catch((resp) => {
                dispatch(failure(resp))
            })

        }

        function updating() {return { type: actionTypes.TASK_STATUS_UPDATING }}
        function updated() {return { type: actionTypes.TASK_STATUS_UPDATED }}
        function failure(error) {return { type: actionTypes.TASK_STATUS_FAILURE, error }}
    },
    addComment: (taskId, comment) => {
        return async dispatch => {
            dispatch(request(comment));

            await TaskSvc.createComment(taskId, comment)
            .then((res) => {
                var newComment = res.data.createTask;
                dispatch(success(newComment));
            }).catch((res) => {
                dispatch(failure(res.message))
            })
        }

        function request(comment) {return { type: actionTypes.ADD_COMMENT_REQUEST, comment }}
        function success(comment) {return { type: actionTypes.ADD_COMMENT_SUCCESS, comment }}
        function failure(error) {return { type: actionTypes.ADD_COMMENT_FAILURE, error }}
    },
    deleteTask: (taskId) => {
        return async dispatch => {
            await TaskSvc.deleteTask(taskId)
            .then((res) => {
                dispatch(success(taskId));
                history.push('/tasks');
            }).catch((error) => {
                dispatch(failure(error.message))
            })
        }

        function success(taskId) {return { type: actionTypes.TASK_DELETE_SUCCESS, taskId }}
        function failure(error) {return { type: actionTypes.TASK_DELETE_FAILURE, error }}
    }
}

// ----------------
// REDUCER
export const reducer = (state = initialState, action) => {
    switch(action.type){
        case actionTypes.ADD_TASK_SUCCESS:
            return Object.assign({}, state, {
                tasks: (state.tasks) ? [ ...state.tasks, action.task ] : [ action.task ]
            })
        case actionTypes.GET_TASK_SUCCESS:
            return {
                ...state,
                task: action.task,
                comments: action.comments
            }
        case actionTypes.TASK_LIST_REQUEST:
            return {
                ...state,
                taskDispatch: true
            }
        case actionTypes.TASK_LIST_SUCCESS:
            return {
                ...state,
                tasks: action.tasks,
                nextToken: action.nextToken,
                taskDispatch: false
            }
        case actionTypes.TASK_LIST_FAILURE:
            return {
                ...state,
                taskDispatch: false,
                error: action.error
            }
        case actionTypes.TASK_STATUS_UPDATING:
            return {
                ...state,
                taskDispatch: true
            }
        case actionTypes.TASK_STATUS_UPDATED:
            return {
                ...state,
                taskDispatch: false
            }
        case actionTypes.TASK_STATUS_FAILURE:
            return {
                ...state,
                taskDispatch: false,
                error: action.error
            }
        case actionTypes.ADD_COMMENT_SUCCESS:
            return Object.assign({}, state, {
                comments: [ ...state.comments, action.comment ]
            })
        case actionTypes.TASK_DELETE_SUCCESS:
            var newTasks = state.tasks.filter((task)=>{return task.id !== action.taskId});
            return Object.assign({}, state, {
                tasks: newTasks
            })
        default:
            return state;
    }
}