import { Injectable } from "@nestjs/common";
import { Lead } from "../../types/Lead";
import { Status } from "../../types/Status";
import { Contact } from "../../types/Contact";
import axios from '../../config/axios.config'
import { ContactService } from '../contact/contact.service';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class LeadService {
  constructor(
    private readonly contactService: ContactService,
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  // Возвращает сделки и их контакты. Если указана строка поиска query, производит фильтрацию по ней
  async getLeads(query: string): Promise<Lead[]> {
    try {
      // Обновляем токен
      await this.authService.refreshToken();

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
      const leads = data._embedded.leads;

      // Перебираем сделки, приводим их в нужный вид и возвращаем
      return Promise.all(leads.map(async lead => {

            // Запрашиваем статус, контакты и ответственного пользователя
            const status = await this.getStatus(lead.pipeline_id, lead.status_id);
            // Тк контакт может быть не один, перебираем их и возвращаем объект Contact для каждого
            const contacts: Contact[] = await Promise.all(
                lead._embedded.contacts.map(
                    async contact => {
                      return await this.contactService.getContact(contact.id);
                    }));
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
      )
    } catch (e) {
      console.log(`При выполнении запроса произошла ошибка: ${e.message}`)
    }
  }

  // Возвращает статус сделки по id в указанной воронке
  async getStatus(pipelineId: number, statusId: number): Promise<Status | void> {
    try {
      const response = await axios.get<Status>(`leads/pipelines/${pipelineId}/statuses/${statusId}`)
      return response.data
    } catch (e) {
      console.log(`При выполнении запроса произошла ошибка: ${e.message}`)
    }
  }
}