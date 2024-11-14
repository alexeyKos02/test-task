import React from 'react';
import {Task} from "../types";
import CloseIcon from '../assets/Close.svg';
import '../styles/components/TaskStyle.scss'
import TasksComponent from "./TasksComponent";
import { useAppDispatch } from "../hooks/redux";
import { deleteSubTask, doneSubTask, doneTask } from "../store/reducers/TasksSlice";
import { deleteTask } from "../store/reducers/TasksSlice";


interface TasksComponentProps extends React.HTMLProps<HTMLDivElement> {
    task: Task,
    mainTaskId?: number,
    deleteFunction?: (id: number) => void,
    checkFunction?: (id: number) => void,
}

const TaskComponent = ({task, mainTaskId, deleteFunction, checkFunction, ...props}: TasksComponentProps) => {
    const [fullVersion, setFullVersion] = React.useState<boolean>(false);
    const dispatch = useAppDispatch();

    function check() {
        if (checkFunction) {
            checkFunction(task.id)
        } else {
            if (mainTaskId) {
                dispatch(doneSubTask({taskId: mainTaskId, subTaskId: task.id, done: !task.done}))
            } else {
                dispatch(doneTask({id: task.id, done: !task.done}))
            }
        }
    }

    function changeVersion() {
        setFullVersion(!fullVersion);
    }

    function deleteActualTask() {
        if (deleteFunction) {
            deleteFunction(task.id);
        } else {
            if (mainTaskId) {
                dispatch(deleteSubTask({taskId: mainTaskId, subTaskId: task.id}))
            } else {
                dispatch(deleteTask(task.id))
            }
        }
    }

    return (
        <>
            <div className="task" {...props} onClick={changeVersion}>
                <div className="task__left">
                    <div className="task__checkbox-container">
                        <input type="checkbox" id={String(task.id)} className="checkbox-input" onChange={check}
                               checked={task.done}/>
                        <label htmlFor={String(task.id)} className="checkbox-label"></label>
                    </div>
                    <div className="task__title">
                        {task.title}
                    </div>
                </div>
                <button className="task__delete-button" onClick={deleteActualTask}>
                    <img src={CloseIcon} alt="close"/>
                </button>
            </div>
            {fullVersion && task.subTask && task.subTask.length > 0 && <div className="sub-tasks">
                <TasksComponent tasks={task.subTask} mainTaskId={task.id}/>
            </div>}
        </>

    );
};

export default TaskComponent;