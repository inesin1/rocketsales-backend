import {Injectable} from "@nestjs/common";
import axios from 'axios'
import amoCRMConfig from '../../config/amoCRM.config'
import { AuthRequestDto } from './dto/auth-request.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
    // Обновляет access token
    async refreshToken(): Promise<string> {
        try {
            const body: AuthRequestDto = {
                client_id: amoCRMConfig.keys.client_id,
                client_secret: amoCRMConfig.keys.client_secret,
                grant_type: 'refresh_token',
                refresh_token: amoCRMConfig.token.refresh_token,
                redirect_uri: "http://localhost:3000/"
            };

            const { data } = await axios.post<AuthResponseDto>(
              'https://jetbrainswebstorm1.amocrm.ru/oauth2/access_token',
              body
            );

            amoCRMConfig.token = data;

            return 'access token обновлен'
        } catch (e) {
            console.log(`При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${e.response.data}`);
            return `При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${e.response.data}`;
        }
    }
}