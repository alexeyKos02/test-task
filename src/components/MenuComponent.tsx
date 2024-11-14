import '../styles/components/MenuStyle.scss'
import {Filters} from "../types";
import React from "react";

interface MenuComponentProps extends React.HTMLProps<HTMLDivElement> {
    changeFilters: (filter: Filters) => void;
    deleteFunction: () => void;
    count: number,
}

const MenuComponent = ({changeFilters,deleteFunction, count , ...props}: MenuComponentProps) => {
    return (
        <div {...props}>
            <div className="menu">
                <span className="menu__count-tasks">{count} осталось</span>
                <div className="menu__filters">
                    <button onClick={() => changeFilters(Filters.All)}>Все</button>
                    <button onClick={() => changeFilters(Filters.NotDone)}>Активные</button>
                    <button onClick={() => changeFilters(Filters.Done)}>Завершенные</button>
                </div>
                <div className="menu__controls">
                    <button onClick={deleteFunction}>
                        Удалить завершенные
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuComponent;