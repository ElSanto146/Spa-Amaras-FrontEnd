export interface IUser {
    id: number;
    username: string;
    name: string;
    roles : string[]; 
    phone: string; 
    img?: string;
}