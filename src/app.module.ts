import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { AllergiesModule } from './allergies/allergies.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    DatabaseModule,
    AuthModule,
    PatientsModule,
    AllergiesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
