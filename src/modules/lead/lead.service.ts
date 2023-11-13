import {HttpException, Injectable} from "@nestjs/common";
import { Lead } from "../../types/Lead";
import { Status } from "../../types/Status";
import { Contact } from "../../types/Contact";
import axios from '../../config/axios.config'
import { ContactService } from '../contact/contact.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import async from 'async'

@Injectable()
export class LeadService {
  constructor(
    private readonly contactService: ContactService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  // Возвращает сделки и их контакты. Если указана строка поиска query, производит фильтрацию по ней
  async getLeads(query: string): Promise<Lead[] | void> {
    try {
      // Если токен истек, обновляем его
      if (this.authService.isExpired()) {
          await this.authService.refreshToken();
      }

      // Делаем запрос на получение сделок
      const { data } = await axios.get(
          `leads`,
          {
            params:
                {
                  with: 'contacts',
                  query: query
            },
          }
      );

      // Забираем сделки
      const leadsRaw = data._embedded.leads;

      // Перебираем сделки, приводим их в нужный вид и возвращаем
      return await async.map(leadsRaw, async (lead) => {
          // Запрашиваем статус, контакты и ответственного пользователя

          const status = await this.getStatus(lead.pipeline_id, lead.status_id);

          const contacts: Contact[] = await async.map(
              lead._embedded.contacts,
              async (contact) => {
                  return await this.contactService.getContact(contact.id);
              });

          const responsibleUser = await this.userService.getUser(lead.responsible_user_id)

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
    } catch (e) {
        console.log(`При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${JSON.stringify(e.response.data)}`)
        throw new HttpException(e.response.data, e.response.status);
    }
  }

  // Возвращает статус сделки по id в указанной воронке
  async getStatus(pipelineId: number, statusId: number): Promise<Status | void> {
    try {
      const { data } = await axios.get(`leads/pipelines/${pipelineId}/statuses/${statusId}`)
      return {
          id: data.id,
          name: data.name,
          color: data.color
      };
    } catch (e) {
        console.log(`При выполнении запроса произошла ошибка: ${e}. Ответ сервера: ${e.response.data}`);
        throw new HttpException(e.response.data, e.response.status);
    }
  }
}