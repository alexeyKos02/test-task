import {configureStore} from "@reduxjs/toolkit";
import tasksReducer from './reducers/TasksSlice';
import appStateReducer from './reducers/AppStateSlice';

export const store = configureStore({
    reducer: {
        tasks: tasksReducer,
        appState: appStateReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch