import { Module } from '@nestjs/common';
/*import { ConfigModule } from '@nestjs/config';*/
import { LeadModule } from './modules/lead/lead.module';
import { ContactModule } from './modules/contact/contact.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
/*    ConfigModule.forRoot({isGlobal: true}),*/
    LeadModule,
    ContactModule,
    UserModule,
    AuthModule
  ],
})
export class AppModule {}
