import React from 'react';
import {Task} from "../types";
import TaskComponent from "./TaskComponent";
import '../styles/components/TasksStyle.scss'

interface TasksComponentProps extends React.HTMLProps<HTMLDivElement> {
    tasks: Task[],
    mainTaskId?: number,
    deleteFunction?: (id: number) => void,
    checkFunction?: (id: number) => void,
}

const TasksComponent = ({tasks, mainTaskId, deleteFunction, checkFunction, ...props}: TasksComponentProps) => {
    return (
        <div className="tasks-wrapper" {...props}>
            {tasks?.map((task) => (
                <TaskComponent task={task} key={task.id} mainTaskId={mainTaskId} deleteFunction={deleteFunction}
                               checkFunction={checkFunction}/>
            ))}
        </div>
    );
};

export default TasksComponent;