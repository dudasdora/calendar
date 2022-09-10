export type Appointment = {
    id: number
    start: Date;
    end: Date;
    title?: string;
    color?: string;
    location?: string;
    registered?: boolean;
};
