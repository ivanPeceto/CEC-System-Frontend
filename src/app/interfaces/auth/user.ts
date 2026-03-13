import { Roles } from "../../types/roles";

export interface User {
    id: string;
    username: string;
    email: string;
    rol: Roles;
}