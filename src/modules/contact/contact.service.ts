import {HttpException, Injectable} from "@nestjs/common";
import {Contact} from "../../types/Contact";
import axios from '../../config/axios.config'
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ContactService {
    constructor(
      private readonly authService: AuthService
    ) {}

    // Возвращает контакт по id
    async getContact(id: number): Promise<Contact | void> {
        try {
            // Если токен истек, обновляем его
            if (this.authService.isExpired()) {
                await this.authService.refreshToken();
            }

            // Делаем запрос на получение контакта по id
            const { data } = await axios.get(`contacts/${id}`)

            // Возвращаем контакт
            return {
                id: data.id,
                name: data.name,
                phone_number: data.custom_fields_values[0].field_name === 'Телефон' ? data.custom_fields_values[0].values[0].value : undefined,
                email: data.custom_fields_values[1].field_name === 'Email' ? data.custom_fields_values[1].values[0].value : undefined,
            }
        } catch (e) {
            console.log(`При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${JSON.stringify(e.response.data)}`);
            throw new HttpException(e.response.data, e.response.status);
        }
    }
}