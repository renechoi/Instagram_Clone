export interface User {
    pk?: number;
    email?: string;
    username?: string;
    description?: string;
    profile?: any;
    updated: string;
}

export const InitUser: User = {
    pk: 0,
    email: '',
    username: '',
    description: '',
    profile: null,
    updated: ''
}

export interface UserState {
    user: User,
    error: any,
    loading: boolean
}

export const InitUserState: UserState = {
    user: InitUser,
    error: null,
    loading: false
}