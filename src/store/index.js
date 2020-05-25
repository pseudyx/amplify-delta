import * as adminStore from './adminStore';
import * as userStore from './userStore';
import * as taskStore from './taskStore';

export const ApplicationState = {
    admin: adminStore.initialState,
    user: userStore.initialState,
    task: taskStore.initialState
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
    admin: adminStore.reducer,
    user: userStore.reducer,
    task: taskStore.reducer
};