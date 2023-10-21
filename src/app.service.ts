import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Auth } from "./models/Auth";
import { Lead } from "./models/Lead";
import { Status } from "./models/Status";
import { Contact } from "./models/Contact";
import * as process from "process";
import { User } from "./models/User";

@Injectable()
export class AppService {
  apiURL: string = 'https://artemnesin.amocrm.ru/api/v4';
  authData: Auth;

  /**
   * Авторизовывает пользователя и возвращает авторизационные данные
   *
   * @return {Promise<Auth>} Авторизационные данные
   */
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

    return fetch(
      `https://artemnesin.amocrm.ru/oauth2/access_token`,
      {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      }
    )
      .then(res => res.json())
  }

  /**
   * Возвращает сделки и их контакты. Если указана строка поиска query, производит фильтрацию по ней
   *
   * @param {string} query - Строка поиска
   * @return {Promise<Lead[]>} Отфильтрованные сделки и их контакты
   */
  async getLeads(query: string): Promise<Lead[]> {
    // Если не авторизованы - делаем это
    if (!this.authData) this.authData = await this.auth();

    return fetch(
      `${this.apiURL}/leads?with=contacts&query=${query}`,
      {
      headers: {
        Authorization: `${this.authData.token_type} ${this.authData.access_token}`,
      },
      })
      .then(res => {
        //Обработка ошибок авторизации и поиска
        if (res.status == 204)
          throw new HttpException('No content', HttpStatus.NO_CONTENT);
        if (res.status == 401)
          throw new HttpException('Unauthorized' , HttpStatus.UNAUTHORIZED);

        return res.json();
      })
      .then(data => {
        // Забираем сделки
        const leads = data._embedded.leads;

        // Перебираем сделки, приводим их в нужный вид и возвращаем
        return Promise.all(leads.map(async lead => {

          // Запрашиваем статус, контакты и ответственного пользователя
          const status = await this.getStatus(lead.pipeline_id, lead.status_id);
          // Тк контакт может быть не один, перебираем их и возвращаем объект Contact для каждого
          const contacts: Contact[] = await Promise.all(
            lead._embedded.contacts.map(
              async contact => {
                return await this.getContact(contact.id);
              }));
          const responsibleUser = await this.getUser(lead.responsible_user_id)

          // Формируем объект сделки в нужном виде и возвращаем
          return {
            id: lead.id,
            name: lead.name,
            price: lead.price,
            status: status,
            responsible_user: responsibleUser,
            created_at: new Date(lead.created_at * 1000).toLocaleString(),
            contacts: contacts
          }
        })
        )
      });
  }

  /**
   * Возвращает статус по id в указанной воронке
   *
   * @param {number} pipelineId - id воронки
   * @param {number} statusId - id статуса
   * @return {Promise<Status>} Найденный статус
   */
  async getStatus(pipelineId: number, statusId: number): Promise<Status | void> {
    return fetch(
      `${this.apiURL}/leads/pipelines/${pipelineId}/statuses/${statusId}`,
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
          color: data.color
        }
      })
      .catch(e => console.log(e));
  }

  /**
   * Возвращает контакт по id
   *
   * @param {number} id - id контакта
   * @return {Promise<Contact>} Найденный контакт
   */
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

  /**
   * Возвращает пользователя по id
   *
   * @param {number} id - id пользователя
   * @return {Promise<User>} Найденный пользователь
   */
  async getUser(id: number): Promise<User | void> {
    return fetch(
      `${this.apiURL}/users/${id}`,
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
        }
      })
      .catch(e => console.log(e));
  }
}