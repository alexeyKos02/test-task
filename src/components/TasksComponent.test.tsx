// TasksComponent.test.tsx
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TasksComponent from './TasksComponent';
import { Task } from '../types';

// Мокируем TaskComponent
jest.mock('./TaskComponent.tsx', () => (props: any) => {
    const { task } = props;
    return <div data-testid="task-component">{task.title}</div>;
});

describe('TasksComponent', () => {
    const mockTasks: Task[] = [
        { id: 1, title: 'Первая задача', done: false },
        { id: 2, title: 'Вторая задача', done: true },
    ];

    it('Корректно рендерится без задач', () => {
        render(<TasksComponent tasks={[]} />);
        const tasksWrapper = document.querySelector('.tasks-wrapper');
        expect(tasksWrapper).toBeInTheDocument();
        expect(tasksWrapper).toBeEmptyDOMElement();
    });

    it('Отображает правильное количество TaskComponent', () => {
        render(<TasksComponent tasks={mockTasks} />);
        const taskComponents = screen.getAllByTestId('task-component');
        expect(taskComponents).toHaveLength(mockTasks.length);
    });

    it('Передает правильные данные в TaskComponent', () => {
        render(<TasksComponent tasks={mockTasks} mainTaskId={1} />);
        const taskComponents = screen.getAllByTestId('task-component');

        expect(taskComponents[0]).toHaveTextContent('Первая задача');
        expect(taskComponents[1]).toHaveTextContent('Вторая задача');
    });

    it('Передает дополнительные пропсы в корневой div', () => {
        render(<TasksComponent tasks={[]} data-testid="tasks-wrapper-test" />);
        const tasksWrapper = screen.getByTestId('tasks-wrapper-test');

        expect(tasksWrapper).toBeInTheDocument();
        expect(tasksWrapper).toHaveClass('tasks-wrapper');
    });
});
