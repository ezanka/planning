
export enum TaskType {
    Work = 'travail',
    Personal = 'personnel',
    Sport = 'sport',
    Other = 'autre'
}

export interface Task {
    id: string;
    title: string;
    startHour: number;
    startMinute: number;
    endHour: number;
    endMinute: number;
    type: TaskType;
    date: Date;
};