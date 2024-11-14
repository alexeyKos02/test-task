import { render, screen, fireEvent } from '@testing-library/react';
import TaskComponent from './TaskComponent';
import { Task } from '../types';
import { useAppDispatch } from '../hooks/redux';
import { doneTask, deleteTask } from '../store/reducers/TasksSlice';
import '@testing-library/jest-dom';
jest.mock('../hooks/redux');
jest.mock('../store/reducers/TasksSlice');
const mockDispatch = jest.fn();

const mockedUseAppDispatch = jest.mocked(useAppDispatch);
mockedUseAppDispatch.mockReturnValue(mockDispatch);
const task: Task = {
    id: 1,
    title: 'Test Task',
    done: false,
    subTask: [
        {
            id: 2,
            title: 'Sub Task 1',
            done: false,
        },
        {
            id: 3,
            title: 'Sub Task 2',
            done: true,
        },
    ],
};
describe('TaskComponent', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('должен отображать название задачи', () => {
        render(<TaskComponent task={task} />);
        const titleElement = screen.getByText('Test Task');
        expect(titleElement).toBeInTheDocument();
    });

    it('должен отображать чекбокс с правильным состоянием', () => {
        render(<TaskComponent task={task} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('должен вызывать checkFunction при изменении состояния чекбокса, если она передана через пропсы', () => {
        const mockCheckFunction = jest.fn();
        render(<TaskComponent task={task} checkFunction={mockCheckFunction} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockCheckFunction).toHaveBeenCalledWith(task.id);
    });

    it('должен диспатчить doneTask при изменении состояния чекбокса, если checkFunction не передана', () => {
        render(<TaskComponent task={task} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockDispatch).toHaveBeenCalledWith(doneTask({ id: task.id, done: true }));
    });

    it('должен вызывать deleteFunction при клике на кнопку удаления, если она передана через пропсы', () => {
        const mockDeleteFunction = jest.fn();
        render(<TaskComponent task={task} deleteFunction={mockDeleteFunction} />);
        const deleteButton = screen.getByRole('button');
        fireEvent.click(deleteButton);
        expect(mockDeleteFunction).toHaveBeenCalledWith(task.id);
    });

    it('должен диспатчить deleteTask при клике на кнопку удаления, если deleteFunction не передана', () => {
        render(<TaskComponent task={task} />);
        const deleteButton = screen.getByRole('button');
        fireEvent.click(deleteButton);
        expect(mockDispatch).toHaveBeenCalledWith(deleteTask(task.id));
    });

    it('должен переключать отображение подзадач при клике на задачу', () => {
        render(<TaskComponent task={task} />);
        const taskDiv = screen.getByText('Test Task').closest('.task');
        expect(taskDiv).toBeInTheDocument();

        // Проверяем, что подзадачи изначально не отображаются
        expect(screen.queryByText('Sub Task 1')).not.toBeInTheDocument();

        // Кликаем по задаче, чтобы раскрыть подзадачи
        fireEvent.click(taskDiv!);

        // Теперь подзадачи должны отображаться
        expect(screen.getByText('Sub Task 1')).toBeInTheDocument();
        expect(screen.getByText('Sub Task 2')).toBeInTheDocument();
    });
});
