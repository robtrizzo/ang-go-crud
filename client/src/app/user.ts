
export enum UserStatus {
    Active = 'A',
    Inactive = 'I',
    Terminated = 'T'
}

export type User =  {
    user_id: number;
    user_name: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    user_status?: UserStatus;
    department?: string;
}

// we don't need the user_id or user_status fields when submitting the user
export type SubmitUser = {
    user_name: string;
    first_name?: string | undefined;
    last_name?: string | undefined;
    email?: string | undefined;
    department?: string | undefined;
}

/**
 * Normally I wouldn't write my own regex since it can get the better of
 * the best of us, but I didn't want to spend even more time searching for
 * a well-regarded library to do it.
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 
 * I'm also using the built in angular vailidator on the form fields but,
 * I wanted to be extra safe in case of particularly capable michevous
 * users
 */
export function validateSubmitUser(user: SubmitUser): string[] {
    const errors: string[] = [];

    if (!user.user_name) {
        errors.push('User name is required.');
    }

    if (user.email && !isValidEmail(user.email)) {
        errors.push('Invalid email address.');
    }

    return errors;
}