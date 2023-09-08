
export interface IUser {
    id: string,
    email: string,
    role: {
        _id: string,
        name: string

    },
    permission?: {
        _id: string,
        name: string,
        apiPath:string,
        module:string

    }[],

}