import { Controller, Get, HttpException, Query } from "@nestjs/common";
import { AppService } from './app.service';
import { Lead } from "./models/Lead";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Обработчик основного запроса для получения сделок и их контактов
  @Get('/api/leads')
  async getLeads(@Query('query') query :string): Promise<Lead[] | string> {
    try {
      return await this.appService.getLeads(query);
    } catch (e) {
      // При ошибках выкидываем exception с кодом и описанием
      throw new HttpException(e.response, e.status);
    }
  }
}
