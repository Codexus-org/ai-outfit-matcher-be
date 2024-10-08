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
    payload: {
      id: string;
      email: string;
      username: string;
    };
    refreshToken: string;
    accessToken: string;
}

export interface IResponseUserLogout {
    refreshToken: string;
}

export interface IResponseUserUpdate {
    userId: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
}

export interface IResposeUserDelete {
    userId: string;
}

export interface ServiceReturn<T> {
    error : Error | null;
    data: T | null;
}

