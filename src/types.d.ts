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

export interface ActivityInput {
    category: string;
    description: string;
    emission: number;
    activityDate: Date;
    userId?: number; //check this later
};