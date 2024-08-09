import {Item} from "./Item.model";
import {Store} from "./Store.model";

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: 'volunteer' | 'manager' | 'admin';
  password?: string; // Optional for update scenarios
  storeId: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse {
  message?: string;
  data?: {
    isAuthenticated: boolean;
    user?: User;
    users?: User[];
    item?: Item;
    items?: Item[];
    store?: Store;
    stores?: Store[];
  }
  error?: string;
}
