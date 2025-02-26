export interface ITurno {
    id?:     number;
    date:   string;
    hour:   string;
    status: string;
    user?:   {id: number}; // ✅ user es un objeto con id
}

export interface IUserDetail {
    id: number;
    name: string;
    turns: ITurno[];
  }
