import { IsEmail, IsEnum, IsNotEmpty, validate } from 'class-validator';

export enum UserStatus {
    Active = 'A',
    Inactive = 'I',
    Terminated = 'T'
}

export class User {
    user_id!: number;

    @IsNotEmpty()
    user_name!: string;

    first_name?: string;
    last_name?: string;

    @IsEmail()
    email?: string;

    @IsEnum(UserStatus)
    user_status!: UserStatus;

    department?: string;
}

async function validateUser(user: User) {
    const errors = await validate(user);
    if (errors.length > 0) {
        console.log('Validation failed. Errors: ', errors);
    } else {
        console.log('Validation succeeded.');
    }
}