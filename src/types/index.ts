export interface Task {
    id: number,
    title: string,
    subTask?: Task[],
    done: boolean,
}

export enum Filters {
    All = 'All',
    Done = 'Done',
    NotDone = 'NotDone',
}