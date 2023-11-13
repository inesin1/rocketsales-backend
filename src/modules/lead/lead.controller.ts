import { Controller, Get, HttpException, Query } from "@nestjs/common";
import { LeadService } from './lead.service';
import { Lead } from "../../types/Lead";

@Controller()
export class LeadController {
  constructor(private readonly leadService: LeadService,) {}

  // Обработчик основного запроса для получения сделок и их контактов
  @Get('/api/leads')
  async getLeads(@Query('query') query :string): Promise<Lead[] | void> {
    try {
      return await this.leadService.getLeads(query);
    } catch (e) {
      // При ошибках выкидываем exception с кодом и описанием
      throw new HttpException(e.response, e.status);
    }
  }
}
