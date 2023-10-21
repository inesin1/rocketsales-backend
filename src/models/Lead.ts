import { Contact } from "./Contact";
import { Status } from "./Status";
import { User } from "./User";

export interface Lead {
  id: number,
  name: string,
  price: number,
  status: Status,
  responsible_user: User,
  created_at: string,
  contacts: Contact[]
}