import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ContactService],
  exports: [ContactService]
})
export class ContactModule {}