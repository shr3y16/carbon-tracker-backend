export interface UserRegisterInput {
    email: string;
    password: string;
    name: string;
}

export interface LoggedInUser {
    id: number;
    email: string;
    name: string;
}
