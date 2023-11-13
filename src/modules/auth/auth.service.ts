import {HttpException, Injectable} from "@nestjs/common";
import axios from 'axios'
import amoCRMConfig from '../../config/amoCRM.config'
import { AuthRequestDto } from './dto/auth-request.dto';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class AuthService {
    private tokenPath: string = resolve(__dirname, '../../../src/modules/auth/auth_token.json')

    // Проверяет актуальность токена, возвращает true если токен истек
    isExpired(): boolean {
        const token = amoCRMConfig.getToken();
        return Date.now() - token.created_at > token.expires_in * 1000;
    }

    // Обновляет access token
    async refreshToken(): Promise<string> {
        try {
            const body: AuthRequestDto = {
                client_id: amoCRMConfig.keys.client_id,
                client_secret: amoCRMConfig.keys.client_secret,
                grant_type: 'refresh_token',
                refresh_token: amoCRMConfig.getToken().refresh_token,
                redirect_uri: "http://localhost:3000/"
            };

            const { data } = await axios.post(
              'https://jetbrainswebstorm1.amocrm.ru/oauth2/access_token',
              body
            );

            data.created_at = Date.now();

            writeFileSync(
                this.tokenPath,
                JSON.stringify(data, null, 4),
                'utf8'
            )

            return 'access token обновлен'
        } catch (e) {
            if (axios.isAxiosError(e)) {
                console.log(`При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${JSON.stringify(e.response.data)}`);
                throw new HttpException(e.response.data, e.response.status);
            }
            else {
                console.log(`Произошла ошибка: ${e}`);
                throw new HttpException(e.message, 400);
            }
        }
    }
}