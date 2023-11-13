import {AuthResponseDto} from "../modules/auth/dto/auth-response.dto";
import { readFileSync } from 'fs';
import { resolve } from 'path'

export default {
    keys: {
        client_id: 'bf39c690-cc49-4771-833b-b65b77da0505',
        client_secret: 'jdYp764m9fTLVi3Oovor92Ho2PxyWMRJZ6xMnuharvCgVin5dekAKKN14RcM8AW9',
    },
    getToken: function (): AuthResponseDto {
        try {
            const data = readFileSync(
                resolve(__dirname, '../../src/modules/auth/auth_token.json'),
                'utf8'
            );
            return JSON.parse(data.toString());
        } catch (e) {
            console.log(`При чтении файла произошла ошибка: ${e}`)
        }
    }
}