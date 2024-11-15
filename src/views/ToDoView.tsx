import TaskInputComponent from "../components/TaskInputComponent.tsx";
import TasksComponent from "../components/TasksComponent.tsx";
import '../styles/views/ToDoStyle.scss'
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {changeFilters, selectAppFilters, selectAppVersion} from "../store/reducers/AppStateSlice.ts";
import MenuComponent from "../components/MenuComponent.tsx";
import {Filters, Task} from "../types";
import {useEffect, useState} from "react";
import {deleteAllDoneTasks, loadTasks} from "../store/reducers/TasksSlice.ts";
import {successNotify} from "../utils/notifications";

const ToDoView = () => {
    const tasks = useAppSelector((state) => state.tasks.value);
    const fullVersion = useAppSelector(selectAppVersion);
    const filters = useAppSelector(selectAppFilters);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
    const dispatch = useAppDispatch();

    function changeAppFilters(filters: Filters) {
        dispatch(changeFilters(filters))
    }

    function deleteAllAppDoneTask() {
        dispatch(deleteAllDoneTasks())
        successNotify("Все завершенные задачи удалены");
    }

    useEffect(() => {
        switch (filters) {
            case Filters.All:
                setFilteredTasks(tasks);
                break;
            case Filters.NotDone:
                setFilteredTasks(tasks.filter(task => !task.done));
                break;
            case Filters.Done:
                setFilteredTasks(tasks.filter(task => task.done));
                break;
        }
    }, [filters, tasks])

    useEffect(() => {
        const tasksJSON = localStorage.getItem('tasks');
        if (tasksJSON !== null) {
            dispatch(loadTasks(JSON.parse(tasksJSON)));
        } else {
            dispatch(loadTasks([]));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks])
    return (
        <div className="wrapper">
            <TaskInputComponent/>
            {!fullVersion && filteredTasks.length > 0 && <TasksComponent tasks={filteredTasks}/>}
            <MenuComponent className="wrapper__menu" changeFilters={changeAppFilters}
                           deleteFunction={deleteAllAppDoneTask} count={tasks.filter(task => !task.done).length}/>
        </div>
    );
};

export default ToDoView;