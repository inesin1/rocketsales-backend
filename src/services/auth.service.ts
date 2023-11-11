import {Injectable} from "@nestjs/common";
import {Auth} from "../types/Auth";
import process from "process";
import axios from '../config/axios.config'

@Injectable()
export class AuthService {
    private authData: Auth;

    // Авторизовывает пользователя и возвращает авторизационные данные
    async auth(): Promise<Auth> {
        const body = {
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: "http://localhost:3000/"
        };

        if (this.authData) {
            body['grant_type'] = "refresh_token"
            body['refresh_token'] = this.authData.refresh_token
        } else {
            body['code'] = process.env.AUTHORIZATION_CODE;
        }



        return await axios.post('http://', body)
    }
}