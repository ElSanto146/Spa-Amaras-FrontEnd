export interface IUserDetail {
    id:       number;
    name:     string;
    username: string;
    phone:    string;
    role:     string;
    turns:    Turn[];
}

export interface Turn {
    id?:     number;
    date:   string;
    hour:   string;
    status: string;
    user:   null;
}
