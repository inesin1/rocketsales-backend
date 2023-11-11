import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Lead } from "../types/Lead";
import { Status } from "../types/Status";
import { Contact } from "../types/Contact";
import * as process from "process";
import { User } from "../types/User";
import axios from '../config/axios.config'

@Injectable()
export class LeadService {
  // Возвращает сделки и их контакты. Если указана строка поиска query, производит фильтрацию по ней
  async getLeads(query: string): Promise<Lead[]> {
    // Если не авторизованы - делаем это
    if (!this.authData) this.authData = await this.auth();

    return await axios.get(
      `leads`,
      {
        params: {
          with: 'contacts',
          query: query
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


}