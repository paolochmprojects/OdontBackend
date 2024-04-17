import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseModule } from 'src/database/database.module';
import { AllergiesController } from './allergies.controller';
import { AllergiesService } from './allergies.service';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [AllergiesController],
  providers: [AllergiesService],
})
export class AllergiesModule {}
