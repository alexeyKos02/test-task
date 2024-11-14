import {Task} from "../../types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../store";

interface TasksState {
    value: Task[]
}

const initialState: TasksState = {
    value: [],
}

export const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        loadTasks(state, action: PayloadAction<Task[]>) {
            state.value = action.payload;
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.value.push(action.payload);
        },
        deleteTask: (state, action: PayloadAction<number>) => {
            state.value = state.value.filter(task => task.id !== action.payload);
        },
        deleteSubTask: (state, action: PayloadAction<{ taskId: number, subTaskId: number }>) => {
            const {taskId, subTaskId} = action.payload;
            const task = state.value.find(task => task.id === taskId);

            if (task) {
                task.subTask = task.subTask?.filter(subTask => subTask.id !== subTaskId);
            }
        },
        doneTask: (state, action: PayloadAction<{ id: number, done: boolean }>) => {
            const {id, done} = action.payload;
            const task = state.value.find(task => task.id === id);
            if (task) {
                task.done = done;
            }
        },
        doneSubTask: (state, action: PayloadAction<{ taskId: number, subTaskId: number, done: boolean }>) => {
            const {taskId, subTaskId, done} = action.payload;
            const task = state.value.find(task => task.id === taskId);

            if (task && task.subTask) {
                const subTaskIndex = task.subTask.findIndex(subTask => subTask.id === subTaskId);

                if (subTaskIndex !== -1) {
                    task.subTask[subTaskIndex].done = done;
                    task.done = task.subTask.every(subTask => subTask.done);
                }
            }
        },
        deleteAllDoneTasks(state) {
            state.value = state.value.filter(task => !task.done)
        }
    }
})

export const {addTask, deleteTask, deleteSubTask, doneTask, doneSubTask, deleteAllDoneTasks, loadTasks} = tasksSlice.actions;

export const selectTasks = (state: RootState) => state.tasks.value

export default tasksSlice.reducer;