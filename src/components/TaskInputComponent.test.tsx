import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskInputComponent from './TaskInputComponent';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { changeFullVersion } from '../store/reducers/AppStateSlice';
import {addTask} from '../store/reducers/TasksSlice';
import {errorNotify, successNotify} from "../utils/notifications";

jest.mock('./TasksComponent', () => () => <div data-testid="tasks-component">Mock TasksComponent</div>);
jest.mock('../hooks/redux');
jest.mock('../utils/notifications', () => ({
    successNotify: jest.fn(),
    errorNotify: jest.fn(),
}));

const mockedUseAppDispatch = useAppDispatch as jest.MockedFunction<typeof useAppDispatch>;
const mockedUseAppSelector = useAppSelector as jest.MockedFunction<typeof useAppSelector>;

describe('TaskInputComponent', () => {
    const mockDispatch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        mockedUseAppDispatch.mockReturnValue(mockDispatch);
        mockedUseAppSelector.mockReturnValue(false);
    });

    it('Корректно рендерится без задач', () => {
        render(<TaskInputComponent />);

        const taskTitleInput = screen.getByPlaceholderText('Введите название');
        expect(taskTitleInput).toBeInTheDocument();

        const toggleButton = screen.getByRole('button', { name: /▼/i });
        expect(toggleButton).toBeInTheDocument();

        // Extra view не должен отображаться
        const subTaskInput = screen.queryByPlaceholderText('Введите подзадачу');
        expect(subTaskInput).not.toBeInTheDocument();
    });

    it('Тогглит полную версию при нажатии на кнопку', () => {
        render(<TaskInputComponent />);

        const toggleButton = screen.getByRole('button', { name: /▼/i });
        fireEvent.click(toggleButton);

        expect(mockDispatch).toHaveBeenCalledWith(changeFullVersion(true));
        mockedUseAppSelector.mockReturnValue(true);
        render(<TaskInputComponent />);

        const subTaskInput = screen.getByPlaceholderText('Введите подзадачу');
        expect(subTaskInput).toBeInTheDocument();

        const saveButton = screen.getByRole('button', { name: /Сохранить/i });
        expect(saveButton).toBeInTheDocument();
    });

    it('Позволяет вводить название задачи и сохранять ее', () => {
        render(<TaskInputComponent />);

        const taskTitleInput = screen.getByPlaceholderText('Введите название');
        fireEvent.change(taskTitleInput, { target: { value: 'Новая задача' } });

        const form = taskTitleInput.closest('form');
        expect(form).toBeInTheDocument();

        fireEvent.submit(form!);

        expect(mockDispatch).toHaveBeenCalledWith(
            addTask(expect.objectContaining({
                title: 'Новая задача',
                id: expect.any(Number),
                done: false,
                subTask: [],
            }))
        );

        expect(successNotify).toHaveBeenCalledWith('Задача добавлена');
    });

    it('Показывает ошибку при попытке сохранить задачу без названия', () => {
        render(<TaskInputComponent />);
        const form = screen.getByRole('form', { name: 'task-form' });
        fireEvent.submit(form);

        expect(errorNotify).toHaveBeenCalledWith('Задача не добавлена');
        expect(mockDispatch).not.toHaveBeenCalledWith(addTask(expect.anything()));
    });

    it('Позволяет добавлять подзадачи', () => {
        // Устанавливаем fullVersion = true
        mockedUseAppSelector.mockReturnValue(true);

        render(<TaskInputComponent />);

        const subTaskInput = screen.getByPlaceholderText('Введите подзадачу');
        const addButton = screen.getByRole('button', { name: /Добавить/i });

        fireEvent.change(subTaskInput, { target: { value: 'Подзадача 1' } });
        fireEvent.click(addButton);

        // Предполагаем, что TasksComponent был вызван с новыми подзадачами
        expect(screen.getByTestId('tasks-component')).toBeInTheDocument();

        // Повторим для второй подзадачи
        fireEvent.change(subTaskInput, { target: { value: 'Подзадача 2' } });
        fireEvent.click(addButton);

        expect(screen.getByTestId('tasks-component')).toBeInTheDocument();
    });

    it('Позволяет сохранять задачу с подзадачами', () => {
        // Устанавливаем fullVersion = true
        mockedUseAppSelector.mockReturnValue(true);

        render(<TaskInputComponent />);

        const taskTitleInput = screen.getByPlaceholderText('Введите название');
        fireEvent.change(taskTitleInput, { target: { value: 'Основная задача' } });

        const subTaskInput = screen.getByPlaceholderText('Введите подзадачу');
        const addButton = screen.getByRole('button', { name: /Добавить/i });

        fireEvent.change(subTaskInput, { target: { value: 'Подзадача 1' } });
        fireEvent.click(addButton);

        fireEvent.change(subTaskInput, { target: { value: 'Подзадача 2' } });
        fireEvent.click(addButton);

        const saveButton = screen.getByRole('button', { name: /Сохранить/i });
        fireEvent.click(saveButton);

        expect(mockDispatch).toHaveBeenCalledWith(
            addTask(expect.objectContaining({
                title: 'Основная задача',
                id: expect.any(Number),
                done: false,
                subTask: [
                    expect.objectContaining({ title: 'Подзадача 1', done: false }),
                    expect.objectContaining({ title: 'Подзадача 2', done: false }),
                ],
            }))
        );

        expect(successNotify).toHaveBeenCalledWith('Задача добавлена');
    });
});
