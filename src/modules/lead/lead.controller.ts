import { Controller, Get, HttpException, Query } from "@nestjs/common";
import { LeadService } from './lead.service';
import { Lead } from "../../types/Lead";
import {User} from "../../types/User";
import {UserService} from "../user/user.service";

@Controller()
export class LeadController {
  constructor(private readonly leadService: LeadService, private readonly userService: UserService) {}

  // Обработчик основного запроса для получения сделок и их контактов
  @Get('/api/leads')
  async getLeads(@Query('query') query :string): Promise<Lead[] | string> {
    try {
      return await this.leadService.getLeads(query);
    } catch (e) {
      // При ошибках выкидываем exception с кодом и описанием
      throw new HttpException(e.response, e.status);
    }
  }

  @Get('/api/users')
  async getUsers(@Query('id') id: number): Promise<User | string> {
    try {
      return await this.userService.getUser(id);
    } catch (e) {
      throw new HttpException(e.response, e.status);
    }
  }
}
