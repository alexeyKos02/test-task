import {render, screen, fireEvent} from '@testing-library/react';
import MenuComponent from './MenuComponent';
import {Filters} from '../types';
import '@testing-library/jest-dom';

describe('MenuComponent', () => {
    const mockChangeFilters = jest.fn();
    const mockDeleteFunction = jest.fn();

    const additionalProps = {
        'data-testid': 'menu-component',
        className: 'custom-class',
    };

    beforeEach(() => {
        jest.clearAllMocks();

        render(
            <MenuComponent
                changeFilters={mockChangeFilters}
                deleteFunction={mockDeleteFunction}
                count={5}
                {...additionalProps}
            />
        );
    });

    it('должен отображать правильное количество задач', () => {
        const countElement = screen.getByText(/осталось/i);
        expect(countElement).toHaveTextContent('5 осталось');
    });

    it('должен вызывать changeFilters с Filters.All при клике на кнопку "Все"', () => {
        const allButton = screen.getByRole('button', {name: /Все/i});
        fireEvent.click(allButton);
        expect(mockChangeFilters).toHaveBeenCalledTimes(1);
        expect(mockChangeFilters).toHaveBeenCalledWith(Filters.All);
    });

    it('должен вызывать changeFilters с Filters.NotDone при клике на кнопку "Активные"', () => {
        const activeButton = screen.getByRole('button', {name: /Активные/i});
        fireEvent.click(activeButton);
        expect(mockChangeFilters).toHaveBeenCalledTimes(1);
        expect(mockChangeFilters).toHaveBeenCalledWith(Filters.NotDone);
    });

    it('должен вызывать changeFilters с Filters.Done при клике на кнопку "Завершенные"', () => {
        const doneButton = screen.getByRole('button', {name: /^Завершенные$/i});
        fireEvent.click(doneButton);
        expect(mockChangeFilters).toHaveBeenCalledTimes(1);
        expect(mockChangeFilters).toHaveBeenCalledWith(Filters.Done);
    });

    it('должен вызывать deleteFunction при клике на кнопку "Удалить завершенные"', () => {
        const deleteButton = screen.getByRole('button', {name: /Удалить завершенные/i});
        fireEvent.click(deleteButton);
        expect(mockDeleteFunction).toHaveBeenCalledTimes(1);
    });

    it('должен передавать дополнительные пропсы в корневой div', () => {
        const menuComponent = screen.getByTestId('menu-component');
        expect(menuComponent).toHaveClass('custom-class');
    });
});
