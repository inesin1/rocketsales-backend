import {HttpException, Injectable} from "@nestjs/common";
import {User} from "../../types/User";
import axios from '../../config/axios.config'
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
    constructor(
      private readonly authService: AuthService
    ) {}

    // Возвращает пользователя по id
    async getUser(id: number): Promise<User | void> {
        try {
            // Если токен истек, обновляем его
            if (this.authService.isExpired()) {
                await this.authService.refreshToken();
            }

            // Делаем запрос на получение пользователя по id
            const { data } = await axios.get(`users/${id}`)

            // Возвращаем пользователя
            return {
                id: data.id,
                name: data.name
            }
        } catch (e) {
            console.log(`При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${JSON.stringify(e.response.data)}`);
            throw new HttpException(e.response.data, e.response.status);
        }
    }
}