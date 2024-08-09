import {Item} from "./Item.model";

export interface Store {
  _id: string;
  name: string;
  address: string;
  items?: Item[]; // Items linked to this store
}
