import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../controllers/app.controller';
import { LeadService } from '../services/lead.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [LeadService],
})
export class AppModule {}
