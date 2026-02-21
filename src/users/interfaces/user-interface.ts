export interface IUser{
    id?:string,
    name:string,
    username:string,
    email:string,
    password:string,
    createdAt?:Date,
    updateAt?:Date,
}

export type PostUser=Omit<IUser,'id'|'createdAt'|'updateAt'> 