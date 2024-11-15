import '../styles/components/TaskInputStyle.scss'
import TasksComponent from "./TasksComponent";
import {Task} from "../types";
import React, {useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {changeFullVersion, selectAppVersion} from "../store/reducers/AppStateSlice";
import {addTask} from "../store/reducers/TasksSlice";
import {errorNotify, successNotify} from "../utils/notifications";

const TaskInputComponent = () => {
    const formRef = useRef<HTMLFormElement | null>(null);
    const fullVersion = useAppSelector(selectAppVersion);
    const dispatch = useAppDispatch();
    const [task, setTask] = useState<Task>({id: 0, done: false, title: "", subTask: []});

    function changeVersion() {
        dispatch(changeFullVersion(!fullVersion));
        setTask({id: 0, done: false, title: "", subTask: []});
    }

    function changeTitle(event: React.ChangeEvent<HTMLInputElement>) {
        setTask({...task, title: event.target.value});
    }

    function addSubTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (formRef.current) {
            const formData = new FormData(formRef.current);
            const taskTitle = formData.get('subtasks');
            setTask({
                ...task,
                subTask: [...task.subTask || [], {id: Date.now(), title: String(taskTitle), done: false}]
            });
            formRef.current?.reset();
        }
        successNotify('Подзадача добавлена');
    }

    function deleteSubTask(id: number) {
        setTask({
            ...task,
            subTask: task.subTask?.filter(task => task.id !== id),
        });
    }

    function checkSubTask(id: number) {
        const subTask = task.subTask?.find(task => task.id === id);
        if (subTask) {
            subTask.done = !subTask.done;
            setTask({...task, subTask: task.subTask?.map(task => task.id === id ? subTask : task)})
        }
        if (task && task.subTask) {
            task.done = task.subTask.every(subTask => subTask.done);
            setTask(task);
        }
    }

    function addFullTask(event?: React.FormEvent<HTMLFormElement>) {
        event?.preventDefault();
        if (task.title) {
            dispatch(addTask({...task, id: Date.now()}));
            setTask({id: 0, done: false, title: "", subTask: []});
            const container = document.getElementsByClassName('tasks-wrapper')[0];
            container?.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
            successNotify('Задача добавлена');
        } else {
            errorNotify("Задача не добавлена");
        }
    }

    return (
        <div className={`task-input ${fullVersion ? 'task-input--open' : ''}`}>
            <div className="short-view">
                <button className="dropdown-toggle" onClick={changeVersion}>{fullVersion ? '▲' : '▼'}</button>
                <form onSubmit={addFullTask} aria-label="task-form">
                    <label htmlFor="subtasks">
                        <input
                            type="text"
                            id="taskTitle"
                            value={task.title}
                            name="taskTitle"
                            placeholder="Введите название"
                            onChange={changeTitle}
                            autoComplete="off"
                            required
                        />
                    </label>
                </form>
            </div>
            {fullVersion && <div className="extra-view">
                <div className="extra-view__add-task-wrapper">
                    <form ref={formRef} onSubmit={addSubTask}>
                        <label htmlFor="subtasks">
                            <input type="text" id="subtasks" name="subtasks" placeholder="Введите подзадачу"
                                   autoComplete="off" required/>
                        </label>
                        <div className='extra-view__add-task-controls'>
                            <button type="submit" className="add-button">Добавить</button>
                            <button className="add-button" onClick={() => addFullTask()} type="button">Сохранить
                            </button>
                        </div>
                    </form>
                    {task.subTask && task.subTask.length > 0 &&
                        <TasksComponent tasks={task.subTask || []} deleteFunction={deleteSubTask}
                                        checkFunction={checkSubTask}/>}
                </div>
            </div>}
        </div>
    );
};

export default TaskInputComponent;