export interface IUser {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface IResponseUserRegister {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

export interface IResponseUserLogin {
    userId: string;
    refreshToken: string;
    accessToken: string;
}

export interface ServiceReturn<T> {
    error : Error | null;
    data: T | null;
}

