import axios from 'axios'
import amoCRMConfig from "./amoCRM.config";

const instance = axios.create({
    baseURL: 'https://jetbrainswebstorm1.amocrm.ru/api/v4/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `${amoCRMConfig.token.token_type} ${amoCRMConfig.token.access_token}`
    }
})

export default instance