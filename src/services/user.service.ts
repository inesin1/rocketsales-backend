import {Injectable} from "@nestjs/common";
import {User} from "../types/User";
import axios from '../config/axios.config'

@Injectable()
export class UserService {
    // Возвращает пользователя по id
    async getUser(id: number): Promise<User | void> {
        try {
            const response = await axios.get<User>(`users/${id}`)
            return response.data
        } catch (e) {
            console.log(`При выполнении запроса произошла ошибка: ${e.message}`)
        }
    }
}