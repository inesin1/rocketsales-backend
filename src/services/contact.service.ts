import {Injectable} from "@nestjs/common";
import {Contact} from "../types/Contact";

@Injectable()
export class ContactService {
    // Возвращает контакт по id
    async getContact(id: number): Promise<Contact | void> {
        return fetch(
            `${this.apiURL}/contacts/${id}`,
            {
                headers: {
                    Authorization: `${this.authData.token_type} ${this.authData.access_token}`,
                }
            }
        )
            .then(res => res.json())
            .then(data => {
                return {
                    id: data.id,
                    name: data.name,
                    phone_number: data.custom_fields_values[0].field_name === 'Телефон' ? data.custom_fields_values[0].values[0].value : undefined,
                    email: data.custom_fields_values[1].field_name === 'Email' ? data.custom_fields_values[1].values[0].value : undefined,
                }
            })
            .catch(e => console.log(e));
    }
}