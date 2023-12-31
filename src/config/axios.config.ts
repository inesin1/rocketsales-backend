import axios from 'axios'
import amoCRMConfig from "./amoCRM.config";

const instance = axios.create({
    baseURL: 'https://jetbrainswebstorm1.amocrm.ru/api/v4/',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${amoCRMConfig.getToken().access_token}`
    }
})

export default instance