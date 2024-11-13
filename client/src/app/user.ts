
export enum UserStatus {
    Active = 'A',
    Inactive = 'I',
    Terminated = 'T'
}

export interface User {
    user_id: number;
    user_name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    user_status?: UserStatus;
    department?: string;
}