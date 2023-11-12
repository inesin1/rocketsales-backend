import { Module } from '@nestjs/common';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { UserModule } from '../user/user.module';
import { ContactModule } from '../contact/contact.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UserModule, ContactModule, AuthModule],
  controllers: [LeadController],
  providers: [LeadService]
})
export class LeadModule {}